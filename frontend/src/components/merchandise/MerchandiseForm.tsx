import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Merchandise, MerchandiseInput } from '../../db/queries/merchandise'

interface Props {
  initial?: Merchandise | null
  onSubmit: (data: MerchandiseInput) => void
  onCancel: () => void
}

const empty: MerchandiseInput = { name: '', cost: 0, price: 0, statement: '', launched: 0, is_disable: 0, stock: 0, start_of_sale: '', end_of_sale: '' }

export default function MerchandiseForm({ initial, onSubmit, onCancel }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<MerchandiseInput>(empty)

  useEffect(() => {
    if (initial) {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = initial
      setForm(rest)
    } else setForm(empty)
  }, [initial])

  const setStr = (k: keyof MerchandiseInput, v: string) => setForm((f) => ({ ...f, [k]: v } as MerchandiseInput))
  const setNum = (k: keyof MerchandiseInput, v: number) => setForm((f) => ({ ...f, [k]: v } as MerchandiseInput))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelName')} *</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.name} onChange={(e) => setStr('name', e.target.value)} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelCost')}</label>
          <input type="number" min={0} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.cost} onChange={(e) => setNum('cost', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelPrice')}</label>
          <input type="number" min={0} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.price} onChange={(e) => setNum('price', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelStock')}</label>
          <input type="number" min={0} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.stock} onChange={(e) => setNum('stock', Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelStatement')}</label>
        <textarea rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.statement} onChange={(e) => setStr('statement', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelStartOfSale')} *</label>
          <input type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.start_of_sale} onChange={(e) => setStr('start_of_sale', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('merchandise.labelEndOfSale')} *</label>
          <input type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.end_of_sale} onChange={(e) => setStr('end_of_sale', e.target.value)} required />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.launched === 1} onChange={(e) => setNum('launched', e.target.checked ? 1 : 0)} />
          {t('merchandise.labelLaunched')}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_disable === 1} onChange={(e) => setNum('is_disable', e.target.checked ? 1 : 0)} />
          {t('merchandise.labelDisable')}
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">{t('common.save')}</button>
      </div>
    </form>
  )
}
