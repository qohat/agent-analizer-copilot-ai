/**
 * Offline infrastructure exports
 * Central place to import all offline-first functionality
 */

// Database
export { db, CreditCopilotDB } from './db'
export type { Application, SyncQueueItem, SyncMetadata } from './db'

// Sync engine
export {
  syncApplications,
  retrySyncOperations,
  getSyncStatus,
  forceSyncNow,
  getSyncHistory,
  getDeviceId,
  getLastSyncTimestamp,
} from './sync'
export type { SyncResponse, SyncConflict, SyncError } from './sync'

// Utilities
export {
  getStorageUsage,
  requestPersistentStorage,
  isPersistentStorageGranted,
  clearOfflineData,
  exportOfflineData,
  importOfflineData,
  getOfflineDataStats,
  validateOfflineDataIntegrity,
  cleanupOldSyncEntries,
  retryAllFailedOperations,
} from './utils'
