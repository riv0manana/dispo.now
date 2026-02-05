import { LockService } from '@/core/application/ports/LockService.ts';
import { InMemoryLockManager } from '@/core/infrastructure/concurrency/InMemoryLockManager.ts';

export class FakeLockService implements LockService {
  async acquire(resourceId: string): Promise<void> {
    // Uses the InMemory Lock Manager (Mutex + AsyncLocalStorage)
    await InMemoryLockManager.acquire(resourceId);
  }
}
