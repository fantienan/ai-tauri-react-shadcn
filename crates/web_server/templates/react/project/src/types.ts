// 页面配置顶层
export interface PageConfig {
  components: ComponentConfig[]
}

interface BaseComponentConfig<D extends any = any> {
  id: string
  type: string
  dataSource: D
  title?: string
  description?: string
}

export type ComponentConfig = ChartConfig | MetricCardConfig | TableConfig

// 图表组件
export interface ChartConfig extends BaseComponentConfig<{ name: string; value: number }[]> {
  type: 'chart'
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'gauge'
  config?: Record<string, any>
  summary?: string
}

// 指标卡组件
export interface MetricCardConfig extends BaseComponentConfig {
  type: 'metricCard'
  valueKey: string
  prefix?: string
  suffix?: string
  color?: string
}

// 表格组件
export interface TableConfig extends BaseComponentConfig {
  type: 'table'
  columns: { key: string; label: string }[]
}
