# Offline-First Strategy - Copiloto de Crédito

## Overview

This document describes the offline-first architecture for the Copiloto de Crédito application. The app is designed to work completely offline in rural areas with unstable connectivity, syncing data when internet is available.

## Architecture

### Core Components

#### 1. **Local Storage (IndexedDB via Dexie.js)**

- **Purpose**: Persist application drafts, client data, and analysis results locally
- **Why Dexie**: Typed interface, transactions, indexes, large capacity (50MB+)
- **Tables**:
  - `applications`: Credit application drafts and completed forms
  - `syncQueue`: Pending operations waiting to sync
  - `syncMetadata`: Device tracking and sync history

```typescript
// Example: Save application locally
const app = await db.addApplication({
  clientFirstName: 'Juan',
  clientLastName: 'Pérez',
  requestedAmount: 5000,
  applicationTypeId: 'commercial',
  syncStatus: 'draft',
})
```

#### 2. **Service Worker (PWA via next-pwa)**

- **Purpose**: Cache app assets and enable offline access
- **Capabilities**:
  - App shell caching (JS, CSS, fonts)
  - API response caching with TTL strategies
  - Background sync support
  - Offline page fallback

- **Installation**: Configured in `next.config.js` with `next-pwa`
- **Manifest**: `public/manifest.json` (PWA metadata)

#### 3. **Sync Engine**

The sync engine batches offline changes and sends them to the server when online.

**How it works**:
1. User creates/edits application offline → saved to IndexedDB
2. Operation queued in `syncQueue` table
3. When online, `syncApplications()` batches all pending operations
4. Sends to `/api/applications/sync` endpoint
5. Server processes and returns results
6. Conflict resolution if needed
7. Local database updated with server IDs

**Key functions**:
- `syncApplications(advisorId?, institutionId?)` - Main sync function
- `retrySyncOperations(maxRetries)` - Retry failed operations with backoff
- `getSyncStatus()` - Get current sync queue status
- `forceSyncNow()` - Manual sync trigger

```typescript
// Example: Trigger sync
const result = await syncApplications('advisor_123', 'institution_456')
console.log(`Synced ${result.synced_count} operations`)
```

#### 4. **Online Status Detection**

Two-tier approach for reliability:
- **Tier 1**: `navigator.onLine` events (fast but not always accurate)
- **Tier 2**: Periodic HEAD requests to `/api/health` (accurate but slower)

**Hook**: `useOnlineStatus()`
- Returns: `{ isOnline, isCheckingConnectivity, checkConnectivity }`
- Polls every 30 seconds
- Triggers auto-sync when device comes online

```typescript
// Example: Detect online status
const { isOnline, checkConnectivity } = useOnlineStatus()

if (!isOnline) {
  console.log('Application running offline')
}
```

## Hooks & Components

### Hooks

#### `useOnlineStatus()`
Monitor connectivity status

```typescript
const { isOnline, isCheckingConnectivity, checkConnectivity } = useOnlineStatus()
```

#### `useSyncQueue()`
Monitor sync queue and trigger syncs

```typescript
const {
  pendingOperations,
  failedOperations,
  isSyncing,
  lastError,
  triggerSync,
  updateStatus,
} = useSyncQueue()
```

#### `useOfflineStorage(applicationId)`
Save/retrieve application drafts

```typescript
const {
  application,
  isLoading,
  error,
  saveApplication,
  deleteApplication,
  queueForSync,
} = useOfflineStorage('app_123')

// Save locally
await saveApplication({
  clientFirstName: 'Juan',
  requestedAmount: 5000,
  ...
})
```

#### `useAdvisorApplications(advisorId)`
Get all applications for an advisor with filtering

```typescript
const {
  applications,
  draft,
  pending,
  synced,
  failed,
  getByStatus,
} = useAdvisorApplications('advisor_123')
```

#### `useAutoSaveForm(applicationId)`
Auto-save form changes with debounce

```typescript
const { formData, setFormData, lastSaved } = useAutoSaveForm('app_123', 1000)
```

### Components

