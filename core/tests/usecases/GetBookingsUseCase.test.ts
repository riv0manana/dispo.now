import { assertEquals } from 'std/assert/mod.ts'
import { GetBookingsUseCase } from '@/core/application/usecases/GetBookingsUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('lists bookings overlapping time range', async () => {
  const repo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetBookingsUseCase(repo, resourceRepo)

  await resourceRepo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })

  // Booking 1: 10:00 - 11:00
  await repo.save({
    id: 'b1',
    projectId: 'p1',
    resourceId: 'r1',
    timeRange: { start: new Date('2024-01-01T10:00:00Z'), end: new Date('2024-01-01T11:00:00Z') },
    quantity: 1,
    metadata: {},
    status: 'active'
  })

  // Booking 2: 12:00 - 13:00
  await repo.save({
    id: 'b2',
    projectId: 'p1',
    resourceId: 'r1',
    timeRange: { start: new Date('2024-01-01T12:00:00Z'), end: new Date('2024-01-01T13:00:00Z') },
    quantity: 1,
    metadata: {},
    status: 'active'
  })

  // Search 09:00 - 11:30 (Should match b1)
  const results = await uc.execute({
    projectId: 'p1',
    resourceId: 'r1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T11:30:00Z')
  })

  assertEquals(results.length, 1)
  assertEquals(results[0].id, 'b1')
})
