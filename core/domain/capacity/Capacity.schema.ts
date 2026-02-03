import { z } from 'zod'

export const CapacitySchema = z.number().int().min(1).default(1)
export type Capacity = z.infer<typeof CapacitySchema>

export const canAllocate = (
  used: number,
  requested: number,
  capacity: Capacity
): boolean => used + requested <= capacity
