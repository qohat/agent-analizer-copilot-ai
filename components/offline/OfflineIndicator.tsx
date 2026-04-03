'use client'

import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { useSyncQueue } from '@/lib/hooks/useSyncQueue'
import { Wifi, WifiOff, Cloud, CloudOff, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'error' | 'synced'

interface OfflineIndicatorProps {
  compact?: boolean
  showDetails?: boolean
}

/**
 * Indicator showing online/offline/sync status
 * Displays connection status and pending operations count
 */
export function OfflineIndicator({ compact = false, showDetails = true }: OfflineIndicatorProps) {
  const { isOnline } = useOnlineStatus()
  const { pendingOperations, isSyncing, lastError } = useSyncQueue()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  let status: SyncStatus = 'offline'
  let statusText = 'Sin conexión'
  let icon = <WifiOff className="w-4 h-4" />

  if (isOnline && !isSyncing && !lastError) {
    status = 'online'
    statusText = 'En línea'
    icon = <Wifi className="w-4 h-4" />
  } else if (isOnline && isSyncing) {
    status = 'syncing'
    statusText = 'Sincronizando...'
    icon = <Cloud className="w-4 h-4 animate-spin" />
  } else if (isOnline && lastError) {
    status = 'error'
    statusText = 'Error de sincronización'
    icon = <AlertCircle className="w-4 h-4" />
  } else if (!isOnline) {
    status = 'offline'
    statusText = 'Sin conexión'
    icon = <CloudOff className="w-4 h-4" />
  }

  // Color based on status
  const colorClass =
    status === 'online'
      ? 'text-green-600'
      : status === 'offline'
        ? 'text-amber-600'
        : status === 'syncing'
          ? 'text-blue-600'
          : 'text-red-600'

  const bgColorClass =
    status === 'online'
      ? 'bg-green-50'
      : status === 'offline'
        ? 'bg-amber-50'
        : status === 'syncing'
          ? 'bg-blue-50'
          : 'bg-red-50'

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${bgColorClass}`}>
        <div className={colorClass}>{icon}</div>
        <span className={`${colorClass} font-medium`}>{statusText}</span>
        {pendingOperations > 0 && (
          <span className={`${colorClass} text-xs`}>({pendingOperations})</span>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-lg border p-4 ${bgColorClass}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${colorClass}`}>{icon}</div>

        <div className="flex-1">
          <div className={`font-semibold ${colorClass}`}>{statusText}</div>

          {showDetails && (
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              {isOnline ? (
                <>
                  <p>Conectado a internet</p>
                  {pendingOperations > 0 && (
                    <p className="font-medium">
                      {pendingOperations} operación{pendingOperations !== 1 ? 'es' : ''} pendiente
                      {pendingOperations !== 1 ? 's' : ''}
                    </p>
                  )}
                  {isSyncing && <p>Sincronizando datos...</p>}
                  {lastError && (
                    <p className="text-red-600">
                      Último error: {lastError}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>Sin conexión a internet</p>
                  {pendingOperations > 0 && (
                    <p className="font-medium">
                      {pendingOperations} cambio{pendingOperations !== 1 ? 's' : ''} se sincronizarán
                      cuando haya conexión
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Minimal status badge for headers/navbars
 */
export function SyncStatusBadge() {
  const { isOnline } = useOnlineStatus()
  const { pendingOperations, isSyncing } = useSyncQueue()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
        <WifiOff className="w-3 h-3" />
        Sin conexión
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
        <Cloud className="w-3 h-3 animate-spin" />
        Sincronizando
      </div>
    )
  }

  if (pendingOperations > 0) {
    return (
      <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
        <Wifi className="w-3 h-3" />
        {pendingOperations} pendiente{pendingOperations !== 1 ? 's' : ''}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
      <Wifi className="w-3 h-3" />
      Sincronizado
    </div>
  )
}

/**
 * Sync status button with action menu
 */
interface SyncStatusButtonProps {
  onManualSync?: () => void | Promise<void>
  advisorId?: string
  institutionId?: string
}

export function SyncStatusButton({
  onManualSync,
  advisorId,
  institutionId,
}: SyncStatusButtonProps) {
  const { isOnline } = useOnlineStatus()
  const { isSyncing, triggerSync } = useSyncQueue()
  const [isOpen, setIsOpen] = useState(false)
  const [isManualSyncing, setIsManualSyncing] = useState(false)

  const handleSync = async () => {
    try {
      setIsManualSyncing(true)
      if (onManualSync) {
        await onManualSync()
      } else {
        await triggerSync(advisorId, institutionId)
      }
    } finally {
      setIsManualSyncing(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isOnline || isSyncing || isManualSyncing}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          !isOnline
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isSyncing || isManualSyncing
              ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {isSyncing || isManualSyncing ? (
            <Cloud className="w-4 h-4 animate-spin" />
          ) : (
            <Wifi className="w-4 h-4" />
          )}
          {isSyncing || isManualSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={handleSync}
            disabled={!isOnline}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Sincronizar ahora
          </button>
          <button
            onClick={() => {
              window.open('/api/applications/export', '_blank')
              setIsOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-sm border-t border-gray-200 hover:bg-gray-50"
          >
            Exportar datos
          </button>
        </div>
      )}
    </div>
  )
}
