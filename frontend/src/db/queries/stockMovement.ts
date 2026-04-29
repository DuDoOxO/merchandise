import { getTable, dbFindAll, dbSearch } from '../init'
import type { Row, SortOption } from '../init'

export type MovementType = 'in' | 'out' | 'adjust'

export interface StockMovement extends Row {
  merchandise_id: number
  merchandise_name: string
  type: MovementType
  quantity: number
  before: number
  after: number
  note: string
  operator: string
}

const TABLE = 'stock_movement'

export function recordMovement(entry: Omit<StockMovement, 'id' | 'created_at' | 'updated_at'>) {
  const rows = getTable<StockMovement>(TABLE)
  const id = (rows[rows.length - 1]?.id ?? 0) + 1
  const now = new Date().toISOString()
  const row: StockMovement = { ...entry, id, created_at: now, updated_at: now }
  localStorage.setItem(TABLE, JSON.stringify([...rows, row]))
}

export const findAllMovements = (page = 1, merchandiseId?: number, sort: SortOption = { key: 'id', dir: 'desc' }) =>
  merchandiseId
    ? dbSearch<StockMovement>(TABLE, page, (m) => m.merchandise_id === merchandiseId, sort)
    : dbFindAll<StockMovement>(TABLE, page, sort)
