import { db } from './db'

/**
 * Calculate storage usage
 */
export async function getStorageUsage(): Promise<{
  used: number
  available: number
  percentUsed: number
}> {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { used: 0, available: 0, percentUsed: 0 }
    }

    const estimate = await navigator.storage.estimate()
    const used = estimate.usage || 0
    const available = estimate.quota || 0
    const percentUsed = available > 0 ? (used / available) * 100 : 0

    return { used, available, percentUsed }
  } catch (error) {
    console.error('Failed to get storage usage:', error)
    return { used: 0, available: 0, percentUsed: 0 }
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage || !navigator.storage.persist) {
      return false
    }

    const isPersisted = await navigator.storage.persist()
    console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`)
    return isPersisted
  } catch (error) {
    console.error('Failed to request persistent storage:', error)
    return false
  }
}

/**
 * Check if persistent storage is granted
 */
export async function isPersistentStorageGranted(): Promise<boolean> {
  try {
    if (!navigator.storage || !navigator.storage.persisted) {
      return false
    }

    return await navigator.storage.persisted()
  } catch (error) {
    console.error('Failed to check persistent storage:', error)
    return false
  }
}

/**
 * Clear all offline data (destructive)
 */
export async function clearOfflineData() {
  try {
    await db.clearAllData()
    localStorage.clear()
    sessionStorage.clear()
    console.log('All offline data cleared')
    return true
  } catch (error) {
    console.error('Failed to clear offline data:', error)
    return false
  }
}

/**
 * Export all data for backup
 */
export async function exportOfflineData(): Promise<string> {
  try {
    const data = await db.exportAllData()
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Failed to export data:', error)
    throw error
  }
}

/**
 * Import data from backup (destructive - replaces all data)
 */
export async function importOfflineData(jsonData: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData)

    // Clear existing data
    await db.clearAllData()

    // Import applications
    if (Array.isArray(data.applications)) {
      for (const app of data.applications) {
        await db.applications.add(app)
      }
    }

    // Import sync queue
    if (Array.isArray(data.syncQueue)) {
      for (const item of data.syncQueue) {
        await db.syncQueue.add(item)
      }
    }

    console.log('Data imported successfully')
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}

/**
 * Get summary statistics
 */
export async function getOfflineDataStats() {
  try {
    const applications = await db.applications.toArray()
    const syncQueue = await db.syncQueue.toArray()
    const storage = await getStorageUsage()

    const stats = {
      applications: {
        total: applications.length,
        draft: applications.filter((a) => a.syncStatus === 'draft').length,
        pending: applications.filter((a) => a.syncStatus === 'pending_sync').length,
        synced: applications.filter((a) => a.syncStatus === 'synced').length,
        error: applications.filter((a) => a.syncStatus === 'error').length,
      },
      syncQueue: {
        total: syncQueue.length,
        pending: syncQueue.filter((s) => s.status === 'pending').length,
        synced: syncQueue.filter((s) => s.status === 'synced').length,
        error: syncQueue.filter((s) => s.status === 'error').length,
      },
      storage,
    }

    return stats
  } catch (error) {
    console.error('Failed to get offline stats:', error)
    return null
  }
}

/**
 * Validate data integrity
 */
export async function validateOfflineDataIntegrity(): Promise<{
  valid: boolean
  issues: string[]
}> {
  const issues: string[] = []

  try {
    const applications = await db.applications.toArray()
    const syncQueue = await db.syncQueue.toArray()

    // Check applications
    for (const app of applications) {
      if (!app.clientFirstName || !app.clientLastName) {
        issues.push(`Application ${app.id}: Missing client name`)
      }
      if (!app.requestedAmount || app.requestedAmount <= 0) {
        issues.push(`Application ${app.id}: Invalid loan amount`)
      }
      if (!app.syncStatus) {
        issues.push(`Application ${app.id}: Missing sync status`)
      }
    }

    // Check sync queue
    for (const item of syncQueue) {
      if (!item.operation) {
        issues.push(`Sync queue item ${item.id}: Missing operation`)
      }
      if (!item.entityType) {
        issues.push(`Sync queue item ${item.id}: Missing entity type`)
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    }
  } catch (error) {
    return {
      valid: false,
      issues: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Cleanup old sync queue entries (older than 30 days)
 */
export async function cleanupOldSyncEntries(daysOld = 30) {
  try {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000
    const oldEntries = await db.syncQueue
      .where('createdAt')
      .below(cutoffTime)
      .and((item) => item.status === 'synced')
      .toArray()

    const deleted = await db.syncQueue.bulkDelete(
      oldEntries.map((e) => e.id).filter((id): id is any => id !== undefined)
    )

    console.log(`Deleted ${deleted} old sync queue entries`)
    return deleted
  } catch (error) {
    console.error('Failed to cleanup sync queue:', error)
    return 0
  }
}

/**
 * Batch mark failed operations for retry
 */
export async function retryAllFailedOperations() {
  try {
    const failed = await db.getFailedSyncOperations()
    let retried = 0

    for (const op of failed) {
      if (op.id) {
        await db.markOperationFailed(op.id, op.error || 'Retrying')
        retried++
      }
    }

    return retried
  } catch (error) {
    console.error('Failed to retry operations:', error)
    return 0
  }
}
