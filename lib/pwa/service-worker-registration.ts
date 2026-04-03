/**
 * Service Worker registration and management
 * Handles PWA registration, background sync, and offline capabilities
 */

export async function registerServiceWorker() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported in this browser')
    return null
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    })

    console.log('Service Worker registered successfully:', registration)

    // Check for updates every hour
    setInterval(() => {
      registration.update()
    }, 3600000)

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Initialize background sync for pending operations
 */
export async function registerBackgroundSync(tag = 'sync-applications') {
  if (typeof window === 'undefined') {
    return false
  }

  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync API not supported')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.sync.register(tag)
    console.log('Background sync registered for tag:', tag)
    return true
  } catch (error) {
    console.error('Background sync registration failed:', error)
    return false
  }
}

/**
 * Unregister service worker (for cleanup/debugging)
 */
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined') {
    return
  }

  if (!('serviceWorker' in navigator)) {
    return
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.unregister()
    }
    console.log('All Service Workers unregistered')
  } catch (error) {
    console.error('Failed to unregister Service Workers:', error)
  }
}

/**
 * Check if app is installed (PWA)
 */
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Check via display mode
  if (navigator.standalone === true) {
    return true
  }

  // Check via media query (iOS)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  // Check via display-mode CSS media query
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return true
  }

  return false
}

/**
 * Listen for install prompt event (to show "Install App" button)
 */
export function useInstallPrompt(callback: (e: BeforeInstallPromptEvent) => void) {
  if (typeof window === 'undefined') {
    return
  }

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    callback(e as BeforeInstallPromptEvent)
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }
}

/**
 * Trigger PWA install prompt
 */
export async function triggerInstallPrompt(event: BeforeInstallPromptEvent) {
  if (event) {
    event.prompt()
    const { outcome } = await event.userChoice
    console.log(`User response to install prompt: ${outcome}`)
  }
}

/**
 * Listen for app installed event
 */
export function useAppInstalled(callback: () => void) {
  if (typeof window === 'undefined') {
    return
  }

  const handleAppInstalled = () => {
    console.log('PWA was installed')
    callback()
  }

  window.addEventListener('appinstalled', handleAppInstalled)

  return () => {
    window.removeEventListener('appinstalled', handleAppInstalled)
  }
}

/**
 * Type for BeforeInstallPromptEvent (not in standard lib)
 */
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
      platform: string
    }>
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }

  interface NavigatorStandalone {
    standalone?: boolean
  }

  interface Navigator extends NavigatorStandalone {}

  interface ServiceWorkerRegistration {
    sync: SyncManager
  }

  interface SyncManager {
    register(tag: string): Promise<void>
  }
}

export {}
