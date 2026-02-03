import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { Resource } from '@/core/domain/resource/Resource.schema.ts'
import { overlaps } from '@/core/domain/time-range/TimeRange.logic.ts'

export interface GetAvailabilityInput {
  projectId: string
  resourceId: string
  start: Date
  end: Date
  slotDurationMinutes?: number
}

export interface AvailabilitySlot {
  start: string
  end: string
  available: number
}

export class GetAvailabilityUseCase {
  constructor(
    private resourceRepo: ResourceRepository,
    private bookingRepo: BookingRepository
  ) {}

  async execute(input: GetAvailabilityInput): Promise<AvailabilitySlot[]> {
    const resource = await this.resourceRepo.findById(input.resourceId)
    if (!resource) {
      throw new Error('ResourceNotFound')
    }
    if (resource.projectId !== input.projectId) {
      throw new Error('ResourceDoesNotBelongToProject')
    }

    // Fetch overlapping bookings
    const bookings = await this.bookingRepo.findByResourceId(input.resourceId, {
      start: input.start,
      end: input.end
    })

    const slots: AvailabilitySlot[] = []
    const durationMs = (input.slotDurationMinutes || 60) * 60 * 1000
    
    let current = new Date(input.start.getTime())
    
    while (current.getTime() + durationMs <= input.end.getTime()) {
      const slotStart = new Date(current)
      const slotEnd = new Date(current.getTime() + durationMs)
      
      if (this.isOpen(resource, slotStart, slotEnd)) {
        const activeBookings = bookings.filter(b => 
          b.status === 'active' && 
          overlaps(b.timeRange, { start: slotStart, end: slotEnd })
        )

        const usedCapacity = activeBookings.reduce((sum, b) => sum + b.quantity, 0)
        const remaining = resource.defaultCapacity - usedCapacity
        
        if (remaining > 0) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            available: remaining
          })
        }
      }

      current = new Date(current.getTime() + durationMs)
    }

    return slots
  }

  private isOpen(resource: Resource, start: Date, end: Date): boolean {
    if (!resource.bookingConfig) return true

    // Check Weekly (Days)
    if (resource.bookingConfig.weekly?.availableDays) {
      const day = start.getUTCDay() // 0 = Sun
      if (!resource.bookingConfig.weekly.availableDays.includes(day)) {
        return false
      }
    }

    // Check Daily (Hours)
    if (resource.bookingConfig.daily) {
      const { start: openStr, end: closeStr } = resource.bookingConfig.daily
      if (openStr && closeStr) {
        const [openH, openM] = openStr.split(':').map(Number)
        const [closeH, closeM] = closeStr.split(':').map(Number)
        
        const openTime = openH * 60 + openM
        const closeTime = closeH * 60 + closeM
        
        const slotStartMins = start.getUTCHours() * 60 + start.getUTCMinutes()
        const slotEndMins = end.getUTCHours() * 60 + end.getUTCMinutes()
        
        if (slotStartMins < openTime || slotEndMins > closeTime) {
          return false
        }
      }
    }

    return true
  }
}
