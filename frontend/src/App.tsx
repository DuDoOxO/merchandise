import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { Permission } from './db/queries/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CatalogPage from './pages/CatalogPage'
import MerchandisePage from './pages/MerchandisePage'
import LinkPage from './pages/LinkPage'
import UsersPage from './pages/UsersPage'
import RolesPage from './pages/RolesPage'

const qc = new QueryClient()

function RequireAuth({ perm }: { perm?: Permission }) {
  const { user, can } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (perm && !can(perm)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter basename="/merchandise">
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route element={<RequireAuth perm="catalog:read" />}>
                  <Route path="catalog" element={<CatalogPage />} />
                </Route>
                <Route element={<RequireAuth perm="merchandise:read" />}>
                  <Route path="merchandise" element={<MerchandisePage />} />
                </Route>
                <Route element={<RequireAuth perm="link:read" />}>
                  <Route path="link" element={<LinkPage />} />
                </Route>
                <Route element={<RequireAuth perm="user:read" />}>
                  <Route path="users" element={<UsersPage />} />
                </Route>
                <Route element={<RequireAuth perm="role:read" />}>
                  <Route path="roles" element={<RolesPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
