import { useAuth } from '../context/AuthContext'
import { writeLog } from '../db/queries/auditLog'
import type { AuditAction } from '../db/queries/auditLog'

export function useAudit() {
  const { user } = useAuth()
  return (action: AuditAction, resource: string, resourceId: number | null, detail: string) => {
    if (!user) return
    writeLog({ user_id: user.id, username: user.username, action, resource, resource_id: resourceId, detail })
  }
}
