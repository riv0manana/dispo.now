import { Booking } from '@/core/domain/booking/Booking.schema.ts'
import { Capacity, canAllocate } from '@/core/domain/capacity/Capacity.schema.ts'

export const assertCapacity = (params: {
  existing: Booking[]
  requestedQuantity: number
  capacity: Capacity
}) => {
  const used = params.existing
    .filter(b => b.status === 'active')
    .reduce((s, b) => s + b.quantity, 0)

  if (!canAllocate(used, params.requestedQuantity, params.capacity)) {
    throw new Error('CapacityExceeded')
  }
}
