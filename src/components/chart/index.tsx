import { AnalyzeResult } from 'types'
import { G2Chart } from './g2-chart'
import { Recharts } from './recharts'
import { VegaChart } from './vega'

export type ChartRendererProps = AnalyzeResult

export const ChartRenderer = (props: ChartRendererProps) => {
  const { chartRendererType, ...options } = props
  if (!options) return null
  const { data, ...resetOptions } = options
  switch (chartRendererType) {
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
