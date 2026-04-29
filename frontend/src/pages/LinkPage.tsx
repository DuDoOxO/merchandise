import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { findAllLinks, addLink, deleteLink } from '../db/queries/link'
import type { LinkInput } from '../db/queries/link'
import { findAllCatalogs } from '../db/queries/catalog'
import { findAllMerchandise } from '../db/queries/merchandise'
import Modal from '../components/Modal'

function LinkForm({ onSubmit, onCancel }: { onSubmit: (d: LinkInput) => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const { data: catalogs = [] } = useQuery({ queryKey: ['catalog', 1], queryFn: () => findAllCatalogs(1) })
  const { data: merch = [] } = useQuery({ queryKey: ['merchandise', 1], queryFn: () => findAllMerchandise(1) })
  const [layerRoot, setLayerRoot] = useState(0)
  const [layerA, setLayerA] = useState(0)
  const [merchandiseId, setMerchandiseId] = useState(0)
  const [hidden, setHidden] = useState(0)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ layer_root: layerRoot, layer_a: layerA, layer_b: 0, layer_c: 0, layer_d: 0, merchandise_id: merchandiseId, hidden }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('link.labelRoot')} *</label>
        <select required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={layerRoot} onChange={(e) => setLayerRoot(Number(e.target.value))}>
          <option value={0}>{t('link.placeholderSelect')}</option>
          {catalogs.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('link.labelLayerA')}</label>
        <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={layerA} onChange={(e) => setLayerA(Number(e.target.value))}>
          <option value={0}>{t('link.placeholderNone')}</option>
          {catalogs.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('link.labelMerchandise')} *</label>
        <select required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={merchandiseId} onChange={(e) => setMerchandiseId(Number(e.target.value))}>
          <option value={0}>{t('link.placeholderSelect')}</option>
          {merch.map((m) => <option key={m.id} value={m.id}>{m.id} - {m.name}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={hidden === 1} onChange={(e) => setHidden(e.target.checked ? 1 : 0)} />
        {t('link.labelHidden')}
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('link.createLink')}</button>
      </div>
    </form>
  )
}

export default function LinkPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  const { data = [] } = useQuery({ queryKey: ['link', page], queryFn: () => findAllLinks(page) })
  const addMut = useMutation({ mutationFn: addLink, onSuccess: () => { qc.invalidateQueries({ queryKey: ['link'] }); setShowModal(false) } })
  const delMut = useMutation({ mutationFn: deleteLink, onSuccess: () => qc.invalidateQueries({ queryKey: ['link'] }) })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t('link.title')}</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">{t('link.addLink')}</button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[t('common.id'), t('link.rootCatalog'), t('link.layerA'), t('link.product'), t('common.status'), t('common.createdAt'), t('common.actions')].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t('common.noData')}</td></tr>
            ) : data.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{l.id}</td>
                <td className="px-4 py-3 text-gray-800">{l.catalog_name || l.layer_root || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{l.layer_a || '-'}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{l.merchandise_name || l.merchandise_id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${l.hidden ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {l.hidden ? t('common.hidden') : t('common.show')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{l.created_at}</td>
                <td className="px-4 py-3">
                  <button onClick={() => { if (confirm(t('link.confirmDelete'))) delMut.mutate(l.id) }} className="text-red-500 hover:underline text-xs">{t('common.delete')}</button>
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

      {showModal && (
        <Modal title={t('link.addTitle')} onClose={() => setShowModal(false)}>
          <LinkForm onSubmit={(d) => addMut.mutate(d)} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
