export type ChartSpec = {
  data: {
    name: string
    value: number
  }[]
  title: string
  description: string
  summary: string
  chartType: 'bar' | 'line' | 'pie'
}

export type AppSpec = {
  summary: string
  chartSpec: ChartSpec
}
