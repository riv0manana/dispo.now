import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CancelBookingUseCase } from '@/core/application/usecases/CancelBookingUseCase.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { Booking } from '@/core/domain/booking/Booking.schema.ts'

Deno.test('cancels an active booking', async () => {
  const repo = new FakeBookingRepository()
  const uc = new CancelBookingUseCase(repo)

  const booking: Booking = {
    id: 'id1',
    projectId: 'p',
    resourceId: 'r',
    timeRange: { start: new Date(), end: new Date() }, // Valid dates needed, but overlaps logic not used here
    quantity: 1,
    metadata: {},
    status: 'active'
  }
  // Fix timeRange to be valid (start < end)
  booking.timeRange.end = new Date(booking.timeRange.start.getTime() + 1000)
  
  await repo.save(booking)

  await uc.execute('id1', 'p')

  const updated = await repo.findById('id1')
  assertEquals(updated?.status, 'cancelled')
})

Deno.test('throws if booking not found', async () => {
  const repo = new FakeBookingRepository()
  const uc = new CancelBookingUseCase(repo)

  await assertRejects(
    () => uc.execute('missing', 'p'),
    Error,
    'BookingNotFound'
  )
})

Deno.test('throws if already cancelled', async () => {
  const repo = new FakeBookingRepository()
  const uc = new CancelBookingUseCase(repo)

  const booking: Booking = {
    id: 'id1',
    projectId: 'p',
    resourceId: 'r',
    timeRange: { start: new Date(), end: new Date(Date.now() + 1000) },
    quantity: 1,
    metadata: {},
    status: 'cancelled'
  }
  await repo.save(booking)

  await assertRejects(
    () => uc.execute('id1', 'p'),
    Error,
    'BookingAlreadyCancelled'
  )
})
