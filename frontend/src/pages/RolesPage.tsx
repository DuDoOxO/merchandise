import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { findAllRoles, addRole, updateRole, deleteRole, getRolePermissions, ALL_PERMISSIONS } from '../db/queries/auth'
import type { Role, RoleInput, Permission } from '../db/queries/auth'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

function RoleForm({ initial, onSubmit, onCancel }: { initial?: Role | null; onSubmit: (d: RoleInput) => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState(initial?.name ?? '')
  const [perms, setPerms] = useState<Set<Permission>>(new Set(initial ? getRolePermissions(initial) : []))
  const toggle = (p: Permission) => setPerms((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n })
  const groups = ['catalog', 'merchandise', 'link', 'user', 'role'] as const

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, permissions: [...perms] }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('roles.labelName')} *</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('roles.labelPermissions')}</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {groups.map((g) => (
            <div key={g} className="flex items-center border-b last:border-b-0 border-gray-100 px-4 py-2.5 gap-6">
              <span className="text-sm font-medium text-gray-600 w-24 capitalize">{g}</span>
              {(['read', 'write'] as const).map((action) => {
                const p = `${g}:${action}` as Permission
                return (
                  <label key={p} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={perms.has(p)} onChange={() => toggle(p)} />
                    {action === 'read' ? t('roles.permRead') : t('roles.permWrite')}
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('common.save')}</button>
      </div>
    </form>
  )
}

export default function RolesPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { can } = useAuth()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Role | null>(null)

  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => findAllRoles() })
  const invalidate = () => qc.invalidateQueries({ queryKey: ['roles'] })
  const addMut = useMutation({ mutationFn: addRole, onSuccess: () => { invalidate(); setModal(null) } })
  const updMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: RoleInput }) => updateRole(id, data), onSuccess: () => { invalidate(); setModal(null) } })
  const delMut = useMutation({ mutationFn: deleteRole, onSuccess: invalidate })
  const canWrite = can('role:write')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t('roles.title')}</h1>
        {canWrite && (
          <button onClick={() => { setEditing(null); setModal('add') }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            {t('roles.addRole')}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {roles.length === 0 ? <p className="text-sm text-gray-400">{t('common.noData')}</p>
          : roles.map((r) => {
            const perms = getRolePermissions(r)
            return (
              <div key={r.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-semibold text-gray-800">{r.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{t('roles.permCount', { count: perms.length })}</span>
                  </div>
                  {canWrite && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(r); setModal('edit') }} className="text-blue-600 hover:underline text-xs">{t('common.edit')}</button>
                      <button onClick={() => { if (confirm(t('common.confirmDelete', { name: r.name }))) delMut.mutate(r.id) }} className="text-red-500 hover:underline text-xs">{t('common.delete')}</button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_PERMISSIONS.map((p) => (
                    <span key={p} className={`px-2 py-0.5 rounded text-xs ${perms.includes(p) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-300'}`}>
                      {t(`roles.perms.${p}`)}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t('roles.addTitle') : t('roles.editTitle')} onClose={() => setModal(null)}>
          <RoleForm
            initial={modal === 'edit' ? editing : null}
            onSubmit={(d) => modal === 'add' ? addMut.mutate(d) : updMut.mutate({ id: editing!.id, data: d })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
