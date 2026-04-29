import { dbInsert, dbUpdate, dbDelete, dbFindAll, dbFindById, dbSearch, dbBatchUpdate, dbBatchDelete, dbCount, getTable } from '../init'
import type { Row, SortOption } from '../init'

export interface Merchandise extends Row {
  name: string
  cost: number
  price: number
  statement: string
  launched: number
  is_disable: number
  stock: number
  start_of_sale: string
  end_of_sale: string
}

export interface MerchandiseInput {
  name: string
  cost: number
  price: number
  statement: string
  launched: number
  is_disable: number
  stock: number
  start_of_sale: string
  end_of_sale: string
}

export interface MerchandiseFilter {
  keyword?: string
  launched?: number | null
  minPrice?: number | null
  maxPrice?: number | null
  lowStock?: boolean
}

const TABLE = 'merchandise'

function makePredicate(f: MerchandiseFilter) {
  return (m: Merchandise) => {
    if (f.keyword && !m.name.toLowerCase().includes(f.keyword.toLowerCase())) return false
    if (f.launched != null && m.launched !== f.launched) return false
    if (f.minPrice != null && m.price < f.minPrice) return false
    if (f.maxPrice != null && m.price > f.maxPrice) return false
    if (f.lowStock && m.stock > 10) return false
    return true
  }
}

export const findAllMerchandise = (page = 1, filter: MerchandiseFilter = {}, sort: SortOption = { key: 'id', dir: 'desc' }) => {
  const hasFilter = Object.values(filter).some((v) => v != null && v !== '')
  return hasFilter
    ? dbSearch<Merchandise>(TABLE, page, makePredicate(filter), sort)
    : dbFindAll<Merchandise>(TABLE, page, sort)
}

export const countMerchandise = (filter?: MerchandiseFilter) =>
  dbCount<Merchandise>(TABLE, filter ? makePredicate(filter) : undefined)

export const getMerchandise = (id: number) => dbFindById<Merchandise>(TABLE, id)
export const addMerchandise = (data: MerchandiseInput) => dbInsert<Merchandise>(TABLE, data)
export const updateMerchandise = (id: number, data: MerchandiseInput) => dbUpdate<Merchandise>(TABLE, id, data)
export const adjustStock = (id: number, delta: number) => {
  const m = dbFindById<Merchandise>(TABLE, id)
  if (!m) return Promise.resolve()
  return dbUpdate<Merchandise>(TABLE, id, { stock: Math.max(0, m.stock + delta) })
}
export const deleteMerchandise = (id: number) => dbDelete(TABLE, id)
export const batchLaunch = (ids: number[], launched: number) => dbBatchUpdate<Merchandise>(TABLE, ids, { launched })
export const batchDelete = (ids: number[]) => dbBatchDelete(TABLE, ids)
export const getAllMerchandise = () => getTable<Merchandise>(TABLE)
