import { TransactionManager } from '@/core/application/ports/TransactionManager.ts';
import { InMemoryLockManager, transactionContext } from '@/core/infrastructure/concurrency/InMemoryLockManager.ts';

export class FakeTransactionManager implements TransactionManager {
  async run<T>(fn: () => Promise<T>): Promise<T> {
    const txId = crypto.randomUUID();
    
    return transactionContext.run(txId, async () => {
      try {
        return await fn();
      } finally {
        // Release all locks held by this "transaction"
        InMemoryLockManager.releaseAll(txId);
      }
    });
  }
}
