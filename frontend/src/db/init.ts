// Simple localStorage-based persistence

function load<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : def
  } catch {
    return def
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function nextId(table: string): number {
  const seq = load<Record<string, number>>('__seq__', {})
  seq[table] = (seq[table] ?? 0) + 1
  save('__seq__', seq)
  return seq[table]
}

function now(): string {
  return new Date().toISOString()
}

export interface Row {
  id: number
  created_at: string
  updated_at: string
}

export function getTable<T extends Row>(name: string): T[] {
  return load<T[]>(name, [])
}

function setTable<T extends Row>(name: string, rows: T[]): void {
  save(name, rows)
}

export async function dbInsert<T extends Row>(table: string, data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
  const rows = getTable<T>(table)
  const row = { ...data, id: nextId(table), created_at: now(), updated_at: now() } as T
  setTable(table, [...rows, row])
  return row
}

export async function dbUpdate<T extends Row>(table: string, id: number, data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  const rows = getTable<T>(table)
  setTable(table, rows.map((r) => r.id === id ? { ...r, ...data, updated_at: now() } : r))
}

export async function dbBatchUpdate<T extends Row>(table: string, ids: number[], data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  const rows = getTable<T>(table)
  const set = new Set(ids)
  setTable(table, rows.map((r) => set.has(r.id) ? { ...r, ...data, updated_at: now() } : r))
}

export async function dbBatchDelete(table: string, ids: number[]): Promise<void> {
  const set = new Set(ids)
  const rows = getTable<Row>(table)
  setTable(table, rows.filter((r) => !set.has(r.id)))
}

export async function dbDelete(table: string, id: number): Promise<void> {
  const rows = getTable<Row>(table)
  setTable(table, rows.filter((r) => r.id !== id))
}

export function dbFindAll<T extends Row>(table: string, page: number): T[] {
  const rows = getTable<T>(table)
  const sorted = [...rows].sort((a, b) => b.id - a.id)
  return sorted.slice((page - 1) * 20, page * 20)
}

export function dbFindById<T extends Row>(table: string, id: number): T | null {
  return getTable<T>(table).find((r) => r.id === id) ?? null
}

export function dbSearch<T extends Row>(
  table: string,
  page: number,
  predicate: (row: T) => boolean,
): T[] {
  const rows = getTable<T>(table)
  const sorted = [...rows].sort((a, b) => b.id - a.id).filter(predicate)
  return sorted.slice((page - 1) * 20, page * 20)
}

export function dbCount<T extends Row>(table: string, predicate?: (row: T) => boolean): number {
  const rows = getTable<T>(table)
  return predicate ? rows.filter(predicate).length : rows.length
}
