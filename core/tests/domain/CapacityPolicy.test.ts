import { assertRejects, assertEquals } from 'std/assert/mod.ts'
import { assertCapacity } from '@/core/domain/policy/CapacityPolicy.ts'
import { Booking } from '@/core/domain/booking/Booking.schema.ts'

Deno.test('assertCapacity allows allocation when capacity is sufficient', () => {
  const existing: Booking[] = []
  assertCapacity({
    existing,
    requestedQuantity: 1,
    capacity: 1
  })
})

Deno.test('assertCapacity throws when capacity exceeded', () => {
  const existing: Booking[] = [
    {
      id: '1',
      projectId: 'p',
      resourceId: 'r',
      timeRange: { start: new Date(), end: new Date(Date.now() + 1000) },
      quantity: 1,
      metadata: {},
      status: 'active'
    }
  ]

  try {
    assertCapacity({
      existing,
      requestedQuantity: 1,
      capacity: 1
    })
    throw new Error('Should have thrown')
  } catch (e) {
    assertEquals((e as Error).message, 'CapacityExceeded')
  }
})
