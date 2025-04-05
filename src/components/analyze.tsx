import equal from 'fast-deep-equal'
import { memo } from 'react'
import { ChartRenderer, ChartRendererProps } from './chart'

function PureAnalyze({ options, chartType }: Partial<ChartRendererProps>) {
  return chartType && options ? <ChartRenderer options={options} chartType={chartType} /> : null
}

export const Analyze = memo(PureAnalyze, (prevProps, nextProps) => {
  if (prevProps.chartType !== nextProps.chartType) return false
  if (prevProps.options?.data.length !== nextProps.options?.data.length) return false
  if (!equal(prevProps.options?.data, nextProps.options?.data)) return false
  if (!equal(prevProps.options, nextProps.options)) return false
  return true
})
