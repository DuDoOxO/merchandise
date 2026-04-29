import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTable } from '../db/init'
import type { Merchandise } from '../db/queries/merchandise'
import type { Catalog } from '../db/queries/catalog'
import type { User } from '../db/queries/auth'

interface Result { type: string; label: string; sub: string; path: string }

function search(q: string): Result[] {
  if (!q.trim()) return []
  const kw = q.toLowerCase()
  const results: Result[] = []

  getTable<Merchandise>('merchandise')
    .filter((m) => m.name.toLowerCase().includes(kw))
    .slice(0, 5)
    .forEach((m) => results.push({ type: '商品', label: m.name, sub: `$${m.price} · 庫存 ${m.stock ?? 0}`, path: '/merchandise' }))

  getTable<Catalog>('merchandise_catalog')
    .filter((c) => c.name.toLowerCase().includes(kw))
    .slice(0, 5)
    .forEach((c) => results.push({ type: '目錄', label: c.name, sub: `ID ${c.id}`, path: '/catalog' }))

  getTable<User>('users')
    .filter((u) => u.username.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw))
    .slice(0, 3)
    .forEach((u) => results.push({ type: '會員', label: u.username, sub: u.email, path: '/users' }))

  return results
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = search(q)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen((o) => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 50) } }, [open])

  const select = (r: Result) => { navigate(r.path); setOpen(false) }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') setIdx((i) => Math.min(i + 1, results.length - 1))
    else if (e.key === 'ArrowUp') setIdx((i) => Math.max(i - 1, 0))
    else if (e.key === 'Enter' && results[idx]) select(results[idx])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50" onClick={() => setOpen(false)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-400">🔍</span>
          <input
            ref={inputRef}
            className="flex-1 py-4 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
            placeholder="搜尋商品、目錄、會員..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0) }}
            onKeyDown={handleKey}
          />
          <kbd className="text-xs text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-auto">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-center text-gray-400">{q ? '找不到結果' : '輸入關鍵字開始搜尋'}</p>
          ) : results.map((r, i) => (
            <div key={i} onClick={() => select(r)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${i === idx ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">{r.type}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{r.label}</p>
                <p className="text-xs text-gray-400 truncate">{r.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
