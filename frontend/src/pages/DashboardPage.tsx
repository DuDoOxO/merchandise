import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getTable } from '../db/init'
import type { Merchandise } from '../db/queries/merchandise'
import type { Catalog } from '../db/queries/catalog'

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => {
      const merch = getTable<Merchandise>('merchandise')
      const catalogs = getTable<Catalog>('merchandise_catalog')
      const launched = merch.filter((m) => m.launched === 1)
      const totalStock = merch.reduce((s, m) => s + (m.stock ?? 0), 0)
      const lowStock = merch.filter((m) => (m.stock ?? 0) <= 10 && m.launched === 1)
      const totalValue = merch.reduce((s, m) => s + m.price * (m.stock ?? 0), 0)
      const disabled = merch.filter((m) => m.is_disable === 1)
      const onSaleNow = launched.filter((m) => {
        const now = Date.now()
        return new Date(m.start_of_sale).getTime() <= now && new Date(m.end_of_sale).getTime() >= now
      })
      return { merch, catalogs, launched, totalStock, lowStock, totalValue, disabled, onSaleNow }
    },
  })

  const d = data ?? { merch: [], catalogs: [], launched: [], totalStock: 0, lowStock: [], totalValue: 0, disabled: [], onSaleNow: [] }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-800">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.totalMerchandise')} value={d.merch.length} color="text-gray-800" />
        <StatCard label={t('dashboard.totalCatalogs')} value={d.catalogs.length} color="text-blue-600" />
        <StatCard label={t('dashboard.launched')} value={d.launched.length} sub={t('dashboard.onSale', { count: d.onSaleNow.length })} color="text-green-600" />
        <StatCard label={t('dashboard.totalStock')} value={d.totalStock} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label={t('dashboard.stockValue')} value={`$${d.totalValue.toLocaleString()}`} color="text-indigo-600" />
        <StatCard label={t('dashboard.lowStock')} value={d.lowStock.length} sub={t('dashboard.lowStockSub')} color={d.lowStock.length > 0 ? 'text-red-500' : 'text-gray-400'} />
        <StatCard label={t('dashboard.disabledMerchandise')} value={d.disabled.length} color="text-gray-400" />
      </div>

      {d.lowStock.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-red-500 mb-2">{t('dashboard.lowStockAlert')}</h2>
          <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-50 border-b border-red-100">
                <tr>
                  {[t('dashboard.productName'), t('dashboard.price'), t('dashboard.stock')].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-red-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {d.lowStock.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2 font-medium text-gray-800">{m.name}</td>
                    <td className="px-4 py-2 text-gray-600">${m.price}</td>
                    <td className="px-4 py-2">
                      <span className={`font-bold ${m.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>{m.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
