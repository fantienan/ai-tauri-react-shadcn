export type AppConfig = {
  chart: {
    chartSpec: {
      data: any[]
      title: string
      description: string
      summary: string
      chartType: string
    }
    summary: string
  }

  indicatorCard: {}
  dashboard: {
    title: string
  }
}
