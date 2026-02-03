import { z } from 'zod'

export const TimeRangeSchema = z.object({
  start: z.date(),
  end: z.date()
}).refine(
  d => d.start < d.end,
  { message: 'InvalidTimeRange' }
)

export type TimeRange = z.infer<typeof TimeRangeSchema>
