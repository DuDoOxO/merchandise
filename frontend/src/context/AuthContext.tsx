import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { findUserByUsername, getUserRole, getRolePermissions, hasPermission } from '../db/queries/auth'
import type { User, Permission } from '../db/queries/auth'
import { writeLog } from '../db/queries/auditLog'

const SESSION_KEY = 'current_user_id'

interface AuthCtx {
  user: User | null
  permissions: Permission[]
  login: (username: string, password: string) => boolean
  logout: () => void
  can: (p: Permission) => boolean
}

const Ctx = createContext<AuthCtx>({
  user: null, permissions: [], login: () => false, logout: () => {}, can: () => false,
})

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession)

  const permissions: Permission[] = user ? (() => {
    const role = getUserRole(user)
    return role ? getRolePermissions(role) : []
  })() : []

  const login = (username: string, password: string): boolean => {
    const u = findUserByUsername(username)
    if (!u || u.password !== password || u.status === 0) return false
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setUser(u)
    writeLog({ user_id: u.id, username: u.username, action: 'login', resource: 'auth', resource_id: null, detail: '登入系統' })
    return true
  }

  const logout = () => {
    if (user) writeLog({ user_id: user.id, username: user.username, action: 'logout', resource: 'auth', resource_id: null, detail: '登出系統' })
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const can = (p: Permission) => user ? hasPermission(user, p) : false

  useEffect(() => {
    if (!user) return
    const stored = loadSession()
    if (stored && stored.id === user.id) setUser(stored)
  }, [])

  return <Ctx.Provider value={{ user, permissions, login, logout, can }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
