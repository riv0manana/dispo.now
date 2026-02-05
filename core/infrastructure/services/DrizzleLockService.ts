import { LockService } from '@/core/application/ports/LockService.ts';
import { db, schema } from '@/infra/database/client.ts';
import { getDb } from '@/infra/database/TransactionContext.ts';
import { eq } from 'drizzle-orm';

export class DrizzleLockService implements LockService {
  async acquire(resourceId: string): Promise<void> {
    // SQL-based Pessimistic Locking
    // We select the ID only, but with FOR UPDATE
    // This locks the row until the transaction commits
    await getDb(db)
      .select({ id: schema.resources.id })
      .from(schema.resources)
      .where(eq(schema.resources.id, resourceId))
      .for('update');
  }
}
