import { getTable, dbFindAll } from '../init'
import type { Row, SortOption } from '../init'

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'stock_adjust'

export interface AuditLog extends Row {
  user_id: number
  username: string
  action: AuditAction
  resource: string
  resource_id: number | null
  detail: string
}

const TABLE = 'audit_log'

export function writeLog(entry: Omit<AuditLog, 'id' | 'created_at' | 'updated_at'>) {
  const rows = getTable<AuditLog>(TABLE)
  const id = (rows[rows.length - 1]?.id ?? 0) + 1
  const now = new Date().toISOString()
  const row: AuditLog = { ...entry, id, created_at: now, updated_at: now }
  // Keep last 500 entries
  const updated = [...rows, row].slice(-500)
  localStorage.setItem(TABLE, JSON.stringify(updated))
}

export const findAllLogs = (page = 1, sort: SortOption = { key: 'id', dir: 'desc' }) =>
  dbFindAll<AuditLog>(TABLE, page, sort)

export const countLogs = () => getTable<AuditLog>(TABLE).length
