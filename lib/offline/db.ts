import Dexie, { Table } from 'dexie'

/**
 * Application data structure - mirrors backend schema
 * Stores credit application drafts and completed applications
 */
export interface Application {
  id?: string
  clientId: string
  applicationTypeId: 'commercial' | 'agricultural'
  requestedAmount: number
  requestedMonths: number

  // Client information
  clientFirstName: string
  clientLastName: string
  clientIdNumber: string
  clientIdType: 'cedula' | 'passport' | 'dni'
  clientPhone: string
  clientEmail?: string
  clientMaritalStatus?: string
  clientAddress?: string
  clientCity?: string
  clientDepartment?: string

  // Spouse/Co-obligor information
  spouseFirstName?: string
  spouseLastName?: string
  spouseIdNumber?: string
  spousePhone?: string
  spouseIncome?: number
  spouseExpenses?: number

  // Business information
  businessName?: string
  businessSector?: string
  businessType?: string
  yearsOperating?: number
  monthlyBusinessIncome?: number
  monthlyBusinessExpenses?: number

  // Income and expenses
  monthlyPersonalIncome?: number
  monthlyPersonalExpenses?: number
  monthlyTotalIncome?: number
  monthlyTotalExpenses?: number

  // Analysis results (stored locally until synced)
  analysisData?: {
    riskLevel?: 'low' | 'medium' | 'high' | 'very_high'
    debtToIncomeRatio?: number
    paymentCapacityPercent?: number
    businessRisk?: string
    keyRisks?: string[]
    recommendation?: string
    conditions?: string[]
    confidenceScore?: number
    rationale?: string
  }

  // Sync status tracking
  syncStatus: 'draft' | 'pending_sync' | 'synced' | 'error'
  createdOfflineAt: number // Unix timestamp
  lastModifiedOfflineAt: number // Unix timestamp
  serverApplicationId?: string // Assigned after server sync
  lastSyncError?: string // Error message if sync failed

  // Metadata
  institutionId?: string
  advisorId?: string
  deviceId?: string
}

/**
 * Sync queue item - tracks operations pending sync to server
 */
export interface SyncQueueItem {
  id?: string
  operation: 'create' | 'update' | 'delete'
  entityType: 'application' | 'client' | 'analysis'
  entityId: string // Local ID of the entity
  data: Record<string, any> // Full data to sync
  createdAt: number // Timestamp when queued
  status: 'pending' | 'synced' | 'conflict' | 'error'
  retryCount: number
  lastRetryAt?: number
  error?: string
}

/**
 * Sync metadata - tracks sync history and state
 */
export interface SyncMetadata {
  id?: string
  deviceId: string
  lastSyncTimestamp: number
  lastSuccessfulSync: number
  totalSyncedOperations: number
  totalFailedOperations: number
  lastSyncError?: string
}

/**
 * Dexie database class for offline-first storage
 * Uses IndexedDB with transaction support and versioning
 */
export class CreditCopilotDB extends Dexie {
  applications!: Table<Application>
  syncQueue!: Table<SyncQueueItem>
  syncMetadata!: Table<SyncMetadata>

  constructor() {
    super('creditCopilotDB')

    // Define schema with version 1
    // Primary keys: ++id (auto-increment), keys for indices
    this.version(1).stores({
      // applications: primary key (id), indices for common queries
      applications: '++id, syncStatus, createdOfflineAt, serverApplicationId, advisorId, institutionId',

      // syncQueue: primary key (id), indices for sync processing
      syncQueue: '++id, status, createdAt, entityType, entityId',

      // syncMetadata: one record per device
      syncMetadata: 'deviceId',
    })
  }

  /**
   * Initialize metadata for current device
   */
  async initDeviceMetadata(deviceId: string) {
    const existing = await this.syncMetadata.get(deviceId)

    if (!existing) {
      await this.syncMetadata.add({
        deviceId,
        lastSyncTimestamp: 0,
        lastSuccessfulSync: 0,
        totalSyncedOperations: 0,
        totalFailedOperations: 0,
      })
    }
  }

  /**
   * Get sync metadata for device
   */
  async getDeviceMetadata(deviceId: string) {
    return this.syncMetadata.get(deviceId)
  }

  /**
   * Update sync metadata
   */
  async updateDeviceMetadata(deviceId: string, updates: Partial<SyncMetadata>) {
    await this.syncMetadata.update(deviceId, updates)
  }

  /**
   * Add application to local storage
   */
  async addApplication(app: Omit<Application, 'id'>) {
    const now = Date.now()
    return this.applications.add({
      ...app,
      createdOfflineAt: now,
      lastModifiedOfflineAt: now,
      syncStatus: 'draft' as const,
    })
  }

  /**
   * Update existing application
   */
  async updateApplication(id: string, updates: Partial<Application>) {
    await this.applications.update(id, {
      ...updates,
      lastModifiedOfflineAt: Date.now(),
    })
  }

  /**
   * Get application by ID
   */
  async getApplication(id: string) {
    return this.applications.get(id)
  }

  /**
   * Get all applications for an advisor
   */
  async getAdvisorApplications(advisorId: string) {
    return this.applications.where('advisorId').equals(advisorId).toArray()
  }

  /**
   * Get pending applications (not yet synced)
   */
  async getPendingApplications() {
    return this.applications
      .where('syncStatus')
      .anyOf(['draft', 'pending_sync', 'error'])
      .toArray()
  }

  /**
   * Queue an operation for sync
   */
  async queueOperation(
    operation: 'create' | 'update' | 'delete',
    entityType: 'application' | 'client' | 'analysis',
    entityId: string,
    data: Record<string, any>
  ) {
    return this.syncQueue.add({
      operation,
      entityType,
      entityId,
      data,
      createdAt: Date.now(),
      status: 'pending' as const,
      retryCount: 0,
    })
  }

  /**
   * Get pending sync operations
   */
  async getPendingSyncOperations() {
    return this.syncQueue.where('status').equals('pending').toArray()
  }

  /**
   * Get sync queue items with error
   */
  async getFailedSyncOperations() {
    return this.syncQueue.where('status').equals('error').toArray()
  }

  /**
   * Mark sync operation as synced
   */
  async markOperationSynced(id: string) {
    await this.syncQueue.update(id, {
      status: 'synced' as const,
    })
  }

  /**
   * Mark sync operation as failed and increment retry count
   */
  async markOperationFailed(id: string, error: string) {
    const item = await this.syncQueue.get(id)
    if (item) {
      await this.syncQueue.update(id, {
        status: 'error' as const,
        retryCount: item.retryCount + 1,
        lastRetryAt: Date.now(),
        error,
      })
    }
  }

  /**
   * Clear sync queue (after successful bulk sync)
   */
  async clearSyncedOperations() {
    await this.syncQueue.where('status').equals('synced').delete()
  }

  /**
   * Get all data for export/debugging
   */
  async exportAllData() {
    const applications = await this.applications.toArray()
    const syncQueue = await this.syncQueue.toArray()
    const syncMetadata = await this.syncMetadata.toArray()

    return {
      applications,
      syncQueue,
      syncMetadata,
      exportedAt: new Date().toISOString(),
    }
  }

  /**
   * Clear all offline data (destructive - use with caution)
   */
  async clearAllData() {
    await this.applications.clear()
    await this.syncQueue.clear()
  }
}

/**
 * Export singleton instance
 */
export const db = new CreditCopilotDB()
