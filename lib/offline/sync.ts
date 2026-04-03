import { db, Application, SyncQueueItem } from './db'

/**
 * Error type for sync failures
 */
export interface SyncError {
  operationId: string
  entityId: string
  error: string
  timestamp: number
  retryable: boolean
}

/**
 * Response from server sync endpoint
 */
export interface SyncResponse {
  success: boolean
  synced_count: number
  failed_count: number
  conflicts: SyncConflict[]
  resolved_applications: Array<{
    localId: string
    serverId: string
    updated: Partial<Application>
  }>
  errors: SyncError[]
  server_timestamp: number
}

/**
 * Conflict when same entity modified both offline and on server
 */
export interface SyncConflict {
  entityId: string
  entityType: string
  localVersion: Record<string, any>
  serverVersion: Record<string, any>
  lastModifiedLocal: number
  lastModifiedServer: number
}

/**
 * Batch of operations to send to server
 */
interface SyncBatch {
  device_id: string
  advisor_id?: string
  institution_id?: string
  pending_operations: Array<{
    id: string
    operation: 'create' | 'update' | 'delete'
    entity_type: string
    entity_id: string
    data: Record<string, any>
    created_offline_at: number
    retry_count?: number
  }>
  last_sync_timestamp: number
}

/**
 * Get or generate device ID
 */
export function getDeviceId(): string {
  const key = 'credit_copilot_device_id'
  let deviceId = localStorage.getItem(key)

  if (!deviceId) {
    // Generate unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(key, deviceId)
  }

  return deviceId
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTimestamp(): Promise<number> {
  const deviceId = getDeviceId()
  const metadata = await db.getDeviceMetadata(deviceId)
  return metadata?.lastSyncTimestamp ?? 0
}

/**
 * Main sync function - batches pending operations and syncs to server
 */
export async function syncApplications(advisorId?: string, institutionId?: string) {
  try {
    const deviceId = getDeviceId()
    const lastSyncTs = await getLastSyncTimestamp()

    // 1. Gather pending operations from IndexedDB
    const pendingOps = await db.getPendingSyncOperations()

    if (pendingOps.length === 0) {
      // No operations to sync
      return {
        success: true,
        synced_count: 0,
        failed_count: 0,
        conflicts: [],
        resolved_applications: [],
        errors: [],
        server_timestamp: Date.now(),
      } as SyncResponse
    }

    // 2. Build sync payload
    const batch: SyncBatch = {
      device_id: deviceId,
      advisor_id: advisorId,
      institution_id: institutionId,
      pending_operations: pendingOps.map((op) => ({
        id: op.id?.toString() ?? '',
        operation: op.operation,
        entity_type: op.entityType,
        entity_id: op.entityId,
        data: op.data,
        created_offline_at: op.createdAt,
        retry_count: op.retryCount,
      })),
      last_sync_timestamp: lastSyncTs,
    }

    // 3. Send to server
    const response = await fetch('/api/applications/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Sync failed with status ${response.status}`
      )
    }

    const result: SyncResponse = await response.json()

    // 4. Process results
    if (result.success) {
      await reconcileSync(result, pendingOps)

      // 5. Update device metadata
      await db.updateDeviceMetadata(deviceId, {
        lastSyncTimestamp: result.server_timestamp,
        lastSuccessfulSync: Date.now(),
        totalSyncedOperations:
          (await db.getDeviceMetadata(deviceId))?.totalSyncedOperations ?? 0 +
          result.synced_count,
      })

      return result
    } else {
      throw new Error('Server sync failed')
    }
  } catch (error) {
    const deviceId = getDeviceId()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Update device metadata with error
    await db.updateDeviceMetadata(deviceId, {
      lastSyncError: errorMessage,
    })

    throw error
  }
}

/**
 * Reconcile sync response with local database
 */
async function reconcileSync(result: SyncResponse, pendingOps: SyncQueueItem[]) {
  // Handle successful syncs - mark operations as synced
  const syncedIds = new Set<string>()
  for (const resolved of result.resolved_applications) {
    syncedIds.add(resolved.localId)

    // Update local application with server ID and sync status
    const localId = resolved.localId
    await db.updateApplication(localId, {
      serverApplicationId: resolved.serverId,
      syncStatus: 'synced',
      ...resolved.updated,
    })
  }

  // Mark operations as synced in queue
  for (const op of pendingOps) {
    if (syncedIds.has(op.entityId)) {
      if (op.id) {
        await db.markOperationSynced(op.id)
      }
    }
  }

  // Handle failed operations - mark with error
  for (const error of result.errors) {
    const syncQueueItem = pendingOps.find((op) => op.id?.toString() === error.operationId)
    if (syncQueueItem?.id) {
      await db.markOperationFailed(syncQueueItem.id, error.error)

      // Update application with error status if it exists
      const app = await db.getApplication(error.entityId)
      if (app) {
        await db.updateApplication(error.entityId, {
          syncStatus: 'error',
          lastSyncError: error.error,
        })
      }
    }
  }

  // Handle conflicts - user intervention required
  if (result.conflicts.length > 0) {
    console.warn('Sync conflicts detected:', result.conflicts)
    // TODO: Implement conflict resolution UI
  }
}

/**
 * Retry failed sync operations with exponential backoff
 */
export async function retrySyncOperations(maxRetries = 3) {
  const failedOps = await db.getFailedSyncOperations()
  const opsToRetry = failedOps.filter((op) => op.retryCount < maxRetries)

  if (opsToRetry.length === 0) {
    return { retried: 0, succeeded: 0, failed: 0 }
  }

  let succeeded = 0
  let failed = 0

  for (const op of opsToRetry) {
    try {
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.min(1000 * Math.pow(2, op.retryCount), 30000)
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Retry the operation
      await db.queueOperation(op.operation, op.entityType as any, op.entityId, op.data)
      if (op.id) {
        await db.markOperationSynced(op.id) // Move back to pending for next sync
      }
      succeeded++
    } catch (error) {
      failed++
      console.error(`Failed to retry operation ${op.id}:`, error)
    }
  }

  // Run sync to send retried operations
  try {
    await syncApplications()
  } catch (error) {
    console.error('Sync failed after retry:', error)
  }

  return { retried: opsToRetry.length, succeeded, failed }
}

/**
 * Get sync status summary
 */
export async function getSyncStatus() {
  const deviceId = getDeviceId()
  const pendingOps = await db.getPendingSyncOperations()
  const failedOps = await db.getFailedSyncOperations()
  const metadata = await db.getDeviceMetadata(deviceId)

  return {
    pendingOperations: pendingOps.length,
    failedOperations: failedOps.length,
    lastSyncTimestamp: metadata?.lastSyncTimestamp ?? 0,
    lastSuccessfulSync: metadata?.lastSuccessfulSync ?? 0,
    totalSyncedOperations: metadata?.totalSyncedOperations ?? 0,
    lastError: metadata?.lastSyncError,
    isSyncing: false,
  }
}

/**
 * Force a full sync of all pending operations
 */
export async function forceSyncNow(advisorId?: string, institutionId?: string) {
  return syncApplications(advisorId, institutionId)
}

/**
 * Get detailed sync history
 */
export async function getSyncHistory(limit = 50) {
  const queue = await db.syncQueue.limit(limit).reverse().toArray()
  return queue.map((item) => ({
    id: item.id,
    operation: item.operation,
    entityType: item.entityType,
    status: item.status,
    createdAt: new Date(item.createdAt),
    retryCount: item.retryCount,
    error: item.error,
  }))
}
