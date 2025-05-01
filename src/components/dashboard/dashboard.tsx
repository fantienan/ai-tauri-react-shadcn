import type { DBMessage } from '@/types'
import type { BizResult } from '@/types'
import { fetcher } from '@/utils'
import { Loader2 } from 'lucide-react'
import useSWR from 'swr'

export interface DashboardProps {
  chatId: string
  messageId: string
}

export const Dashboard = ({ chatId, messageId }: DashboardProps) => {
  const { data, isLoading } = useSWR(
    () => (chatId && messageId ? `/llm/dashboard/insert` : null),
    async (input: string, init?: RequestInit) => {
      return fetcher<BizResult<DBMessage[]>>(input, {
        ...init,
        method: 'POST',
        body: JSON.stringify({ chatId, messageId }),
      }).then((res) => res.data)
    },
  )

  if (isLoading) return <Loader2 size="16" className="animate-spin" />
  console.log('data', data)
  return <div></div>
}
