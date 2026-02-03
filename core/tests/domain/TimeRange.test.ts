import { assert } from 'std/assert/mod.ts'
import { overlaps } from '@/core/domain/time-range/TimeRange.logic.ts'

Deno.test('overlaps correctly identifies overlapping ranges', () => {
  const t1 = { start: new Date('2023-01-01T10:00:00Z'), end: new Date('2023-01-01T11:00:00Z') }
  const t2 = { start: new Date('2023-01-01T10:30:00Z'), end: new Date('2023-01-01T11:30:00Z') }
  const t3 = { start: new Date('2023-01-01T11:00:00Z'), end: new Date('2023-01-01T12:00:00Z') }

  assert(overlaps(t1, t2), 't1 should overlap t2')
  assert(overlaps(t2, t1), 't2 should overlap t1')
  assert(!overlaps(t1, t3), 't1 should not overlap t3 (touching)')
  assert(!overlaps(t3, t1), 't3 should not overlap t1')
})
