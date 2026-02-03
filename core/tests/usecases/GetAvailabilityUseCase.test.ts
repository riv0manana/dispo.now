import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { GetAvailabilityUseCase } from '@/core/application/usecases/GetAvailabilityUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('GetAvailability: Basic Slots', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetAvailabilityUseCase(resourceRepo, bookingRepo)

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })

  const slots = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T12:00:00Z'),
    slotDurationMinutes: 60
  })

  // 09-10, 10-11, 11-12
  assertEquals(slots.length, 3)
  assertEquals(slots[0].start, '2024-01-01T09:00:00.000Z')
  assertEquals(slots[0].available, 1)
})

Deno.test('GetAvailability: Capacity Reduction', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetAvailabilityUseCase(resourceRepo, bookingRepo)

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 5, metadata: {} })
  
  // Booking 10:00-11:00, Qty 2
  await bookingRepo.save({
    id: 'b1',
    projectId: 'p1',
    resourceId: 'r1',
    timeRange: { start: new Date('2024-01-01T10:00:00Z'), end: new Date('2024-01-01T11:00:00Z') },
    quantity: 2,
    status: 'active',
    metadata: {}
  })

  const slots = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T12:00:00Z'),
    slotDurationMinutes: 60
  })

  // 09-10: 5 avail
  // 10-11: 3 avail (5-2)
  // 11-12: 5 avail
  assertEquals(slots[0].available, 5)
  assertEquals(slots[1].available, 3)
  assertEquals(slots[2].available, 5)
})

Deno.test('GetAvailability: Respects Operating Hours', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetAvailabilityUseCase(resourceRepo, bookingRepo)

  await resourceRepo.save({
    id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {},
    bookingConfig: {
      daily: { start: '10:00', end: '12:00' }, // Only 10-12
      weekly: { availableDays: [1] } // Monday
    }
  })

  // Request for Monday 2024-01-01 (is a Monday) 08:00 - 14:00
  const slots = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T08:00:00Z'),
    end: new Date('2024-01-01T14:00:00Z'),
    slotDurationMinutes: 60
  })

  // Should only get 10:00-11:00 and 11:00-12:00
  assertEquals(slots.length, 2)
  assertEquals(slots[0].start, '2024-01-01T10:00:00.000Z')
  assertEquals(slots[1].start, '2024-01-01T11:00:00.000Z')
})

Deno.test('GetAvailability: Respects Closed Days', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetAvailabilityUseCase(resourceRepo, bookingRepo)

  await resourceRepo.save({
    id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {},
    bookingConfig: {
      weekly: { availableDays: [2] } // Tuesday only
    }
  })

  // Request for Monday 2024-01-01
  const slots = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T12:00:00Z'),
    slotDurationMinutes: 60
  })

  assertEquals(slots.length, 0)
})

Deno.test('GetAvailability: Security Check', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetAvailabilityUseCase(resourceRepo, bookingRepo)

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })

  await assertRejects(
    () => uc.execute({
      projectId: 'p2', // Wrong project
      resourceId: 'r1',
      start: new Date(),
      end: new Date()
    }),
    Error,
    'ResourceDoesNotBelongToProject'
  )
})
