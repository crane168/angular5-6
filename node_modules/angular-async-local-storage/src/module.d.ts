import { IndexedDBDatabase } from './service/databases/indexeddb-database';
import { LocalStorageDatabase } from './service/databases/localstorage-database';
import { MockLocalDatabase } from './service/databases/mock-local-database';
export declare function databaseFactory(platformId: Object): IndexedDBDatabase | LocalStorageDatabase | MockLocalDatabase;
export declare class AsyncLocalStorageModule {
}
