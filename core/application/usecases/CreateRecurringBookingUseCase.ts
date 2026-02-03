import { z } from 'zod'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { RecurrenceRule, RecurrenceRuleSchema } from '@/core/domain/recurrence/Recurrence.schema.ts'
import { expandRecurrence } from '@/core/domain/recurrence/Recurrence.logic.ts'
import { CreateGroupBookingUseCase } from './CreateGroupBookingUseCase.ts'

export class CreateRecurringBookingUseCase {
  private groupBookingUseCase: CreateGroupBookingUseCase

  constructor(
    bookingRepo: BookingRepository,
    resourceRepo: ResourceRepository,
    idGen: IdGenerator
  ) {
    this.groupBookingUseCase = new CreateGroupBookingUseCase(
      bookingRepo,
      resourceRepo,
      idGen
    )
  }

  async execute(input: {
    projectId: string
    resourceId: string
    start: Date
    end: Date
    recurrence: RecurrenceRule
    quantity: number
    metadata: Record<string, unknown>
  }): Promise<string[]> {
    
    RecurrenceRuleSchema.parse(input.recurrence)

    const timeRanges = expandRecurrence(
      input.recurrence,
      input.start,
      input.end
    )

    if (timeRanges.length === 0) {
      throw new Error('InvalidRecurrence: No occurrences generated')
    }
    const groupRequest = {
      projectId: input.projectId,
      bookings: timeRanges.map(range => ({
        resourceId: input.resourceId,
        start: range.start,
        end: range.end,
        quantity: input.quantity,
        metadata: {
          ...input.metadata,
          recurrence: {
            frequency: input.recurrence.frequency,
            interval: input.recurrence.interval,
            groupSize: timeRanges.length
          }
        }
      }))
    }
    return this.groupBookingUseCase.execute(groupRequest)
  }
}
