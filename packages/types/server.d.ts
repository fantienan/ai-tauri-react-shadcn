export type AnalyzeResult = {
  chartRendererType?: 'react-charts' | 'vega' | 'g2-chart' | 'recharts'
  chartType?: 'bar' | 'line' | 'pie' | 'indicator-card'
  data: Record<string, any>[]
  title?: string
  description?: string
  summary?: string
}

export interface BizResult<T = any> {
  data?: T | null
  code?: number
  message?: string
  success?: boolean
}
