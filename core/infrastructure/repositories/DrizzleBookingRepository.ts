import { BookingRepository } from '@/core/application/ports/BookingRepository.ts';
import { Booking } from '@/core/domain/booking/Booking.schema.ts';
import { TimeRange } from '@/core/domain/time-range/TimeRange.schema.ts';
import { db, schema } from '@/infra/database/client.ts';
import { eq, and, lt, gt } from 'drizzle-orm';

export class DrizzleBookingRepository implements BookingRepository {
  async save(booking: Booking): Promise<void> {
    const { timeRange, ...rest } = booking;
    const dbBooking = {
      ...rest,
      start: timeRange.start,
      end: timeRange.end,
    };

    await db.insert(schema.bookings)
      .values(dbBooking)
      .onConflictDoUpdate({ target: schema.bookings.id, set: dbBooking });
  }

  async findById(id: string): Promise<Booking | null> {
    const result = await db.query.bookings.findFirst({
      where: eq(schema.bookings.id, id)
    });
    if (!result) return null;
    return this.mapToDomain(result);
  }

  async findOverlapping(params: { projectId: string; resourceId: string; timeRange: TimeRange }): Promise<Booking[]> {
    const { projectId, resourceId, timeRange } = params;
    const results = await db.query.bookings.findMany({
      where: and(
        eq(schema.bookings.projectId, projectId),
        eq(schema.bookings.resourceId, resourceId),
        eq(schema.bookings.status, 'active'),
        lt(schema.bookings.start, timeRange.end),
        gt(schema.bookings.end, timeRange.start)
      )
    });
    return results.map(this.mapToDomain);
  }

  async findByResourceId(resourceId: string, timeRange: TimeRange): Promise<Booking[]> {
    const results = await db.query.bookings.findMany({
      where: and(
        eq(schema.bookings.resourceId, resourceId),
        lt(schema.bookings.start, timeRange.end),
        gt(schema.bookings.end, timeRange.start)
      )
    });
    return results.map(this.mapToDomain);
  }

  async saveMany(bookings: Booking[]): Promise<void> {
    await db.transaction(async (tx: any) => {
      for (const booking of bookings) {
        const { timeRange, ...rest } = booking;
        const dbBooking = {
          ...rest,
          start: timeRange.start,
          end: timeRange.end,
        };
        await tx.insert(schema.bookings)
          .values(dbBooking)
          .onConflictDoUpdate({ target: schema.bookings.id, set: dbBooking });
      }
    });
  }

  private mapToDomain(dbRecord: any): Booking {
    return {
      id: dbRecord.id,
      projectId: dbRecord.projectId,
      resourceId: dbRecord.resourceId,
      quantity: dbRecord.quantity,
      metadata: dbRecord.metadata as Record<string, unknown>,
      status: dbRecord.status as 'active' | 'cancelled',
      timeRange: {
        start: dbRecord.start,
        end: dbRecord.end
      }
    };
  }
}
