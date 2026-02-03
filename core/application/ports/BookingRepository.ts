import { Booking } from '@/core/domain/booking/Booking.schema.ts'
import { TimeRange } from '@/core/domain/time-range/TimeRange.schema.ts'

export interface BookingRepository {
  save(booking: Booking): Promise<void>
  findById(id: string): Promise<Booking | null>
  findOverlapping(params: {
    projectId: string
    resourceId: string
    timeRange: TimeRange
  }): Promise<Booking[]>
  findByResourceId(resourceId: string, timeRange: TimeRange): Promise<Booking[]>
  saveMany(bookings: Booking[]): Promise<void>
}
