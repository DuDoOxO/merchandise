import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  findAllMerchandise, addMerchandise, updateMerchandise, deleteMerchandise,
  adjustStock, batchLaunch, batchDelete, getAllMerchandise,
} from '../db/queries/merchandise'
import type { Merchandise, MerchandiseInput, MerchandiseFilter } from '../db/queries/merchandise'
import type { SortOption } from '../db/init'
import Modal from '../components/Modal'
import MerchandiseForm from '../components/merchandise/MerchandiseForm'
import SortableHeader from '../components/SortableHeader'

function exportCsv(rows: Merchandise[], t: (k: string) => string) {
  const headers = ['ID', t('merchandise.labelName'), t('merchandise.labelCost'), t('merchandise.labelPrice'), t('merchandise.labelStock'), t('merchandise.launched'), t('merchandise.labelStartOfSale'), t('merchandise.labelEndOfSale'), t('common.createdAt')]
  const lines = rows.map((m) =>
    [m.id, m.name, m.cost, m.price, m.stock ?? 0, m.launched ? t('common.yes') : t('common.no'), m.start_of_sale, m.end_of_sale, m.created_at].join(',')
  )
  const blob = new Blob(['﻿' + [headers.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `merchandise_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
}

export default function MerchandisePage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'add' | 'edit' | 'stock' | null>(null)
  const [editing, setEditing] = useState<Merchandise | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<MerchandiseFilter>({})
  const [sort, setSort] = useState<SortOption>({ key: 'id', dir: 'desc' })
  const [stockDelta, setStockDelta] = useState(0)

  const qKey = ['merchandise', page, filter, sort]
  const { data = [] } = useQuery({ queryKey: qKey, queryFn: () => findAllMerchandise(page, filter, sort) })

  const invalidate = () => { qc.invalidateQueries({ queryKey: ['merchandise'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }
  const addMut = useMutation({ mutationFn: (d: MerchandiseInput) => addMerchandise(d), onSuccess: () => { invalidate(); setModal(null) } })
  const updMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: MerchandiseInput }) => updateMerchandise(id, data), onSuccess: () => { invalidate(); setModal(null) } })
  const delMut = useMutation({ mutationFn: deleteMerchandise, onSuccess: invalidate })
  const stockMut = useMutation({ mutationFn: ({ id, delta }: { id: number; delta: number }) => adjustStock(id, delta), onSuccess: () => { invalidate(); setModal(null) } })
  const batchLaunchMut = useMutation({ mutationFn: ({ ids, v }: { ids: number[]; v: number }) => batchLaunch(ids, v), onSuccess: () => { invalidate(); setSelected(new Set()) } })
  const batchDelMut = useMutation({ mutationFn: batchDelete, onSuccess: () => { invalidate(); setSelected(new Set()) } })

  const allIds = data.map((m) => m.id)
  const allChecked = allIds.length > 0 && allIds.every((id) => selected.has(id))
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(allIds))
  const toggleOne = (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const selectedArr = [...selected]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t('merchandise.title')}</h1>
        <div className="flex gap-2">
          <button onClick={() => exportCsv(getAllMerchandise(), t)} className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
            {t('merchandise.exportCsv')}
          </button>
          <button onClick={() => { setEditing(null); setModal('add') }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            {t('merchandise.addMerchandise')}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('common.search')}</label>
          <input className="border border-gray-300 rounded px-2 py-1.5 text-sm w-40"
            placeholder={t('merchandise.searchPlaceholder')} value={filter.keyword ?? ''}
            onChange={(e) => { setPage(1); setFilter((f) => ({ ...f, keyword: e.target.value || undefined })) }} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('merchandise.filterStatus')}</label>
          <select className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            value={filter.launched ?? ''} onChange={(e) => { setPage(1); setFilter((f) => ({ ...f, launched: e.target.value === '' ? null : Number(e.target.value) })) }}>
            <option value="">{t('merchandise.filterAll')}</option>
            <option value="1">{t('merchandise.filterLaunched')}</option>
            <option value="0">{t('merchandise.filterUnlaunched')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('merchandise.priceRange')}</label>
          <div className="flex gap-1 items-center">
            <input type="number" min={0} placeholder={t('merchandise.priceLow')} className="border border-gray-300 rounded px-2 py-1.5 text-sm w-20"
              value={filter.minPrice ?? ''} onChange={(e) => { setPage(1); setFilter((f) => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : null })) }} />
            <span className="text-gray-400 text-sm">~</span>
            <input type="number" min={0} placeholder={t('merchandise.priceHigh')} className="border border-gray-300 rounded px-2 py-1.5 text-sm w-20"
              value={filter.maxPrice ?? ''} onChange={(e) => { setPage(1); setFilter((f) => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : null })) }} />
          </div>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 mb-0.5">
          <input type="checkbox" checked={!!filter.lowStock} onChange={(e) => { setPage(1); setFilter((f) => ({ ...f, lowStock: e.target.checked || undefined })) }} />
          {t('merchandise.lowStockFilter')}
        </label>
        <button onClick={() => { setPage(1); setFilter({}) }} className="text-xs text-gray-400 hover:text-gray-600 mb-0.5">{t('merchandise.clearFilter')}</button>
      </div>

      {/* Batch actions */}
      {selectedArr.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-3 text-sm">
          <span className="text-blue-700 font-medium">{t('merchandise.selectedCount', { count: selectedArr.length })}</span>
          <button onClick={() => batchLaunchMut.mutate({ ids: selectedArr, v: 1 })} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">{t('merchandise.batchLaunch')}</button>
          <button onClick={() => batchLaunchMut.mutate({ ids: selectedArr, v: 0 })} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">{t('merchandise.batchUnlaunch')}</button>
          <button onClick={() => { if (confirm(t('common.confirmDeleteCount', { count: selectedArr.length }))) batchDelMut.mutate(selectedArr) }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">{t('merchandise.batchDelete')}</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-gray-400 hover:text-gray-600">{t('merchandise.cancelSelect')}</button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-8"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              {[
                { label: t('common.id'), key: 'id' },
                { label: t('common.name'), key: 'name' },
                { label: t('merchandise.cost'), key: 'cost' },
                { label: t('merchandise.price'), key: 'price' },
                { label: t('merchandise.stock'), key: 'stock' },
                { label: t('merchandise.launched'), key: 'launched' },
                { label: t('merchandise.salePeriod'), key: 'start_of_sale' },
              ].map(({ label, key }) => (
                <SortableHeader key={key} label={label} sortKey={key} sort={sort} onSort={(s) => { setSort(s); setPage(1) }} />
              ))}
              <th className="px-4 py-3 text-left font-medium text-gray-600">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">{t('common.noData')}</td></tr>
            ) : data.map((m) => (
              <tr key={m.id} className={`hover:bg-gray-50 ${selected.has(m.id) ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleOne(m.id)} /></td>
                <td className="px-4 py-3 text-gray-500">{m.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">${m.cost}</td>
                <td className="px-4 py-3 text-gray-600">${m.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${(m.stock ?? 0) === 0 ? 'text-red-500' : (m.stock ?? 0) <= 10 ? 'text-orange-500' : 'text-gray-700'}`}>{m.stock ?? 0}</span>
                  <button onClick={() => { setEditing(m); setStockDelta(0); setModal('stock') }} className="ml-2 text-xs text-blue-500 hover:underline">{t('merchandise.adjustStock')}</button>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${m.launched ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {m.launched ? t('merchandise.launched') : t('merchandise.notLaunched')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{m.start_of_sale?.slice(0, 10)} ~ {m.end_of_sale?.slice(0, 10)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => { setEditing(m); setModal('edit') }} className="text-blue-600 hover:underline mr-3 text-xs">{t('common.edit')}</button>
                  <button onClick={() => { if (confirm(t('common.confirmDelete', { name: m.name }))) delMut.mutate(m.id) }} className="text-red-500 hover:underline text-xs">{t('common.delete')}</button>
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

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t('merchandise.addTitle') : t('merchandise.editTitle')} onClose={() => setModal(null)}>
          <MerchandiseForm
            initial={modal === 'edit' ? editing : null}
            onSubmit={(d) => modal === 'add' ? addMut.mutate(d) : updMut.mutate({ id: editing!.id, data: d })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === 'stock' && editing && (
        <Modal title={t('merchandise.adjustTitle', { name: editing.name })} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t('merchandise.currentStock')}<span className="font-bold text-gray-800">{editing.stock ?? 0}</span></p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.adjustDelta')}</label>
              <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={stockDelta} onChange={(e) => setStockDelta(Number(e.target.value))} />
              {stockDelta !== 0 && <p className="text-xs text-gray-400 mt-1">{t('merchandise.afterAdjust', { val: Math.max(0, (editing.stock ?? 0) + stockDelta) })}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
              <button onClick={() => stockMut.mutate({ id: editing.id, delta: stockDelta })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('merchandise.confirmAdjust')}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
