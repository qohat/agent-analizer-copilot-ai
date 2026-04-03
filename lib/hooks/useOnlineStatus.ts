'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook to detect online/offline status
 * Uses both navigator.onLine and periodic connectivity checks
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(false)

  // Handle online/offline events
  const handleOnline = useCallback(() => {
    setIsOnline(true)
  }, [])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
  }, [])

  // Check actual connectivity by making a lightweight request
  const checkConnectivity = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      setIsCheckingConnectivity(true)

      // Use a HEAD request to /api/health (lightweight)
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
      })

      const online = response.ok || response.status === 204
      setIsOnline(online)
      return online
    } catch (error) {
      // Network error means offline
      setIsOnline(false)
      return false
    } finally {
      setIsCheckingConnectivity(false)
    }
  }, [])

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine)

    // Listen to online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic connectivity check every 30 seconds
    const interval = setInterval(() => {
      checkConnectivity()
    }, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [handleOnline, handleOffline, checkConnectivity])

  return {
    isOnline,
    isCheckingConnectivity,
    checkConnectivity,
  }
}

/**
 * Hook to subscribe to online status changes
 */
export function useOnlineStatusListener(callback: (isOnline: boolean) => void) {
  useEffect(() => {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [callback])
}
