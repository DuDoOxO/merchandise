import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { findAllCatalogs, addCatalog, updateCatalog, deleteCatalog } from '../db/queries/catalog'
import type { Catalog } from '../db/queries/catalog'
import type { SortOption } from '../db/init'
import Modal from '../components/Modal'
import CatalogForm from '../components/catalog/CatalogForm'
import SortableHeader from '../components/SortableHeader'

export default function CatalogPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState<SortOption>({ key: 'id', dir: 'desc' })
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Catalog | null>(null)

  const { data = [] } = useQuery({ queryKey: ['catalog', page, keyword, sort], queryFn: () => findAllCatalogs(page, keyword, sort) })

  const invalidate = () => { qc.invalidateQueries({ queryKey: ['catalog'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }
  const addMut = useMutation({ mutationFn: (name: string) => addCatalog(name), onSuccess: () => { invalidate(); setModal(null) } })
  const updMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateCatalog>[1] }) => updateCatalog(id, data),
    onSuccess: () => { invalidate(); setModal(null) },
  })
  const delMut = useMutation({ mutationFn: deleteCatalog, onSuccess: invalidate })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t('catalog.title')}</h1>
        <button onClick={() => setModal('add')} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          {t('catalog.addCatalog')}
        </button>
      </div>

      <div className="flex gap-2">
        <input className="border border-gray-300 rounded px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('catalog.searchPlaceholder')} value={keyword}
          onChange={(e) => { setPage(1); setKeyword(e.target.value) }} />
        {keyword && <button onClick={() => setKeyword('')} className="text-xs text-gray-400 hover:text-gray-600">{t('common.clear')}</button>}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                { label: t('common.id'), key: 'id' },
                { label: t('common.name'), key: 'name' },
                { label: t('catalog.hidden'), key: 'hidden' },
                { label: t('catalog.isRoot'), key: 'is_root' },
                { label: t('catalog.prevId'), key: 'prev_id' },
                { label: t('common.createdAt'), key: 'created_at' },
              ].map(({ label, key }) => (
                <SortableHeader key={key} label={label} sortKey={key} sort={sort} onSort={(s) => { setSort(s); setPage(1) }} />
              ))}
              <th className="px-4 py-3 text-left font-medium text-gray-600">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t('common.noData')}</td></tr>
            ) : data.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{c.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.hidden ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {c.hidden ? t('common.hidden') : t('common.show')}
                  </span>
                </td>
                <td className="px-4 py-3">{c.is_root ? '✓' : '-'}</td>
                <td className="px-4 py-3 text-gray-500">{c.prev_id || '-'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => { setEditing(c); setModal('edit') }} className="text-blue-600 hover:underline mr-3 text-xs">{t('common.edit')}</button>
                  <button onClick={() => { if (confirm(t('common.confirmDelete', { name: c.name }))) delMut.mutate(c.id) }} className="text-red-500 hover:underline text-xs">{t('common.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">{t('common.prevPage')}</button>
        <span className="px-3 py-1 text-sm text-gray-600">{t('common.page', { n: page })}</span>
        <button disabled={data.length < 20} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">{t('common.nextPage')}</button>
      </div>

      {modal === 'add' && (
        <Modal title={t('catalog.addTitle')} onClose={() => setModal(null)}>
          <CatalogForm onSubmit={(d) => addMut.mutate(d.name)} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'edit' && editing && (
        <Modal title={t('catalog.editTitle')} onClose={() => setModal(null)}>
          <CatalogForm initial={editing} onSubmit={(d) => updMut.mutate({ id: editing.id, data: d })} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
