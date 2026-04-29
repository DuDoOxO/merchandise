import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { findAllLogs } from '../db/queries/auditLog'
import type { AuditLog, AuditAction } from '../db/queries/auditLog'
import type { SortOption } from '../db/init'
import SortableHeader from '../components/SortableHeader'

const ACTION_STYLE: Record<AuditAction, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-600',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-gray-100 text-gray-500',
  stock_adjust: 'bg-yellow-100 text-yellow-700',
}

const ACTION_LABEL: Record<AuditAction, string> = {
  create: '新增', update: '修改', delete: '刪除', login: '登入', logout: '登出', stock_adjust: '庫存調整',
}

export default function AuditLogPage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortOption>({ key: 'id', dir: 'desc' })

  const { data = [] } = useQuery({
    queryKey: ['audit_log', page, sort],
    queryFn: () => findAllLogs(page, sort),
    refetchInterval: 5000,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">操作日誌</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {[
                { label: 'ID', key: 'id' },
                { label: '操作者', key: 'username' },
                { label: '動作', key: 'action' },
                { label: '資源', key: 'resource' },
                { label: '詳情', key: 'detail' },
                { label: '時間', key: 'created_at' },
              ].map(({ label, key }) => (
                <SortableHeader key={key} label={label} sortKey={key} sort={sort} onSort={(s) => { setSort(s); setPage(1) }} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">尚無日誌，操作後自動記錄</td></tr>
            ) : (data as AuditLog[]).map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-2.5 text-gray-400 text-xs">{log.id}</td>
                <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">{log.username}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${ACTION_STYLE[log.action]}`}>
                    {ACTION_LABEL[log.action]}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{log.resource}</td>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300 max-w-xs truncate">{log.detail}</td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">{log.created_at?.slice(0, 19).replace('T', ' ')}</td>
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
