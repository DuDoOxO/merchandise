import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { findAllUsers, addUser, updateUser, deleteUser, getAllRoles } from '../db/queries/auth'
import type { User, UserInput } from '../db/queries/auth'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

function UserForm({ initial, onSubmit, onCancel }: { initial?: User | null; onSubmit: (d: UserInput) => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const roles = getAllRoles()
  const [form, setForm] = useState<UserInput>({
    username: initial?.username ?? '',
    email: initial?.email ?? '',
    password: initial?.password ?? '',
    role_id: initial?.role_id ?? (roles[0]?.id ?? 1),
    status: initial?.status ?? 1,
  })
  const set = (k: keyof UserInput, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.labelUsername')} *</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.username} onChange={(e) => set('username', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.labelEmail')}</label>
          <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{initial ? t('users.labelPasswordOptional') : `${t('users.labelPassword')} *`}</label>
        <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password} onChange={(e) => set('password', e.target.value)} required={!initial} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.labelRole')}</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.role_id} onChange={(e) => set('role_id', Number(e.target.value))}>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.labelStatus')}</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.status} onChange={(e) => set('status', Number(e.target.value))}>
            <option value={1}>{t('common.enabled')}</option>
            <option value={0}>{t('common.disabled')}</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('common.save')}</button>
      </div>
    </form>
  )
}

const ROLE_COLOR: Record<string, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Manager: 'bg-blue-100 text-blue-700',
  Viewer: 'bg-gray-100 text-gray-600',
}

export default function UsersPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<User | null>(null)

  const { data: users = [] } = useQuery({ queryKey: ['users', page], queryFn: () => findAllUsers(page) })
  const roles = getAllRoles()
  const roleMap = Object.fromEntries(roles.map((r) => [r.id, r]))

  const invalidate = () => qc.invalidateQueries({ queryKey: ['users'] })
  const addMut = useMutation({ mutationFn: addUser, onSuccess: () => { invalidate(); setModal(null) } })
  const updMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserInput }) =>
      updateUser(id, data.password ? data : { ...data, password: editing!.password }),
    onSuccess: () => { invalidate(); setModal(null) },
  })
  const delMut = useMutation({ mutationFn: deleteUser, onSuccess: invalidate })
  const canWrite = can('user:write')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t('users.title')}</h1>
        {canWrite && (
          <button onClick={() => { setEditing(null); setModal('add') }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            {t('users.addUser')}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[t('common.id'), t('users.labelUsername'), t('users.email'), t('users.role'), t('common.status'), t('common.createdAt'), t('common.actions')].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t('common.noData')}</td></tr>
            ) : users.map((u) => {
              const role = roleMap[u.role_id]
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{u.username}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email || '-'}</td>
                  <td className="px-4 py-3">
                    {role && <span className={`px-2 py-0.5 rounded-full text-xs ${ROLE_COLOR[role.name] ?? 'bg-gray-100 text-gray-600'}`}>{role.name}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                      {u.status ? t('common.enabled') : t('common.disabled')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    {canWrite && <>
                      <button onClick={() => { setEditing(u); setModal('edit') }} className="text-blue-600 hover:underline mr-3 text-xs">{t('common.edit')}</button>
                      <button onClick={() => { if (confirm(t('common.confirmDelete', { name: u.username }))) delMut.mutate(u.id) }} className="text-red-500 hover:underline text-xs">{t('common.delete')}</button>
                    </>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">{t('common.prevPage')}</button>
        <span className="px-3 py-1 text-sm text-gray-600">{t('common.page', { n: page })}</span>
        <button disabled={users.length < 20} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">{t('common.nextPage')}</button>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t('users.addTitle') : t('users.editTitle')} onClose={() => setModal(null)}>
          <UserForm
            initial={modal === 'edit' ? editing : null}
            onSubmit={(d) => modal === 'add' ? addMut.mutate(d) : updMut.mutate({ id: editing!.id, data: d })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
