import { RecurrenceRule } from './Recurrence.schema.ts'
import { TimeRange } from '../time-range/TimeRange.schema.ts'

/**
 * Expands a recurrence rule into a list of TimeRanges.
 * 
 * ASSUMPTION: 'baseStart' is considered the first valid occurrence.
 * The logic simply projects this occurrence forward based on frequency and interval.
 * 
 * This supports:
 * - "Every Wed": baseStart is a Wed, freq=weekly, interval=1
 * - "Every Month": baseStart is 1st, freq=monthly, interval=1
 */
export function expandRecurrence(
  rule: RecurrenceRule,
  baseStart: Date,
  baseEnd: Date
): TimeRange[] {
  const duration = baseEnd.getTime() - baseStart.getTime()
  const results: TimeRange[] = []
  
  let currentStart = new Date(baseStart)
  let count = 0
  const MAX_OCCURRENCES = 100 // Safety limit to prevent DOS

  while (true) {
    // 1. Check Stop Conditions
    if (rule.count && count >= rule.count) break
    if (rule.until && currentStart > rule.until) break
    if (results.length >= MAX_OCCURRENCES) break

    // 2. Add current slot
    results.push({
      start: new Date(currentStart),
      end: new Date(currentStart.getTime() + duration)
    })
    count++

    // 3. Advance Cursor
    if (rule.frequency === 'daily') {
      currentStart.setUTCDate(currentStart.getUTCDate() + rule.interval)
    } else if (rule.frequency === 'weekly') {
      currentStart.setUTCDate(currentStart.getUTCDate() + (7 * rule.interval))
    } else if (rule.frequency === 'monthly') {
      currentStart.setUTCMonth(currentStart.getUTCMonth() + rule.interval)
    }
  }

  return results
}
