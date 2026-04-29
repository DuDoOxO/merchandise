import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getAllRoles } from '../db/queries/auth'
import { setLanguage } from '../i18n'
import type { Permission } from '../db/queries/auth'

export default function Layout() {
  const { t, i18n } = useTranslation()
  const { user, can, logout } = useAuth()
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
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-base font-bold text-gray-800">Merchandise</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('nav.system')}</p>
        </div>

        <nav className="flex-1 p-2">
          {allNav.map(({ to, label, perm }) => {
            if (perm && !can(perm)) return null
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm mb-1 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                {label}
              </NavLink>
            )
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                {user.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{user.username}</p>
                {role && <p className="text-xs text-gray-400">{role.name}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <select
                value={i18n.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs text-gray-500 border border-gray-200 rounded px-1 py-0.5"
              >
                <option value="zh-TW">繁中</option>
                <option value="en">EN</option>
              </select>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500">
                {t('nav.logout')}
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 overflow-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
