import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { Booking } from '@/core/domain/booking/Booking.schema.ts'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'

export class GetBookingsUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private resourceRepo: ResourceRepository
  ) {}

  async execute(input: {
    projectId: string
    resourceId: string
    start: Date
    end: Date
  }): Promise<Booking[]> {
    // 1. Validate Resource Ownership
    const resource = await this.resourceRepo.findById(input.resourceId)
    if (!resource) {
      throw new Error('ResourceNotFound')
    }
    if (resource.projectId !== input.projectId) {
      throw new Error('ResourceDoesNotBelongToProject')
    }

    const timeRange = TimeRangeSchema.parse({
      start: input.start,
      end: input.end
    })
    return this.bookingRepo.findByResourceId(input.resourceId, timeRange)
  }
}
