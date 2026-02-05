import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'

Deno.test('SCENARIO: Multi-week booking blocks intermediate closed days', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  // Resource: Open Mon-Fri (Closed Sat/Sun), Capacity 1
  await resourceRepo.save({ 
    id: 'R1', 
    projectId: 'p1', 
    name: 'R1', 
    defaultCapacity: 1, 
    metadata: {},
    bookingConfig: {
      daily: { start: '00:00', end: '23:59' },
      weekly: { availableDays: [1, 2, 3, 4, 5] } // Mon-Fri
    }
  })

  const start = new Date('2026-02-06T10:00:00Z')
  const end = new Date('2026-02-09T10:00:00Z')
  
  await uc.execute({
    projectId: 'p1',
    resourceId: 'R1',
    start,
    end,
    quantity: 1,
    metadata: {}
  })
  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: new Date('2026-02-08T10:00:00Z'),
      end: new Date('2026-02-08T12:00:00Z'),
      quantity: 1,
      metadata: {}
    }),
    Error,
    'DayNotAllowed' // Fails because it's closed
  )

  await assertRejects(
    () => uc.execute({
      projectId: 'p1',
      resourceId: 'R1',
      start: new Date('2026-02-06T14:00:00Z'),
      end: new Date('2026-02-06T15:00:00Z'),
      quantity: 1,
      metadata: {}
    }),
    Error,
    'CapacityExceeded' // Fails because capacity is 1 and used by the multi-day booking
  )
})
