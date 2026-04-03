'use client'

import { useState, useEffect, useCallback } from 'react'
import { db, Application } from '../offline/db'

/**
 * Hook to save/retrieve application draft from offline storage
 */
export function useOfflineStorage(applicationId?: string) {
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load application from IndexedDB
  const loadApplication = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const app = await db.getApplication(id)
      setApplication(app || null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load application'
      setError(message)
      console.error('Error loading application:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save application to IndexedDB
  const saveApplication = useCallback(
    async (appData: Omit<Application, 'id'>) => {
      try {
        setError(null)

        if (applicationId) {
          // Update existing
          await db.updateApplication(applicationId, appData)
        } else {
          // Create new
          const id = await db.addApplication(appData)
          setApplication({ ...appData, id: id.toString() } as Application)
          return id
        }

        // Reload to get updated timestamp
        if (applicationId) {
          await loadApplication(applicationId)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save application'
        setError(message)
        console.error('Error saving application:', err)
      }
    },
    [applicationId, loadApplication]
  )

  // Delete application
  const deleteApplication = useCallback(async (id: string) => {
    try {
      setError(null)
      await db.applications.delete(id)
      setApplication(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete application'
      setError(message)
      console.error('Error deleting application:', err)
    }
  }, [])

  // Queue application for sync
  const queueForSync = useCallback(
    async (appData: Partial<Application>) => {
      try {
        setError(null)

        if (!applicationId) {
          throw new Error('Application ID is required to queue for sync')
        }

        await db.queueOperation('update', 'application', applicationId, appData)
        await db.updateApplication(applicationId, { syncStatus: 'pending_sync' })
        await loadApplication(applicationId)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to queue for sync'
        setError(message)
        console.error('Error queuing for sync:', err)
      }
    },
    [applicationId, loadApplication]
  )

  // Load on mount if ID provided
  useEffect(() => {
    if (applicationId) {
      loadApplication(applicationId)
    }
  }, [applicationId, loadApplication])

  return {
    application,
    isLoading,
    error,
    saveApplication,
    deleteApplication,
    queueForSync,
    reload: () => applicationId && loadApplication(applicationId),
  }
}

/**
 * Hook to get all applications for an advisor (with filtering)
 */
export function useAdvisorApplications(advisorId?: string) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!advisorId) {
        setApplications([])
        return
      }

      const apps = await db.getAdvisorApplications(advisorId)
      setApplications(apps)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load applications'
      setError(message)
      console.error('Error loading applications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [advisorId])

  useEffect(() => {
    loadApplications()
  }, [advisorId, loadApplications])

  // Filter applications by status
  const getByStatus = useCallback((status: Application['syncStatus']) => {
    return applications.filter((app) => app.syncStatus === status)
  }, [applications])

  return {
    applications,
    isLoading,
    error,
    reload: loadApplications,
    getByStatus,
    draft: applications.filter((app) => app.syncStatus === 'draft'),
    pending: applications.filter((app) => app.syncStatus === 'pending_sync'),
    synced: applications.filter((app) => app.syncStatus === 'synced'),
    failed: applications.filter((app) => app.syncStatus === 'error'),
  }
}

/**
 * Hook to auto-save form data to IndexedDB
 */
export function useAutoSaveForm(applicationId: string | undefined, debounceMs = 1000) {
  const [formData, setFormData] = useState<Partial<Application>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-save with debounce
  useEffect(() => {
    if (!applicationId || Object.keys(formData).length === 0) {
      return
    }

    const timeout = setTimeout(async () => {
      try {
        await db.updateApplication(applicationId, {
          ...formData,
          lastModifiedOfflineAt: Date.now(),
        })
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [formData, applicationId, debounceMs])

  return {
    formData,
    setFormData,
    lastSaved,
  }
}
