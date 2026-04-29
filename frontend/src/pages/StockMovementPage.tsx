import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { findAllMovements } from '../db/queries/stockMovement'
import type { SortOption } from '../db/init'
import SortableHeader from '../components/SortableHeader'

const TYPE_STYLE = { in: 'bg-green-100 text-green-700', out: 'bg-red-100 text-red-600', adjust: 'bg-blue-100 text-blue-700' }
const TYPE_LABEL = { in: '入庫', out: '出庫', adjust: '調整' }

export default function StockMovementPage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortOption>({ key: 'id', dir: 'desc' })

  const { data = [] } = useQuery({
    queryKey: ['stock_movement', page, sort],
    queryFn: () => findAllMovements(page, undefined, sort),
  })

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">入出庫紀錄</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {[
                { label: 'ID', key: 'id' },
                { label: '商品', key: 'merchandise_name' },
                { label: '類型', key: 'type' },
                { label: '數量', key: 'quantity' },
                { label: '調整前', key: 'before' },
                { label: '調整後', key: 'after' },
                { label: '操作者', key: 'operator' },
                { label: '備註', key: 'note' },
                { label: '時間', key: 'created_at' },
              ].map(({ label, key }) => (
                <SortableHeader key={key} label={label} sortKey={key} sort={sort} onSort={(s) => { setSort(s); setPage(1) }} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">尚無紀錄，調整庫存後自動記錄</td></tr>
            ) : data.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-2.5 text-gray-400 text-xs">{m.id}</td>
                <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">{m.merchandise_name}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${TYPE_STYLE[m.type]}`}>{TYPE_LABEL[m.type]}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`font-medium ${m.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-gray-500">{m.before}</td>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium">{m.after}</td>
                <td className="px-4 py-2.5 text-gray-500">{m.operator}</td>
                <td className="px-4 py-2.5 text-gray-400 max-w-xs truncate">{m.note || '-'}</td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">{m.created_at?.slice(0, 19).replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">上一頁</button>
        <span className="px-3 py-1 text-sm text-gray-600">第 {page} 頁</span>
        <button disabled={data.length < 20} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">下一頁</button>
      </div>
    </div>
  )
}
