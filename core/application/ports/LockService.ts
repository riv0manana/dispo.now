export interface LockService {
  /**
   * Acquires a lock on the specified resource.
   * This ensures that no other process can modify or book this resource
   * until the current transaction is committed or rolled back.
   */
  acquire(resourceId: string): Promise<void>;
}
