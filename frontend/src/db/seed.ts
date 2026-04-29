import { getTable, dbInsert } from './init'
import type { Role, User } from './queries/auth'
import type { Catalog } from './queries/catalog'
import type { Merchandise } from './queries/merchandise'
import type { Link } from './queries/link'

async function seedRoles() {
  if (getTable<Role>('roles').length > 0) return
  const roles = [
    { name: 'Admin', permissions: JSON.stringify(['catalog:read','catalog:write','merchandise:read','merchandise:write','link:read','link:write','user:read','user:write','role:read','role:write']) },
    { name: 'Manager', permissions: JSON.stringify(['catalog:read','catalog:write','merchandise:read','merchandise:write','link:read','link:write']) },
    { name: 'Viewer', permissions: JSON.stringify(['catalog:read','merchandise:read','link:read']) },
  ]
  for (const r of roles) await dbInsert<Role>('roles', r)
}

async function seedUsers() {
  if (getTable<User>('users').length > 0) return
  const users = [
    { username: 'admin', email: 'admin@example.com', password: 'admin123', role_id: 1, status: 1 },
    { username: 'manager1', email: 'manager@example.com', password: 'manager123', role_id: 2, status: 1 },
    { username: 'viewer1', email: 'viewer@example.com', password: 'viewer123', role_id: 3, status: 1 },
    { username: 'alice', email: 'alice@example.com', password: 'alice123', role_id: 2, status: 1 },
    { username: 'bob', email: 'bob@example.com', password: 'bob123', role_id: 3, status: 0 },
  ]
  for (const u of users) await dbInsert<User>('users', u)
}

async function seedCatalogs() {
  if (getTable<Catalog>('merchandise_catalog').length > 0) return
  const catalogs = [
    { name: '飲料', hidden: 0, prev_id: 0, is_root: 1, is_disable: 0 },
    { name: '食品', hidden: 0, prev_id: 0, is_root: 1, is_disable: 0 },
    { name: '3C產品', hidden: 0, prev_id: 0, is_root: 1, is_disable: 0 },
    { name: '服飾', hidden: 0, prev_id: 0, is_root: 1, is_disable: 0 },
    { name: '碳酸飲料', hidden: 0, prev_id: 1, is_root: 0, is_disable: 0 },
    { name: '果汁', hidden: 0, prev_id: 1, is_root: 0, is_disable: 0 },
    { name: '零食', hidden: 0, prev_id: 2, is_root: 0, is_disable: 0 },
    { name: '手機配件', hidden: 0, prev_id: 3, is_root: 0, is_disable: 0 },
  ]
  for (const c of catalogs) await dbInsert<Catalog>('merchandise_catalog', c)
}

async function seedMerchandise() {
  if (getTable<Merchandise>('merchandise').length > 0) return
  const items = [
    { name: '可口可樂 330ml', cost: 12, price: 25, statement: '經典碳酸飲料', launched: 1, is_disable: 0, stock: 150, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-12-31T23:59' },
    { name: '百事可樂 330ml', cost: 11, price: 25, statement: '百事碳酸飲料', launched: 1, is_disable: 0, stock: 80, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-12-31T23:59' },
    { name: '柳橙汁 500ml', cost: 20, price: 45, statement: '100% 純柳橙汁', launched: 1, is_disable: 0, stock: 60, start_of_sale: '2025-03-01T00:00', end_of_sale: '2025-09-30T23:59' },
    { name: '洋芋片原味', cost: 18, price: 35, statement: '酥脆洋芋片', launched: 1, is_disable: 0, stock: 8, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-12-31T23:59' },
    { name: '黑巧克力 72%', cost: 55, price: 120, statement: '比利時進口黑巧克力', launched: 1, is_disable: 0, stock: 35, start_of_sale: '2025-02-01T00:00', end_of_sale: '2025-11-30T23:59' },
    { name: 'USB-C 充電線 1m', cost: 80, price: 199, statement: '快充傳輸線', launched: 1, is_disable: 0, stock: 200, start_of_sale: '2025-01-01T00:00', end_of_sale: '2026-12-31T23:59' },
    { name: '手機殼 iPhone 15', cost: 120, price: 299, statement: '防摔軍規手機殼', launched: 1, is_disable: 0, stock: 3, start_of_sale: '2025-01-01T00:00', end_of_sale: '2026-06-30T23:59' },
    { name: '棉質T恤 白色 M', cost: 150, price: 390, statement: '純棉透氣T恤', launched: 0, is_disable: 0, stock: 45, start_of_sale: '2025-04-01T00:00', end_of_sale: '2025-08-31T23:59' },
    { name: '運動短褲 黑色', cost: 200, price: 490, statement: '吸濕排汗運動褲', launched: 1, is_disable: 0, stock: 0, start_of_sale: '2025-04-01T00:00', end_of_sale: '2025-09-30T23:59' },
    { name: '礦泉水 600ml', cost: 5, price: 15, statement: '天然礦泉水', launched: 1, is_disable: 0, stock: 500, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-12-31T23:59' },
    { name: '綠茶 500ml', cost: 10, price: 22, statement: '無糖綠茶', launched: 1, is_disable: 0, stock: 120, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-12-31T23:59' },
    { name: '耳機保護套', cost: 60, price: 150, statement: '矽膠耳機保護套', launched: 0, is_disable: 1, stock: 10, start_of_sale: '2025-01-01T00:00', end_of_sale: '2025-06-30T23:59' },
  ]
  for (const m of items) await dbInsert<Merchandise>('merchandise', m)
}

async function seedLinks() {
  if (getTable<Link>('catalog_link_merchandise').length > 0) return
  const links = [
    { layer_root: 1, layer_a: 5, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 1, hidden: 0 },
    { layer_root: 1, layer_a: 5, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 2, hidden: 0 },
    { layer_root: 1, layer_a: 6, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 3, hidden: 0 },
    { layer_root: 1, layer_a: 0, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 10, hidden: 0 },
    { layer_root: 1, layer_a: 0, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 11, hidden: 0 },
    { layer_root: 2, layer_a: 7, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 4, hidden: 0 },
    { layer_root: 2, layer_a: 7, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 5, hidden: 0 },
    { layer_root: 3, layer_a: 8, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 6, hidden: 0 },
    { layer_root: 3, layer_a: 8, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 7, hidden: 0 },
    { layer_root: 3, layer_a: 8, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 12, hidden: 1 },
    { layer_root: 4, layer_a: 0, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 8, hidden: 0 },
    { layer_root: 4, layer_a: 0, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: 9, hidden: 0 },
  ]
  for (const l of links) await dbInsert<Link>('catalog_link_merchandise', l)
}

export async function runSeed() {
  await seedRoles()
  await seedUsers()
  await seedCatalogs()
  await seedMerchandise()
  await seedLinks()
}
