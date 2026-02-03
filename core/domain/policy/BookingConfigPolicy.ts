import { Resource } from '@/core/domain/resource/Resource.schema.ts'
import { TimeRange } from '@/core/domain/time-range/TimeRange.schema.ts'

export const assertBookingConfig = (resource: Resource, timeRange: TimeRange) => {
  const config = resource.bookingConfig
  if (!config) return

  // Helper to get UTC minutes from HH:MM
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  // Helper to get UTC minutes from Date
  const getMinutes = (date: Date) => {
    return date.getUTCHours() * 60 + date.getUTCMinutes()
  }

  // 1. Weekly Check
  if (config.weekly?.availableDays) {
    // Check Start Day
    const startDay = new Date(timeRange.start)
    if (!config.weekly.availableDays.includes(startDay.getUTCDay())) {
      throw new Error('DayNotAllowed')
    }

    // Check End Day
    const endDay = new Date(timeRange.end)
    if (!config.weekly.availableDays.includes(endDay.getUTCDay())) {
      throw new Error('DayNotAllowed')
    }
  }

  // 2. Daily Check
  if (config.daily) {
    const startLimit = config.daily.start ? parseTime(config.daily.start) : 0 // 00:00
    const endLimit = config.daily.end ? parseTime(config.daily.end) : 24 * 60 - 1 // 23:59

    const bookingStart = getMinutes(timeRange.start)
    const bookingEnd = getMinutes(timeRange.end)
    
    const isSameDay = timeRange.start.toISOString().split('T')[0] === timeRange.end.toISOString().split('T')[0]

    if (isSameDay) {
      if (bookingStart < startLimit) {
        throw new Error('StartTimeOutsideConfig')
      }
      if (bookingEnd > endLimit) {
        throw new Error('EndTimeOutsideConfig')
      }
    } else {
      if (bookingStart < startLimit) {
        throw new Error('StartTimeOutsideConfig')
      }
      
      
      if (bookingEnd > endLimit) {
        throw new Error('EndTimeOutsideConfig')
      }
    }
  }
}
