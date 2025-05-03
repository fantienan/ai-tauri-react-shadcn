import type { AnalyzeResultSchema } from '@/types'
import { IndicatorCard } from './indicator-card'
import { Recharts } from './recharts'

export type ChartRendererProps = AnalyzeResultSchema & { className?: string }

export const ChartRenderer = (props: ChartRendererProps) => {
  if (!props) return null
  if (props.chartType === 'indicator-card') return <IndicatorCard {...props} className="gap-3" />
  return <Recharts {...props} />
}
