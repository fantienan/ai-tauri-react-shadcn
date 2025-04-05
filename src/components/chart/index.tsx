import { G2Chart } from './g2-chart'
import { ReactCharts } from './react-charts'
import { VegaChart } from './vega'

export interface ChartRendererProps {
  chartType: 'react-charts' | 'vega' | 'g2-chart'
  options: { data: any[] }
}

export const ChartRenderer = ({ chartType, options }: ChartRendererProps) => {
  if (!options) return null
  switch (chartType) {
    case 'react-charts':
      return <ReactCharts options={{ data: [options] }} />
    case 'vega':
      return <VegaChart spec={options} />
    case 'g2-chart':
      return <G2Chart spec={options} />
    default:
      return null
  }
}
