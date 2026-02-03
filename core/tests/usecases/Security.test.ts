import { assertRejects } from 'std/assert/mod.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { CancelBookingUseCase } from '@/core/application/usecases/CancelBookingUseCase.ts'
import { GetBookingsUseCase } from '@/core/application/usecases/GetBookingsUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('Security: Cannot create booking for resource belonging to another project', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new CreateBookingUseCase(bookingRepo, resourceRepo, { generate: () => 'b1' })

  // Resource belongs to Project A
  await resourceRepo.save({
    id: 'r1',
    projectId: 'project_A',
    name: 'R1',
    defaultCapacity: 1,
    metadata: {}
  })

  // Attempt to book with Project B context
  await assertRejects(
    () => uc.execute({
      projectId: 'project_B',
      resourceId: 'r1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      quantity: 1,
      metadata: {}
    }),
    Error,
    'ResourceDoesNotBelongToProject'
  )
})

Deno.test('Security: Cannot cancel booking belonging to another project', async () => {
  const bookingRepo = new FakeBookingRepository()
  const uc = new CancelBookingUseCase(bookingRepo)

  // Booking belongs to Project A
  await bookingRepo.save({
    id: 'b1',
    projectId: 'project_A',
    resourceId: 'r1',
    timeRange: { start: new Date(), end: new Date() },
    quantity: 1,
    metadata: {},
    status: 'active'
  })

  // Attempt to cancel with Project B context
  await assertRejects(
    () => uc.execute('b1', 'project_B'),
    Error,
    'BookingDoesNotBelongToProject'
  )
})

Deno.test('Security: Cannot list bookings for resource belonging to another project', async () => {
  const bookingRepo = new FakeBookingRepository()
  const resourceRepo = new FakeResourceRepository()
  const uc = new GetBookingsUseCase(bookingRepo, resourceRepo)

  // Resource belongs to Project A
  await resourceRepo.save({
    id: 'r1',
    projectId: 'project_A',
    name: 'R1',
    defaultCapacity: 1,
    metadata: {}
  })

  // Attempt to list with Project B context
  await assertRejects(
    () => uc.execute({
      projectId: 'project_B',
      resourceId: 'r1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z')
    }),
    Error,
    'ResourceDoesNotBelongToProject'
  )
})