#### `<OfflineIndicator />`
Full-featured status display

```typescript
<OfflineIndicator compact={false} showDetails={true} />
// Shows: online/offline/syncing status, pending count, last error
```

#### `<SyncStatusBadge />`
Minimal badge for headers

```typescript
<SyncStatusBadge />
// Shows compact status (e.g., "Sin conexión", "Sincronizando")
```

#### `<SyncStatusButton />`
Interactive button with manual sync

```typescript
<SyncStatusButton
  onManualSync={async () => { /* custom logic */ }}
  advisorId="advisor_123"
  institutionId="inst_456"
/>
```

## Data Flow

### Creating & Saving Application (Offline)

```
┌─────────────────────────────────────────────────┐
│ 1. User fills form in browser (offline)         │
│    → Form data stored in useState               │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 2. useAutoSaveForm auto-saves to IndexedDB      │
│    every 1 second (debounced)                   │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 3. db.updateApplication() updates local record │
│    lastModifiedOfflineAt = now                  │
│    syncStatus = 'draft'                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 4. User submits form                            │
│    → Optimistic UI update                       │
│    → Save to IndexedDB                          │
│    → Queue operation in syncQueue               │
│    → Update syncStatus = 'pending_sync'         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
         [User gets confirmation]
     [Data is safe locally]
```

### Syncing (Online)

```
┌──────────────────────────────────┐
│ Device comes online              │
│ → useOnlineStatus detects        │
│ → Triggers useSyncQueue.onOnline │
└────────────────┬─────────────────┘
                 │
┌────────────────▼──────────────────────────┐
│ syncApplications() is called              │
│ 1. Read all pending operations from DB    │
│ 2. Build batch payload                    │
│ 3. POST to /api/applications/sync         │
└────────────────┬──────────────────────────┘
                 │
┌────────────────▼──────────────────────────┐
│ Server processes:                         │
│ 1. Validate each operation                │
│ 2. Check for conflicts                    │
│ 3. Store to backend database              │
│ 4. Assign server IDs                      │
│ 5. Return results                         │
└────────────────┬──────────────────────────┘
                 │
┌────────────────▼──────────────────────────┐
│ Client reconciles:                        │
│ 1. Mark succeeded ops as synced           │
│ 2. Update local apps with server IDs      │
│ 3. Handle conflicts (if any)              │
│ 4. Update syncMetadata                    │
└────────────────┬──────────────────────────┘
                 │
                 ▼
      [All data on server]
```

## Conflict Resolution

When the same record is modified both offline and on server between syncs:

1. **Detection**: Server detects conflicting timestamps
2. **Return**: Server returns conflict in sync response
3. **Resolution**: Last-write-wins by default
4. **User Override**: (Future) UI dialog allows user to choose version

Current strategy: Server version always wins (most recent = authoritative)

## Testing Offline Functionality

### Manual Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test offline form fill**:
   - Open DevTools → Network tab
   - Click "Offline" checkbox
   - Fill form → should work without errors
   - Verify data saved to IndexedDB

3. **Test sync**:
   - Go back online
   - System should auto-sync after 1 second
   - Monitor Network tab
   - Verify POST to `/api/applications/sync`

4. **Browser storage**:
   ```javascript
   // In DevTools console:
   const apps = await db.applications.toArray()
   console.log(apps)
   ```

### Chrome DevTools

**View IndexedDB**:
- DevTools → Application → IndexedDB → creditCopilotDB
- View tables: applications, syncQueue, syncMetadata

**Test offline**:
- DevTools → Network → Offline checkbox
- Throttle to "Slow 3G" for realistic testing

**View Service Worker**:
- DevTools → Application → Service Workers
- Check registered SW status

## Performance Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| IndexedDB read | <5ms | Local lookups |
| IndexedDB write | <10ms | Save application |
| Form auto-save | Debounced 1s | Prevents excessive writes |
| Sync batch time | <2s | Network dependent |
| Initial load | <3s | App shell cached |
| Service Worker registration | <1s | On first visit |

## Error Handling

### Sync Failures

