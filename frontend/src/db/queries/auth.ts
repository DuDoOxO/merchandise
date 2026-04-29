import { dbInsert, dbUpdate, dbDelete, dbFindAll, getTable, dbCount } from '../init'
import type { Row } from '../init'

export const ALL_PERMISSIONS = [
  'catalog:read', 'catalog:write',
  'merchandise:read', 'merchandise:write',
  'link:read', 'link:write',
  'user:read', 'user:write',
  'role:read', 'role:write',
] as const

export type Permission = typeof ALL_PERMISSIONS[number]

export interface Role extends Row {
  name: string
  permissions: string // JSON array of Permission
}

export interface RoleInput {
  name: string
  permissions: Permission[]
}

export interface User extends Row {
  username: string
  email: string
  password: string
  role_id: number
  status: number
}

export interface UserInput {
  username: string
  email: string
  password: string
  role_id: number
  status: number
}

// Roles
export const findAllRoles = (page = 1) => dbFindAll<Role>('roles', page)
export const getAllRoles = () => getTable<Role>('roles')
export const countRoles = () => dbCount<Role>('roles')
export const addRole = (data: RoleInput) =>
  dbInsert<Role>('roles', { name: data.name, permissions: JSON.stringify(data.permissions) })
export const updateRole = (id: number, data: RoleInput) =>
  dbUpdate<Role>('roles', id, { name: data.name, permissions: JSON.stringify(data.permissions) })
export const deleteRole = (id: number) => dbDelete('roles', id)
export const getRolePermissions = (role: Role): Permission[] => {
  try { return JSON.parse(role.permissions) as Permission[] } catch { return [] }
}

// Users
export const findAllUsers = (page = 1) => dbFindAll<User>('users', page)
export const countUsers = () => dbCount<User>('users')
export const addUser = (data: UserInput) => dbInsert<User>('users', data)
export const updateUser = (id: number, data: Partial<UserInput>) => dbUpdate<User>('users', id, data)
export const deleteUser = (id: number) => dbDelete('users', id)

export function findUserByUsername(username: string): User | null {
  return getTable<User>('users').find((u) => u.username === username) ?? null
}

export function getUserRole(user: User): Role | null {
  return getTable<Role>('roles').find((r) => r.id === user.role_id) ?? null
}

export function hasPermission(user: User, perm: Permission): boolean {
  const role = getUserRole(user)
  if (!role) return false
  const perms = getRolePermissions(role)
  return perms.includes(perm)
}
