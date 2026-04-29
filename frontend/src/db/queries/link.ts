import { dbInsert, dbDelete, dbFindAll, getTable } from '../init'
import type { Row } from '../init'
import type { Catalog } from './catalog'
import type { Merchandise } from './merchandise'

export interface Link extends Row {
  layer_root: number
  layer_a: number
  layer_b: number
  layer_c: number
  layer_d: number
  merchandise_id: number
  hidden: number
}

export interface LinkView extends Link {
  catalog_name: string
  merchandise_name: string
}

export type LinkInput = Omit<Link, 'id' | 'created_at' | 'updated_at'>

const TABLE = 'catalog_link_merchandise'

export function findAllLinks(page = 1): LinkView[] {
  const links = dbFindAll<Link>(TABLE, page)
  const catalogs = getTable<Catalog>('merchandise_catalog')
  const merch = getTable<Merchandise>('merchandise')
  return links.map((l) => ({
    ...l,
    catalog_name: catalogs.find((c) => c.id === l.layer_root)?.name ?? String(l.layer_root),
    merchandise_name: merch.find((m) => m.id === l.merchandise_id)?.name ?? String(l.merchandise_id),
  }))
}

export const addLink = (data: LinkInput) => dbInsert<Link>(TABLE, data)
export const deleteLink = (id: number) => dbDelete(TABLE, id)
