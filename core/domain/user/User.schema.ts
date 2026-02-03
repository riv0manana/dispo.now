import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string()
})

export type User = z.infer<typeof UserSchema>
