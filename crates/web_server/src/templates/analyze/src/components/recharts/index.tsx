import { ChartSpec } from '@/types'
import { ChartBar } from './bar'

export const Recharts = ({ chartType, ...options }: ChartSpec) => {
  if (chartType === 'bar') return <ChartBar {...options} />
  return <ChartBar {...options} />
}
