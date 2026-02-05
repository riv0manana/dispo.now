import { z } from 'zod'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { TransactionManager } from '@/core/application/ports/TransactionManager.ts'
import { LockService } from '@/core/application/ports/LockService.ts'
import { BookingSchema } from '@/core/domain/booking/Booking.schema.ts'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'
import { CapacitySchema } from '@/core/domain/capacity/Capacity.schema.ts'
import { assertCapacity } from '@/core/domain/policy/CapacityPolicy.ts'
import { assertBookingConfig } from '@/core/domain/policy/BookingConfigPolicy.ts'

export class CreateBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private resourceRepo: ResourceRepository,
    private idGen: IdGenerator,
    private tm: TransactionManager,
    private lockService: LockService
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

    return this.tm.run(async () => {
      // 1. Acquire Business Lock
      // "Locking is a gold rule of the business" - Explicitly prevented concurrent modification.
      await this.lockService.acquire(input.resourceId)

      // 2. Validate Resource Ownership
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
    })
  }
}
