import type { AnalyzeResultWithChartSchema, AnalyzeResultWithIndicatorCardSchema, DashboardRecord } from '@/types'
import { fetcher } from '@/utils'
import { Loader2 } from 'lucide-react'
import { memo, useMemo } from 'react'
import useSWR from 'swr'
import { ChartRenderer } from '../chart'
import { IndicatorCards } from '../chart/indicator-card'

export interface DashboardProps {
  chatId: string
  messageId: string
}

export function PureDashboard({ chatId, messageId }: DashboardProps) {
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
  const chartInfo = useMemo(() => {
    if (!data?.data?.charts) return
    return data.data.charts.reduce(
      (prev, curr) => {
        if (curr.chartType === 'indicator-card') prev.indicatorCards.push(curr)
        else prev.charts.push(curr)
        return prev
      },
      { indicatorCards: [], charts: [] } as {
        indicatorCards: AnalyzeResultWithIndicatorCardSchema[]
        charts: AnalyzeResultWithChartSchema[]
      },
    )
  }, [data])
  if (isLoading || !chartInfo) return <Loader2 size="16" className="animate-spin" />
  debugger

  return (
    <div>
      <IndicatorCards configs={chartInfo.indicatorCards} />
      {chartInfo.charts.map((chart) => (
        <ChartRenderer {...chart} />
      ))}
    </div>
  )
}

function areEqual(prevProps: DashboardProps, nextProps: DashboardProps) {
  if (prevProps.chatId !== nextProps.chatId) return false
  if (prevProps.messageId !== nextProps.messageId) return false
  return true
}

export const Dashboard = memo(PureDashboard, areEqual)
