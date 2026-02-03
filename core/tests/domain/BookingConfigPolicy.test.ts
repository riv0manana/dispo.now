import { assertEquals, assertThrows } from 'std/assert/mod.ts'
import { assertBookingConfig } from '@/core/domain/policy/BookingConfigPolicy.ts'
import { Resource } from '@/core/domain/resource/Resource.schema.ts'

Deno.test('BookingConfigPolicy', async (t) => {
  const baseResource: Resource = {
    id: 'r1',
    projectId: 'p1',
    name: 'R1',
    defaultCapacity: 1,
    metadata: {},
    bookingConfig: {
      daily: { start: '09:00', end: '17:00' },
      weekly: { availableDays: [1, 2, 3, 4, 5] } // Mon-Fri
    }
  }

  await t.step('Valid Booking: Mon 10:00 - 11:00', () => {
    // 2024-01-01 is a Monday
    const start = new Date('2024-01-01T10:00:00Z')
    const end = new Date('2024-01-01T11:00:00Z')
    assertBookingConfig(baseResource, { start, end })
  })

  await t.step('Valid Booking: Mon 09:00 - 17:00 (Boundary)', () => {
    const start = new Date('2024-01-01T09:00:00Z')
    const end = new Date('2024-01-01T17:00:00Z')
    assertBookingConfig(baseResource, { start, end })
  })

  await t.step('Invalid Day: Sunday', () => {
    // 2023-12-31 is a Sunday
    const start = new Date('2023-12-31T10:00:00Z')
    const end = new Date('2023-12-31T11:00:00Z')
    assertThrows(
      () => assertBookingConfig(baseResource, { start, end }),
      Error,
      'DayNotAllowed'
    )
  })

  await t.step('Invalid Time: Before Start (08:30)', () => {
    const start = new Date('2024-01-01T08:30:00Z')
    const end = new Date('2024-01-01T09:30:00Z')
    assertThrows(
      () => assertBookingConfig(baseResource, { start, end }),
      Error,
      'StartTimeOutsideConfig'
    )
  })

  await t.step('Invalid Time: After End (17:30)', () => {
    const start = new Date('2024-01-01T16:30:00Z')
    const end = new Date('2024-01-01T17:30:00Z')
    assertThrows(
      () => assertBookingConfig(baseResource, { start, end }),
      Error,
      'EndTimeOutsideConfig'
    )
  })

  await t.step('Valid: Multi-day spans closed hours (now allowed)', () => {
    const start = new Date('2024-01-01T10:00:00Z') // Mon 10:00
    const end = new Date('2024-01-02T10:00:00Z')   // Tue 10:00
    // Should pass as start is 10:00 (valid) and end is 10:00 (valid)
    assertBookingConfig(baseResource, { start, end })
  })

  await t.step('Invalid: Multi-day start outside config', () => {
    const start = new Date('2024-01-01T08:00:00Z') // Mon 08:00 (Invalid)
    const end = new Date('2024-01-02T10:00:00Z')   // Tue 10:00 (Valid)
    assertThrows(
      () => assertBookingConfig(baseResource, { start, end }),
      Error,
      'StartTimeOutsideConfig'
    )
  })

  await t.step('Invalid: Multi-day end outside config', () => {
    const start = new Date('2024-01-01T10:00:00Z') // Mon 10:00 (Valid)
    const end = new Date('2024-01-02T18:00:00Z')   // Tue 18:00 (Invalid)
    assertThrows(
      () => assertBookingConfig(baseResource, { start, end }),
      Error,
      'EndTimeOutsideConfig'
    )
  })

  await t.step('Valid: Multi-day allowed if 24h config', () => {
    const resource24h: Resource = {
      ...baseResource,
      bookingConfig: {
        daily: { start: '00:00', end: '23:59' }
      }
    }
    const start = new Date('2024-01-01T10:00:00Z')
    const end = new Date('2024-01-02T10:00:00Z')
    assertBookingConfig(resource24h, { start, end })
  })

  await t.step('Defaults: No config allows anything', () => {
    const noConfigResource: Resource = {
      ...baseResource,
      bookingConfig: undefined
    }
    const start = new Date('2023-12-31T03:00:00Z') // Sun 3am
    const end = new Date('2023-12-31T04:00:00Z')
    assertBookingConfig(noConfigResource, { start, end })
  })
})
