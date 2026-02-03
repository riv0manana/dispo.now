import { z } from 'zod'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { Booking, BookingSchema } from '@/core/domain/booking/Booking.schema.ts'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'
import { CapacitySchema } from '@/core/domain/capacity/Capacity.schema.ts'
import { assertCapacity } from '@/core/domain/policy/CapacityPolicy.ts'
import { assertBookingConfig } from '@/core/domain/policy/BookingConfigPolicy.ts'
import { overlaps } from '@/core/domain/time-range/TimeRange.logic.ts'

export class CreateGroupBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private resourceRepo: ResourceRepository,
    private idGen: IdGenerator
  ) {}

  async execute(input: {
    projectId: string
    bookings: Array<{
      resourceId: string
      start: Date
      end: Date
      quantity: number
      capacity?: number
      metadata: Record<string, unknown>
    }>
  }): Promise<string[]> {
    const bookingsToSave: Booking[] = []

    for (const request of input.bookings) {
      // 1. Validate Resource Ownership
      const resource = await this.resourceRepo.findById(request.resourceId)
      if (!resource) {
        throw new Error(`ResourceNotFound: ${request.resourceId}`)
      }
      if (resource.projectId !== input.projectId) {
        throw new Error(`ResourceDoesNotBelongToProject: ${request.resourceId}`)
      }

      const timeRange = TimeRangeSchema.parse({
        start: request.start,
        end: request.end
      })

      // Validate Booking Config (Daily/Weekly)
      assertBookingConfig(resource, timeRange)

      // Use provided capacity override OR resource default capacity OR 1
      const capacityValue = request.capacity ?? resource.defaultCapacity ?? 1
      const capacity = CapacitySchema.parse(capacityValue)
      const quantity = z.number().int().min(1).parse(request.quantity)

      // 2. Check Capacity (DB + Pending in this group)
      const dbOverlapping = await this.bookingRepo.findOverlapping({
        projectId: input.projectId,
        resourceId: request.resourceId,
        timeRange
      })

      const pendingOverlapping = bookingsToSave.filter(b => 
        b.resourceId === request.resourceId && 
        overlaps(b.timeRange, timeRange)
      )

      assertCapacity({
        existing: [...dbOverlapping, ...pendingOverlapping],
        requestedQuantity: quantity,
        capacity
      })

      // 3. Create Booking Entity
      const booking = BookingSchema.parse({
        id: this.idGen.generate(),
        projectId: input.projectId,
        resourceId: request.resourceId,
        timeRange,
        quantity,
        metadata: request.metadata,
        status: 'active'
      })

      bookingsToSave.push(booking)
    }

    // 4. Atomic Save
    await this.bookingRepo.saveMany(bookingsToSave)

    return bookingsToSave.map(b => b.id)
  }
}
