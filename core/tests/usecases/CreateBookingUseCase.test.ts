import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'

Deno.test('creates booking within capacity', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id1' }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'r', projectId: 'p', name: 'R', defaultCapacity: 1, metadata: {} })

  const id = await uc.execute({
    projectId: 'p',
    resourceId: 'r',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    metadata: {}
  })

  assertEquals(id, 'id1')
})

Deno.test('rejects capacity overflow', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'id' }, new FakeTransactionManager(), new FakeLockService())

  await resourceRepo.save({ id: 'r', projectId: 'p', name: 'R', defaultCapacity: 1, metadata: {} })

  await uc.execute({
    projectId: 'p',
    resourceId: 'r',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    capacity: 1,
    metadata: {}
  })

  await assertRejects(
    () => uc.execute({
      projectId: 'p',
      resourceId: 'r',
      start: new Date('2024-01-01T10:30:00Z'),
      end: new Date('2024-01-01T11:30:00Z'),
      quantity: 1,
      capacity: 1,
      metadata: {}
    }),
    Error,
    'CapacityExceeded'
  )
})
