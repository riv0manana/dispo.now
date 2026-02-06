import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('Group Booking: Atomicity - All or Nothing', async () => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateGroupBookingUseCase')
  const idGen = loadDeps('IdGenerator')

  // Patch IdGenerator for unique IDs
  const originalGenerate = idGen.generate
  ;(idGen as any).generate = () => crypto.randomUUID()
  
  bookingRepo.clear()
  resourceRepo.clear()

  try {
    const projectId = 'proj-1'
    const timeStart = new Date('2024-02-01T14:00:00Z')
    const timeEnd = new Date('2024-02-01T16:00:00Z')

    // Setup: 
    // Resource A: Capacity 5
    // Resource B: Capacity 2
    await resourceRepo.save({ id: 'res-A', projectId, name: 'A', defaultCapacity: 5, metadata: {} })
    await resourceRepo.save({ id: 'res-B', projectId, name: 'B', defaultCapacity: 2, metadata: {} })

    // Action: Try to book valid A (3 spots) and INVALID B (3 spots > 2)
    await assertRejects(
      () => uc.execute({
        projectId,
        bookings: [
          {
            resourceId: 'res-A',
            start: timeStart,
            end: timeEnd,
            quantity: 3,
            metadata: {}
          },
          {
            resourceId: 'res-B',
            start: timeStart,
            end: timeEnd,
            quantity: 3, // Exceeds capacity of 2
            metadata: {}
          }
        ]
      }),
      Error,
      'CapacityExceeded'
    )

    // Assert: No bookings should exist for A or B
    const bookingsA = await bookingRepo.findByResourceId('res-A', { start: timeStart, end: timeEnd })
    const bookingsB = await bookingRepo.findByResourceId('res-B', { start: timeStart, end: timeEnd })

    assertEquals(bookingsA.length, 0, 'Booking A should not be created if Booking B fails')
    assertEquals(bookingsB.length, 0, 'Booking B should not be created')
  } finally {
    // Restore IdGenerator
    ;(idGen as any).generate = originalGenerate
  }
})

Deno.test('Group Booking: Success Scenario', async () => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateGroupBookingUseCase')
  const idGen = loadDeps('IdGenerator')

  const originalGenerate = idGen.generate
  ;(idGen as any).generate = () => crypto.randomUUID()
  
  bookingRepo.clear()
  resourceRepo.clear()

  try {
    const projectId = 'proj-1'
    const timeStart = new Date('2024-02-01T14:00:00Z')
    const timeEnd = new Date('2024-02-01T16:00:00Z')

    await resourceRepo.save({ id: 'res-A', projectId, name: 'A', defaultCapacity: 5, metadata: {} })
    await resourceRepo.save({ id: 'res-B', projectId, name: 'B', defaultCapacity: 2, metadata: {} })

    const ids = await uc.execute({
      projectId,
      bookings: [
        {
          resourceId: 'res-A',
          start: timeStart,
          end: timeEnd,
          quantity: 3,
          metadata: {}
        },
        {
          resourceId: 'res-B',
          start: timeStart,
          end: timeEnd,
          quantity: 2,
          metadata: {}
        }
      ]
    })

    assertEquals(ids.length, 2)
    
    const bookingsA = await bookingRepo.findByResourceId('res-A', { start: timeStart, end: timeEnd })
    const bookingsB = await bookingRepo.findByResourceId('res-B', { start: timeStart, end: timeEnd })

    assertEquals(bookingsA.length, 1)
    assertEquals(bookingsB.length, 1)
  } finally {
    ;(idGen as any).generate = originalGenerate
  }
})

Deno.test('Group Booking: Self-Overlap Capacity Check', async () => {
  // Test that booking multiple times on SAME resource in SAME group request respects capacity
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateGroupBookingUseCase')
  const idGen = loadDeps('IdGenerator')

  const originalGenerate = idGen.generate
  ;(idGen as any).generate = () => crypto.randomUUID()
  
  bookingRepo.clear()
  resourceRepo.clear()

  try {
    const projectId = 'proj-1'
    const timeStart = new Date('2024-02-01T14:00:00Z')
    const timeEnd = new Date('2024-02-01T16:00:00Z')

    // Resource Capacity: 5
    await resourceRepo.save({ id: 'res-A', projectId, name: 'A', defaultCapacity: 5, metadata: {} })

    // 1. Request: 3 spots
    // 2. Request: 3 spots
    // Total: 6 > 5 -> Should Fail
    await assertRejects(
      () => uc.execute({
        projectId,
        bookings: [
          {
            resourceId: 'res-A',
            start: timeStart,
            end: timeEnd,
            quantity: 3,
            metadata: {}
          },
          {
            resourceId: 'res-A',
            start: timeStart,
            end: timeEnd,
            quantity: 3,
            metadata: {}
          }
        ]
      }),
      Error,
      'CapacityExceeded'
    )
  } finally {
    ;(idGen as any).generate = originalGenerate
  }
})
