import { TransactionManager } from '@/core/application/ports/TransactionManager.ts';
import { db } from '@/infra/database/client.ts';
import { transactionStorage } from '@/infra/database/TransactionContext.ts';

export class DrizzleTransactionManager implements TransactionManager {
  async run<T>(fn: () => Promise<T>): Promise<T> {
    // Drizzle transaction wrapper
    // We use the default isolation level (Read Committed) usually, but for booking safety
    // we might want Serializable. However, Drizzle defaults are usually fine if we lock explicitly.
    // For now, we just wrap in a transaction block.
    return await db.transaction(async (tx: any) => {
      // Run the Use Case logic inside the AsyncLocalStorage context
      // So that any repository call inside 'fn' will pick up 'tx'
      return await transactionStorage.run(tx, fn);
    });
  }
}
