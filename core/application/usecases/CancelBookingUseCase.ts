import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { cancelBooking } from '@/core/domain/booking/Booking.logic.ts'

export class CancelBookingUseCase {
  constructor(private repo: BookingRepository) {}

  async execute(id: string, projectId: string): Promise<void> {
    const booking = await this.repo.findById(id)
    if (!booking) throw new Error('BookingNotFound')

    // Tenant Isolation Check
    if (booking.projectId !== projectId) {
      throw new Error('BookingDoesNotBelongToProject')
    }

    await this.repo.save(cancelBooking(booking))
  }
}
