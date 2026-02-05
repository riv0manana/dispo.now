import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'

Deno.test('CreateBookingUseCase - Booking Config Enforcement', async (t) => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id1' }, new FakeTransactionManager(), new FakeLockService())

  // Setup: Resource with specific business hours (Mon-Fri, 09:00-17:00)
  await resourceRepo.save({
    id: 'res-config',
    projectId: 'p1',
    name: 'Office',
    defaultCapacity: 1,
    metadata: {},
    bookingConfig: {
      daily: { start: '09:00', end: '17:00' },
      weekly: { availableDays: [1, 2, 3, 4, 5] } // Mon-Fri
    }
  })

  await t.step('should allow booking within business hours', async () => {
    const id = await uc.execute({
      projectId: 'p1',
      resourceId: 'res-config',
      start: new Date('2024-01-01T10:00:00Z'), // Monday 10am
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 1,
      metadata: {}
    })
    assertEquals(id, 'id1')
  })

  await t.step('should reject booking on weekend', async () => {
    await assertRejects(
      () => uc.execute({
        projectId: 'p1',
        resourceId: 'res-config',
        start: new Date('2023-12-31T10:00:00Z'), // Sunday
        end: new Date('2023-12-31T11:00:00Z'),
        quantity: 1,
        metadata: {}
      }),
      Error,
      'DayNotAllowed'
    )
  })

  await t.step('should reject booking before opening time', async () => {
    await assertRejects(
      () => uc.execute({
        projectId: 'p1',
        resourceId: 'res-config',
        start: new Date('2024-01-01T08:00:00Z'), // Mon 8am
        end: new Date('2024-01-01T09:00:00Z'),
        quantity: 1,
        metadata: {}
      }),
      Error,
      'StartTimeOutsideConfig'
    )
  })

  await t.step('should reject booking after closing time', async () => {
    await assertRejects(
      () => uc.execute({
        projectId: 'p1',
        resourceId: 'res-config',
        start: new Date('2024-01-01T17:01:00Z'), // Mon 5:01pm
        end: new Date('2024-01-01T18:00:00Z'),
        quantity: 1,
        metadata: {}
      }),
      Error,
      'EndTimeOutsideConfig' // Start is after closing, so End is definitely after closing
    )
  })
})
