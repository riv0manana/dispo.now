import { assertEquals, assertThrows } from 'std/assert/mod.ts'
import { ResourceSchema } from '@/core/domain/resource/Resource.schema.ts'

Deno.test('ResourceSchema - BookingConfig', async (t) => {
  const baseResource = {
    id: 'res-1',
    projectId: 'proj-1',
    name: 'Test',
    defaultCapacity: 1,
    metadata: {}
  }

  await t.step('valid booking config', () => {
    const res = ResourceSchema.parse({
      ...baseResource,
      bookingConfig: {
        daily: { start: '08:00', end: '18:00' },
        weekly: { availableDays: [1, 2, 3, 4, 5] }
      }
    })
    assertEquals(res.bookingConfig?.daily?.start, '08:00')
  })

  await t.step('invalid time format', () => {
    assertThrows(() => {
      ResourceSchema.parse({
        ...baseResource,
        bookingConfig: {
          daily: { start: '25:00' }
        }
      })
    })
  })

  await t.step('invalid week day', () => {
    assertThrows(() => {
      ResourceSchema.parse({
        ...baseResource,
        bookingConfig: {
          weekly: { availableDays: [7] } // 0-6 allowed
        }
      })
    })
  })
})
