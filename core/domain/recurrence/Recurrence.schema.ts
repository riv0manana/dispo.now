import { z } from 'zod'

export const RecurrenceRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  interval: z.number().int().min(1).default(1),
  count: z.number().int().min(1).optional(),
  until: z.date().optional(),
  byWeekDays: z.array(z.number().int().min(0).max(6)).optional()
}).refine(data => data.count || data.until, {
  message: "Either 'count' or 'until' must be provided to limit recurrence."
})

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>