1. **Network error**:
   - Operation remains in queue
   - Retry with exponential backoff (1s, 2s, 4s, 8s...)
   - Max 5 retries before marking as error

2. **Server validation error**:
   - Operation marked as error
   - Error message stored locally
   - User notified in UI
   - Can retry after fixing issue

3. **Conflict detected**:
   - Conflict shown in UI
   - User resolves manually
   - Retry after resolution

### User Notifications

- **Offline**: Banner says "Sin conexión"
- **Syncing**: Spinner + "Sincronizando..."
- **Success**: "Datos sincronizados" (green)
- **Error**: "Error de sincronización" with retry button

## Security Considerations

1. **No sensitive data caching**:
   - IndexedDB is NOT encrypted by default
   - Only store necessary application data
   - PII is stored but encrypted in transit (HTTPS)

2. **Device isolation**:
   - Each device has unique device_id
   - Device_id stored in localStorage (survives app uninstall)
   - Used to track which device modified which records

3. **Auth**:
   - App requires advisor login via Supabase Auth
   - JWT token in httpOnly cookie (secure, not accessible to JS)
   - Sync endpoint validates JWT on server

## Debugging

### Export all offline data

```typescript
import { exportOfflineData } from '@/lib/offline'

const jsonData = await exportOfflineData()
console.log(jsonData)
// Download and save for analysis
```

### Get storage stats

```typescript
import { getOfflineDataStats } from '@/lib/offline'

const stats = await getOfflineDataStats()
console.log(stats)
// {
//   applications: { total: 15, draft: 3, pending: 2, synced: 10, error: 0 },
//   syncQueue: { total: 2, pending: 2, synced: 0, error: 0 },
//   storage: { used: 2048000, available: 10485760, percentUsed: 19.5 }
// }
```

### Validate data integrity

```typescript
import { validateOfflineDataIntegrity } from '@/lib/offline'

const result = await validateOfflineDataIntegrity()
if (!result.valid) {
  console.error('Data integrity issues:', result.issues)
}
```

### Clear all offline data (⚠️ destructive)

```typescript
import { clearOfflineData } from '@/lib/offline'

await clearOfflineData()
console.log('All offline data cleared')
```

## API Endpoints

### POST /api/applications/sync

**Request**:
```json
{
  "device_id": "device_123",
  "advisor_id": "advisor_456",
  "institution_id": "inst_789",
  "pending_operations": [
    {
      "id": "op_1",
      "operation": "create",
      "entity_type": "application",
      "entity_id": "local_app_123",
      "data": { "clientFirstName": "Juan", ... },
      "created_offline_at": 1704067200000,
      "retry_count": 0
    }
  ],
  "last_sync_timestamp": 1704066000000
}
```

**Response**:
```json
{
  "success": true,
  "synced_count": 1,
  "failed_count": 0,
  "conflicts": [],
  "resolved_applications": [
    {
      "localId": "local_app_123",
      "serverId": "server_app_789",
      "updated": {}
    }
  ],
  "errors": [],
  "server_timestamp": 1704067300000
}
```

### GET /api/health

Simple health check for connectivity testing

**Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Deployment Notes

1. **Service Worker in production**:
   - `next-pwa` auto-generates SW.js
   - Set appropriate cache strategies
   - Be careful with aggressive caching

2. **IndexedDB quota**:
   - Most browsers: 10-50% of available storage
   - Request persistent storage for guaranteed quota
   - Implement cleanup of old sync queue entries

3. **Monitoring**:
   - Log sync failures to Sentry
   - Track offline/online transitions
   - Monitor sync performance metrics

## Future Improvements

- [ ] Conflict resolution UI (show both versions, let user choose)
- [ ] Bi-directional sync (pull new data from server)
- [ ] Partial sync (only sync recent changes)
- [ ] Encryption at rest (encrypt IndexedDB data)
- [ ] Backup & restore functionality
- [ ] Migration from other devices
- [ ] Periodic database compaction

---

**Last Updated**: 2026-03-30
**Version**: 1.0 (MVP)
