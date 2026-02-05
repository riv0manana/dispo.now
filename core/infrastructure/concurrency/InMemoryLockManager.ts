import { AsyncLocalStorage } from 'node:async_hooks';

// Context to track the current Transaction ID
export const transactionContext = new AsyncLocalStorage<string>();

type ReleaseCallback = () => void;

export class Mutex {
  private queue: Array<ReleaseCallback> = [];
  private locked = false;

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    } else {
      this.locked = false;
    }
  }
}

/**
 * A Database-Agnostic In-Memory Lock Manager.
 * 
 * Uses AsyncLocalStorage to track "Transaction IDs" and ensures that
 * locks acquired within a transaction are held until that transaction completes.
 * 
 * This allows implementing Pessimistic Locking for ANY persistence layer 
 * (FileSystem, MongoDB, In-Memory, SQLite) that works on a single instance.
 */
export class InMemoryLockManager {
  private static locks = new Map<string, Mutex>();
  private static txLocks = new Map<string, Set<string>>();

  /**
   * Acquires a lock for a specific resource.
   * If a transaction context is active, the lock is associated with it
   * and will be automatically released when releaseAll(txId) is called.
   */
  static async acquire(resourceId: string): Promise<void> {
    const txId = transactionContext.getStore();

    if (!this.locks.has(resourceId)) {
      this.locks.set(resourceId, new Mutex());
    }

    const mutex = this.locks.get(resourceId)!;
    
    // Simple deadlock prevention/reentrancy check could go here
    // For now, we assume simple exclusive locking
    await mutex.acquire();

    // If we are in a transaction, track this lock
    if (txId) {
      if (!this.txLocks.has(txId)) {
        this.txLocks.set(txId, new Set());
      }
      this.txLocks.get(txId)!.add(resourceId);
    }
  }

  /**
   * Releases all locks associated with a specific Transaction ID.
   * This should be called in the 'finally' block of the Transaction Manager.
   */
  static releaseAll(txId: string): void {
    const heldLocks = this.txLocks.get(txId);
    if (!heldLocks) return;

    for (const resourceId of heldLocks) {
      const mutex = this.locks.get(resourceId);
      if (mutex) {
        mutex.release();
      }
    }
    this.txLocks.delete(txId);
  }
  
  /**
   * Manually release a lock (if not using transactions)
   */
  static release(resourceId: string): void {
     const mutex = this.locks.get(resourceId);
     if (mutex) {
       mutex.release();
     }
  }
}
