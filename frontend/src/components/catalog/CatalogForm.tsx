import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Catalog } from '../../db/queries/catalog'

interface Props {
  initial?: Catalog | null
  onSubmit: (data: { name: string; hidden: number; prev_id: number; is_root: number }) => void
  onCancel: () => void
}

export default function CatalogForm({ initial, onSubmit, onCancel }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState(initial?.name ?? '')
  const [hidden, setHidden] = useState(initial?.hidden ?? 0)
  const [prevId, setPrevId] = useState(initial?.prev_id ?? 0)
  const [isRoot, setIsRoot] = useState(initial?.is_root ?? 0)

  useEffect(() => {
    if (initial) { setName(initial.name); setHidden(initial.hidden); setPrevId(initial.prev_id); setIsRoot(initial.is_root) }
  }, [initial])

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onSubmit({ name: name.trim(), hidden, prev_id: prevId, is_root: isRoot }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('catalog.labelName')} *</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hidden === 1} onChange={(e) => setHidden(e.target.checked ? 1 : 0)} />
          {t('catalog.labelHidden')}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isRoot === 1} onChange={(e) => setIsRoot(e.target.checked ? 1 : 0)} />
          {t('catalog.labelIsRoot')}
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('catalog.labelPrevId')}</label>
        <input type="number" min={0} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prevId} onChange={(e) => setPrevId(Number(e.target.value))} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('common.save')}</button>
      </div>
    </form>
  )
}
