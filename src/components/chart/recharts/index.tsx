import { AnalyzeResult } from 'types'
import { ChartBar } from './bar'

type RechartsProps = Omit<AnalyzeResult, 'chartRendererType'>

export const Recharts = ({ chartType, ...options }: RechartsProps) => {
  if (chartType === 'bar') return <ChartBar {...options} />
  return <ChartBar {...options} />
}
