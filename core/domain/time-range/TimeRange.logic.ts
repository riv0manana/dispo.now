import { TimeRange } from '@/core/domain/time-range/TimeRange.schema.ts'

export const overlaps = (a: TimeRange, b: TimeRange): boolean =>
  a.start < b.end && b.start < a.end
