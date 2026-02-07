import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { Resource } from '@/core/domain/resource/Resource.schema.ts'

Deno.test('CreateRecurringBookingUseCase', async (t) => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const useCase = loadDeps('CreateRecurringBookingUseCase')
  const idGen = loadDeps('IdGenerator')

  // Patch IdGenerator for unique IDs
  const originalGenerate = idGen.generate
  ;(idGen as any).generate = () => 'uuid-' + Math.random()
  
  bookingRepo.clear()
  resourceRepo.clear()

  try {
    const resource: Resource = {
      id: 'res-1',
      projectId: 'proj-1',
      name: 'Meeting Room',
      defaultCapacity: 5,
      metadata: {},
      bookingConfig: {
        daily: { start: '09:00', end: '17:00' },
        weekly: { availableDays: [1, 2, 3, 4, 5] }
      }
    }

    await resourceRepo.save(resource)

    await t.step('Daily Recurrence (3 days)', async () => {
      // Mon 10-11, Tue 10-11, Wed 10-11
      const ids = await useCase.execute({
        projectId: 'proj-1',
        resourceId: 'res-1',
        start: new Date('2024-01-01T10:00:00Z'), // Monday
        end: new Date('2024-01-01T11:00:00Z'),
        quantity: 1,
        recurrence: {
          frequency: 'daily',
          interval: 1,
          count: 3
        },
        metadata: {}
      })

      assertEquals(ids.length, 3)
      
      // Check stored bookings
      const b1 = await bookingRepo.findById(ids[0])
      const b2 = await bookingRepo.findById(ids[1])
      const b3 = await bookingRepo.findById(ids[2])

      assertEquals(b1?.timeRange.start.toISOString(), '2024-01-01T10:00:00.000Z')
      assertEquals(b2?.timeRange.start.toISOString(), '2024-01-02T10:00:00.000Z')
      assertEquals(b3?.timeRange.start.toISOString(), '2024-01-03T10:00:00.000Z')
    })

    await t.step('Weekly Recurrence (Every Wed for 2 weeks)', async () => {
      const ids = await useCase.execute({
        projectId: 'proj-1',
        resourceId: 'res-1',
        start: new Date('2024-01-03T10:00:00Z'), // Wednesday
        end: new Date('2024-01-03T11:00:00Z'),
        quantity: 1,
        recurrence: {
          frequency: 'weekly',
          interval: 1,
          count: 2
        },
        metadata: {}
      })

      assertEquals(ids.length, 2)
      const b1 = await bookingRepo.findById(ids[0])
      const b2 = await bookingRepo.findById(ids[1])
      
      assertEquals(b1?.timeRange.start.toISOString(), '2024-01-03T10:00:00.000Z')
      assertEquals(b2?.timeRange.start.toISOString(), '2024-01-10T10:00:00.000Z')
    })

    await t.step('Fails atomically if one slot is full', async () => {
      // Fill up Thursday slot
      await bookingRepo.save({
        id: 'blocker',
        projectId: 'proj-1',
        resourceId: 'res-1',
        quantity: 5, // Full capacity
        status: 'active',
        timeRange: {
          start: new Date('2024-02-01T10:00:00Z'), // Thu
          end: new Date('2024-02-01T11:00:00Z')
        },
        metadata: {}
      })

      // Try to book Wed, Thu, Fri
      await assertRejects(
        () => useCase.execute({
          projectId: 'proj-1',
          resourceId: 'res-1',
          start: new Date('2024-01-31T10:00:00Z'), // Wed
          end: new Date('2024-01-31T11:00:00Z'),
          quantity: 1,
          recurrence: {
              frequency: 'daily',
              interval: 1,
              count: 3
          },
          metadata: {}
        }),
        Error,
        'CapacityExceeded'
      )
      
      // Ensure NO bookings were created (Atomicity check)
      // We expect 0 new bookings. (We have previous test bookings in repo, so we check specific dates)
      const wedBooking = await bookingRepo.findOverlapping({
          projectId: 'proj-1',
          resourceId: 'res-1',
          timeRange: { start: new Date('2024-01-31T10:00:00Z'), end: new Date('2024-01-31T11:00:00Z') }
      })
      assertEquals(wedBooking.length, 0)
    })
  } finally {
    ;(idGen as any).generate = originalGenerate
  }
})
