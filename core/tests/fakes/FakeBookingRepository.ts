import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { Booking } from '@/core/domain/booking/Booking.schema.ts'
import { overlaps } from '@/core/domain/time-range/TimeRange.logic.ts'
import { TimeRange } from '@/core/domain/time-range/TimeRange.schema.ts'

export class FakeBookingRepository implements BookingRepository {
  private items: Booking[] = []

  async save(booking: Booking) {
    this.items = this.items.filter(b => b.id !== booking.id)
    this.items.push(booking)
  }

  async findById(id: string) {
    return this.items.find(b => b.id === id) ?? null
  }

  async findOverlapping(params: { projectId: string; resourceId: string; timeRange: TimeRange }) {
    return this.items.filter(b =>
      b.projectId === params.projectId &&
      b.resourceId === params.resourceId &&
      b.status === 'active' &&
      overlaps(b.timeRange, params.timeRange)
    )
  }

  async findByResourceId(resourceId: string, timeRange: TimeRange) {
    return this.items.filter(b => 
      b.resourceId === resourceId &&
      overlaps(b.timeRange, timeRange)
    )
  }

  async saveMany(bookings: Booking[]) {
    for (const booking of bookings) {
      await this.save(booking)
    }
  }
}
