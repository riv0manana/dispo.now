import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'
import { Booking } from '@/core/domain/booking/Booking.schema.ts'

// Helper to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Extended FakeRepo to simulate DB latency for race condition testing
class SlowFakeBookingRepository extends FakeBookingRepository {
  override async findOverlapping(params: any) {
    await delay(10) // Simulate DB read latency
    return super.findOverlapping(params)
  }
  override async save(booking: Booking) {
    await delay(10) // Simulate DB write latency
    return super.save(booking)
  }
  override async findByResourceId(resourceId: string, timeRange: any) {
    return super.findByResourceId(resourceId, timeRange)
  }
}

Deno.test('SCENARIO: Resource Isolation - Booking R1 does not block R2', async () => {
  const repo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  // Setup Resources
  await resourceRepo.save({ id: 'R1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })
  await resourceRepo.save({ id: 'R2', projectId: 'p1', name: 'R2', defaultCapacity: 1, metadata: {} })
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Book R2 (Capacity 1) - Should succeed despite overlapping time
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R2', // Different resource
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Book R1 again - Should fail
  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 1,
      capacity: 1,
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})

Deno.test('SCENARIO: Mixed Capacities - R1(Cap=1) vs R2(Cap=5)', async () => {
  const repo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'R1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })
  await resourceRepo.save({ id: 'R2', projectId: 'p1', name: 'R2', defaultCapacity: 5, metadata: {} })
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Partially fill R2 (3/5)
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R2',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 3,
    capacity: 5,
    metadata: {}
  })

  // Add more to R2 (2/5) -> Total 5/5
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R2',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 2,
    capacity: 5,
    metadata: {}
  })

  // Overflow R2
  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R2',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 1,
      capacity: 5,
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})

Deno.test('SCENARIO: Time Boundaries - Touching intervals are allowed', async () => {
  const repo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'R1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Booking B: 11:00 - 12:00 (Starts exactly when A ends) -> Should succeed
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start: new Date('2024-01-01T11:00:00Z'),
    end: new Date('2024-01-01T12:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Booking C: 09:00 - 10:00 (Ends exactly when A starts) -> Should succeed
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T10:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  // Booking D: 10:59 - 11:01 (Overlaps A) -> Should fail
  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: new Date('2024-01-01T10:59:00Z'),
      end: new Date('2024-01-01T11:01:00Z'),
      quantity: 1,
      capacity: 1,
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})

Deno.test('SCENARIO: Recurring Bookings - 4 Weekly slots', async () => {
  const repo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'R1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })

  const mondays = [
    { start: new Date('2024-01-01T10:00:00Z'), end: new Date('2024-01-01T11:00:00Z') },
    { start: new Date('2024-01-08T10:00:00Z'), end: new Date('2024-01-08T11:00:00Z') },
    { start: new Date('2024-01-15T10:00:00Z'), end: new Date('2024-01-15T11:00:00Z') },
    { start: new Date('2024-01-22T10:00:00Z'), end: new Date('2024-01-22T11:00:00Z') }
  ]

  // Book all mondays
  for (const slot of mondays) {
    await uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: slot.start,
      end: slot.end,
      quantity: 1,
      capacity: 1,
      metadata: { type: 'recurring' }
    })
  }

  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: mondays[2].start,
      end: mondays[2].end,
      quantity: 1,
      capacity: 1,
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})

Deno.test('SCENARIO: Concurrency - Race Condition Check', async () => {
  const repo = new SlowFakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'R_RACE', projectId: 'p1', name: 'R_RACE', defaultCapacity: 1, metadata: {} })

  const commonRequest = {
    projectId: 'p1',
    resourceId: 'R_RACE',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1, // Only 1 allowed
    metadata: {}
  }
  
  const p1 = uc.execute(commonRequest)
  const p2 = uc.execute(commonRequest)

  const results = await Promise.allSettled([p1, p2])
  
  const successes = results.filter(r => r.status === 'fulfilled').length
  
  // NOTE: We upgraded FakeTransactionManager to support REAL locking simulation.
  // So now, even in Fakes, we expect the race condition to be PREVENTED.
  if (successes > 1) {
    console.warn('⚠️  Race condition detected: Multiple bookings created exceeding capacity.')
  }

  // Expectation: 1 Success (Locked), 1 Failure (Blocked then CapacityExceeded)
  // Why? 
  // 1. T1 locks Resource.
  // 2. T2 waits for Resource lock.
  // 3. T1 books & commits (Release lock).
  // 4. T2 acquires lock, reads bookings, sees T1's booking -> CapacityExceeded.
  assertEquals(successes, 1, 'With locking (even in Fakes), race condition should be prevented')
})

Deno.test('SCENARIO: Stress Test - 2000 Concurrent Requests', async () => {
  // This test proves that the Locking mechanism works under heavy load.
  // We use the upgraded Fake implementation which now supports mutex locking.
  
  const repo = new SlowFakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(repo, resourceRepo, { generate: () => crypto.randomUUID() }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'R_STRESS', projectId: 'p1', name: 'R_STRESS', defaultCapacity: 1, metadata: {} })

  const commonRequest = {
    projectId: 'p1',
    resourceId: 'R_STRESS',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1, // Only 1 allowed
    metadata: {}
  }

  // Create 2000 concurrent requests
  const requests = Array.from({ length: 2000 }, () => uc.execute(commonRequest))
  
  const results = await Promise.allSettled(requests)
  const successes = results.filter(r => r.status === 'fulfilled').length
  const failures = results.filter(r => r.status === 'rejected').length

  console.log(`Stress Test Results: ${successes} Successes, ${failures} Failures`)
  
  if (successes > 1) {
    console.warn('⚠️  STRESS TEST FAILED: Overbooking Detected!')
    console.warn(`    Capacity: 1. Bookings Created: ${successes}.`)
  } else {
    console.log('✅ STRESS TEST PASSED: Locking prevented overbooking.')
  }

  // We expect exactly 1 success and 1999 failures
  assertEquals(successes, 1)
  assertEquals(failures, 1999)
})
