import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

// Helper to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to make repo slow (monkey-patching)
function makeRepoSlow(repo: FakeBookingRepository) {
  const originalSave = repo.save
  const originalFindOverlapping = repo.findOverlapping
  
  // @ts-ignore: Monkey patching for test
  repo.save = async (booking) => {
    await delay(10) // Simulate DB write latency
    return originalSave.call(repo, booking)
  }
  // @ts-ignore: Monkey patching for test
  repo.findOverlapping = async (params) => {
    await delay(10) // Simulate DB read latency
    return originalFindOverlapping.call(repo, params)
  }
  
  // Return restore function
  return () => {
    repo.save = originalSave
    repo.findOverlapping = originalFindOverlapping
  }
}

Deno.test('SCENARIO: Resource Isolation - Booking R1 does not block R2', async () => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()

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
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()

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
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()

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
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()

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
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()
  
  // Make repo slow
  const restore = makeRepoSlow(bookingRepo)

  try {
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
    assertEquals(successes, 1, 'With locking (even in Fakes), race condition should be prevented')
  } finally {
    restore()
  }
})

Deno.test('SCENARIO: Stress Test - 2000 Concurrent Requests', async () => {
  // This test proves that the Locking mechanism works under heavy load.
  // We use the upgraded Fake implementation which now supports mutex locking.
  
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')

  bookingRepo.clear()
  resourceRepo.clear()

  // Make repo slow
  const restore = makeRepoSlow(bookingRepo)

  try {
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
  } finally {
    restore()
  }
})
