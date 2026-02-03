import { z } from 'zod'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'

export const BookingSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  resourceId: z.string(),
  timeRange: TimeRangeSchema,
  quantity: z.number().int().min(1),
  metadata: z.record(z.unknown()),
  status: z.enum(['active', 'cancelled'])
})

export type Booking = z.infer<typeof BookingSchema>
