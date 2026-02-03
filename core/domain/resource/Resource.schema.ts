import { z } from 'zod'

export const ResourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1),
  defaultCapacity: z.number().int().min(1).default(1),
  metadata: z.record(z.unknown()),
  bookingConfig: z.object({
    daily: z.object({
      start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(), // HH:MM
      end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()    // HH:MM
    }).optional(),
    weekly: z.object({
      availableDays: z.array(z.number().int().min(0).max(6)).optional() // 0=Sun
    }).optional()
  }).optional()
})

export type Resource = z.infer<typeof ResourceSchema>
