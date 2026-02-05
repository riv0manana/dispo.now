import { AsyncLocalStorage } from 'node:async_hooks';

export const transactionStorage = new AsyncLocalStorage<any>();

export const getDb = (defaultDb: any) => {
  const tx = transactionStorage.getStore();
  return tx || defaultDb;
};
