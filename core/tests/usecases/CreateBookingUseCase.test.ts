import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('creates booking within capacity', async () => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')
  
  bookingRepo.clear()
  resourceRepo.clear()

  await resourceRepo.save({ id: 'r', projectId: 'p', name: 'R', defaultCapacity: 1, metadata: {} })

  const id = await uc.execute({
    projectId: 'p',
    resourceId: 'r',
    start: new Date('2024-01-01T10:00:00Z'),
    end: new Date('2024-01-01T11:00:00Z'),
    quantity: 1,
    metadata: {}
  })

  assertEquals(typeof id, 'string')
})

Deno.test('rejects capacity overflow', async () => {
  const bookingRepo = loadDeps('BookingRepository') as FakeBookingRepository
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('CreateBookingUseCase')
  
  bookingRepo.clear()
  resourceRepo.clear()

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
