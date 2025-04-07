import { AnalyzeResult } from 'types'
import { G2Chart } from './g2-chart'
import { ReactCharts } from './react-charts'
import { Recharts } from './recharts'
import { VegaChart } from './vega'

export type ChartRendererProps = AnalyzeResult

export const ChartRenderer = (props: ChartRendererProps) => {
  const { chartRendererType, ...options } = props
  if (!options) return null
  const { data, ...resetOptions } = options
  switch (chartRendererType) {
    case 'react-charts':
      return <ReactCharts options={options} />
    case 'vega':
      return <VegaChart {...resetOptions} spec={options} />
    case 'g2-chart':
      return <G2Chart {...resetOptions} spec={{ data }} />
    case 'recharts':
      return <Recharts {...options} />
    default:
      return null
  }
}
