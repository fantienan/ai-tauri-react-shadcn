import type { DashboardRecord } from '@/types'
import { fetcher } from '@/utils'
import { Loader2 } from 'lucide-react'
import useSWR from 'swr'

export interface DashboardProps {
  chatId: string
  messageId: string
}

export const Dashboard = ({ chatId, messageId }: DashboardProps) => {
  const { data, isLoading } = useSWR(
    () => (chatId && messageId ? `/llm/dashboard/try` : null),
    async (input: string, init?: RequestInit) => {
      return fetcher<DashboardRecord>(input, {
        ...init,
        method: 'POST',
        body: JSON.stringify({ chatId, messageId }),
      }).then((res) => {
        if (typeof res.data?.data === 'string') res.data.data = JSON.parse(res.data.data as any)
        return res.data
      })
    },
  )

  if (isLoading) return <Loader2 size="16" className="animate-spin" />
  console.log('data', data)
  return <div></div>
}
