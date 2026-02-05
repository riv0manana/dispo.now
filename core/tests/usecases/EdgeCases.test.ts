import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'

Deno.test('Edge Case: Zero duration booking should fail', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 10, metadata: {} })

  const now = new Date()
  
  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'r1',
      start: now,
      end: now, // Same as start
      quantity: 1,
      metadata: {}
    }),
    Error, 
    'InvalidTimeRange'
  )
})

Deno.test('Edge Case: Resource with 0 capacity should reject any booking', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  // Resource has 0 capacity
  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 0, metadata: {} })

  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'r1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 1,
      metadata: {}
    }),
    Error, // CapacitySchema should reject 0? Or assertCapacity?
    // Let's check CapacitySchema. If it allows 0, assertCapacity will fail because 1 > 0.
    // If CapacitySchema enforces min(1), it will fail there.
  )
})

Deno.test('Edge Case: Very high quantity booking', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 5, metadata: {} })

  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'r1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 6, // > 5
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})

Deno.test('Edge Case: Boundary overlap - End touches Start (Should succeed)', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })

  // Booking A: 10:00 - 11:00
  await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    metadata: {}
  })

  // Booking B: 11:00 - 12:00 (Starts exactly when A ends)
  // Should succeed because range is [start, end) usually, or logic checks strict inequality
  const id = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T11:00:00Z'),
    end: new Date('2024-01-01T12:00:00Z'),
    quantity: 1,
    metadata: {}
  })

  assertEquals(typeof id, 'string')
})
