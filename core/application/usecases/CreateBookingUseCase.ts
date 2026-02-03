import { z } from 'zod'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { BookingSchema } from '@/core/domain/booking/Booking.schema.ts'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'
import { CapacitySchema } from '@/core/domain/capacity/Capacity.schema.ts'
import { assertCapacity } from '@/core/domain/policy/CapacityPolicy.ts'
import { assertBookingConfig } from '@/core/domain/policy/BookingConfigPolicy.ts'

export class CreateBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private resourceRepo: ResourceRepository,
    private idGen: IdGenerator
  ) {}

  async execute(input: {
    projectId: string
    resourceId: string
    start: Date
    end: Date
    quantity: number
    capacity?: number
    metadata: Record<string, unknown>
  }): Promise<string> {

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

    // Validate Booking Config (Daily/Weekly)
    assertBookingConfig(resource, timeRange)

    // Use provided capacity override OR resource default capacity OR 1
    const capacityValue = input.capacity ?? resource.defaultCapacity ?? 1
    const capacity = CapacitySchema.parse(capacityValue)
    const quantity = z.number().int().min(1).parse(input.quantity)

    const overlapping = await this.bookingRepo.findOverlapping({
      projectId: input.projectId,
      resourceId: input.resourceId,
      timeRange
    })

    assertCapacity({
      existing: overlapping,
      requestedQuantity: quantity,
      capacity
    })

    const booking = BookingSchema.parse({
      id: this.idGen.generate(),
      projectId: input.projectId,
      resourceId: input.resourceId,
      timeRange,
      quantity,
      metadata: input.metadata,
      status: 'active'
    })

    await this.bookingRepo.save(booking)
    return booking.id
  }
}
