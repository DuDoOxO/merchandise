import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../db/queries/auth'

export default function ProfilePage() {
  const { user } = useAuth()
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user.password !== oldPwd) { setMsg({ ok: false, text: '舊密碼不正確' }); return }
    if (newPwd.length < 4) { setMsg({ ok: false, text: '新密碼至少 4 個字元' }); return }
    if (newPwd !== confirm) { setMsg({ ok: false, text: '兩次密碼不一致' }); return }
    updateUser(user.id, { password: newPwd })
    setMsg({ ok: true, text: '密碼已更新' })
    setOldPwd(''); setNewPwd(''); setConfirm('')
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">個人資料</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-2xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">修改密碼</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: '舊密碼', value: oldPwd, set: setOldPwd },
            { label: '新密碼', value: newPwd, set: setNewPwd },
            { label: '確認新密碼', value: confirm, set: setConfirm },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {msg && (
            <p className={`text-sm ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>
          )}
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            更新密碼
          </button>
        </form>
      </div>
    </div>
  )
}
