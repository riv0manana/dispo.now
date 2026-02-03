import { assertThrows } from 'std/assert/mod.ts'
import { TimeRangeSchema } from '@/core/domain/time-range/TimeRange.schema.ts'
import { CapacitySchema } from '@/core/domain/capacity/Capacity.schema.ts'
import { BookingSchema } from '@/core/domain/booking/Booking.schema.ts'

Deno.test('Validation: TimeRange rejects start >= end', () => {
  const now = new Date()
  assertThrows(
    () => TimeRangeSchema.parse({ start: now, end: now }),
    Error,
    'InvalidTimeRange'
  )
  assertThrows(
    () => TimeRangeSchema.parse({ start: new Date(now.getTime() + 1000), end: now }),
    Error,
    'InvalidTimeRange'
  )
})

Deno.test('Validation: Capacity rejects < 1', () => {
  assertThrows(() => CapacitySchema.parse(0))
  assertThrows(() => CapacitySchema.parse(-1))
  assertThrows(() => CapacitySchema.parse(1.5)) // Must be int
})

Deno.test('Validation: Booking quantity rejects < 1', () => {
  // Partial object for testing just the schema validation logic
  const validBooking = {
    id: 'id',
    projectId: 'p',
    resourceId: 'r',
    timeRange: { start: new Date('2023-01-01T10:00:00Z'), end: new Date('2023-01-01T11:00:00Z') },
    quantity: 1,
    metadata: {},
    status: 'active'
  }

  assertThrows(() => BookingSchema.parse({ ...validBooking, quantity: 0 }))
  assertThrows(() => BookingSchema.parse({ ...validBooking, quantity: -5 }))
  assertThrows(() => BookingSchema.parse({ ...validBooking, quantity: 1.5 }))
})
