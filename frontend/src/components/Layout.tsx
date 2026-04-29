import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getAllRoles } from '../db/queries/auth'
import { setLanguage } from '../i18n'
import type { Permission } from '../db/queries/auth'

export default function Layout() {
  const { t, i18n } = useTranslation()
  const { user, can, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const roles = getAllRoles()
  const role = roles.find((r) => r.id === user?.role_id)

  const allNav: { to: string; label: string; perm: Permission | null }[] = [
    { to: '/dashboard', label: `📊 ${t('nav.dashboard')}`, perm: null },
    { to: '/catalog', label: `📁 ${t('nav.catalog')}`, perm: 'catalog:read' },
    { to: '/merchandise', label: `🛍️ ${t('nav.merchandise')}`, perm: 'merchandise:read' },
    { to: '/link', label: `🔗 ${t('nav.link')}`, perm: 'link:read' },
    { to: '/users', label: `👤 ${t('nav.users')}`, perm: 'user:read' },
    { to: '/roles', label: `🔐 ${t('nav.roles')}`, perm: 'role:read' },
    { to: '/stock-movement', label: `📦 ${t('nav.stockMovement')}`, perm: null },
    { to: '/audit-log', label: `📋 ${t('nav.auditLog')}`, perm: null },
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-52 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-base font-bold text-gray-800 dark:text-gray-100">Merchandise</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('nav.system')}</p>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {allNav.map(({ to, label, perm }) => {
            if (perm && !can(perm)) return null
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm mb-1 ${isActive ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                }
              >
                {label}
              </NavLink>
            )
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-80">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
                {user.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{user.username}</p>
                {role && <p className="text-xs text-gray-400">{role.name}</p>}
              </div>
            </NavLink>
            <div className="flex items-center justify-between gap-1">
              <select
                value={i18n.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs text-gray-500 dark:text-gray-400 bg-transparent border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5"
              >
                <option value="zh-TW">繁中</option>
                <option value="en">EN</option>
              </select>
              <button onClick={toggle} className="text-xs px-1.5 py-0.5 border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500">
                {t('nav.logout')}
              </button>
            </div>
            <p className="text-xs text-gray-300 dark:text-gray-600 text-center">⌘K 搜尋</p>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 overflow-auto min-w-0 dark:text-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
