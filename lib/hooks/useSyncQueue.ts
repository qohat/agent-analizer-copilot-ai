'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSyncStatus, syncApplications, forceSyncNow } from '../offline/sync'
import { useOnlineStatusListener } from './useOnlineStatus'

/**
 * Sync queue status type
 */
export interface SyncQueueStatus {
  pendingOperations: number
  failedOperations: number
  lastSyncTimestamp: number
  lastSuccessfulSync: number
  totalSyncedOperations: number
  lastError?: string
  isSyncing: boolean
}

/**
 * Hook to monitor and manage sync queue
 * Auto-syncs when online
 */
export function useSyncQueue() {
  const [syncStatus, setSyncStatus] = useState<SyncQueueStatus>({
    pendingOperations: 0,
    failedOperations: 0,
    lastSyncTimestamp: 0,
    lastSuccessfulSync: 0,
    totalSyncedOperations: 0,
    isSyncing: false,
  })

  const [syncError, setSyncError] = useState<string | null>(null)

  // Update sync status
  const updateSyncStatus = useCallback(async () => {
    try {
      const status = await getSyncStatus()
      setSyncStatus(status)
      setSyncError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get sync status'
      setSyncError(message)
    }
  }, [])

  // Manual sync trigger
  const triggerSync = useCallback(async (advisorId?: string, institutionId?: string) => {
    try {
      setSyncStatus((prev) => ({ ...prev, isSyncing: true }))
      setSyncError(null)

      await forceSyncNow(advisorId, institutionId)
      await updateSyncStatus()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed'
      setSyncError(message)
    } finally {
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }))
    }
  }, [updateSyncStatus])

  // Auto-sync when online
  const handleOnlineStatusChange = useCallback(
    (isOnline: boolean) => {
      if (isOnline) {
        // When device comes online, attempt sync after 1 second
        setTimeout(() => {
          triggerSync()
        }, 1000)
      }
    },
    [triggerSync]
  )

  useOnlineStatusListener(handleOnlineStatusChange)

  // Initial status fetch
  useEffect(() => {
    updateSyncStatus()

    // Poll sync status every 10 seconds
    const interval = setInterval(() => {
      updateSyncStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [updateSyncStatus])

  return {
    ...syncStatus,
    syncError,
    triggerSync,
    updateStatus: updateSyncStatus,
  }
}

/**
 * Hook to get count of pending operations
 */
export function usePendingOperationsCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const updateCount = async () => {
      const status = await getSyncStatus()
      setCount(status.pendingOperations)
    }

    updateCount()

    // Update every 5 seconds
    const interval = setInterval(updateCount, 5000)

    return () => clearInterval(interval)
  }, [])

  return count
}
