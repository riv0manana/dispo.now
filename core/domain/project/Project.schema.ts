import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  apiKey: z.string().min(1),
  metadata: z.record(z.unknown())
})

export type Project = z.infer<typeof ProjectSchema>
