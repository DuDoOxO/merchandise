import { dbInsert, dbUpdate, dbDelete, dbFindAll, dbFindById, dbSearch, dbCount } from '../init'
import type { Row, SortOption } from '../init'

export interface Catalog extends Row {
  name: string
  hidden: number
  prev_id: number
  is_root: number
  is_disable: number
}

const TABLE = 'merchandise_catalog'

export const findAllCatalogs = (page = 1, keyword = '', sort: SortOption = { key: 'id', dir: 'desc' }) =>
  keyword
    ? dbSearch<Catalog>(TABLE, page, (c) => c.name.toLowerCase().includes(keyword.toLowerCase()), sort)
    : dbFindAll<Catalog>(TABLE, page, sort)

export const countCatalogs = () => dbCount<Catalog>(TABLE)
export const getCatalog = (id: number) => dbFindById<Catalog>(TABLE, id)
export const addCatalog = (name: string) => dbInsert<Catalog>(TABLE, { name, hidden: 0, prev_id: 0, is_root: 0, is_disable: 0 })
export const updateCatalog = (id: number, data: { name: string; hidden: number; prev_id: number; is_root: number }) =>
  dbUpdate<Catalog>(TABLE, id, data)
export const deleteCatalog = (id: number) => dbDelete(TABLE, id)
