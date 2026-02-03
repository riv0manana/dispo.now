import { Booking } from '@/core/domain/booking/Booking.schema.ts'

export const cancelBooking = (booking: Booking): Booking => {
  if (booking.status === 'cancelled') {
    throw new Error('BookingAlreadyCancelled')
  }
  return { ...booking, status: 'cancelled' }
}
