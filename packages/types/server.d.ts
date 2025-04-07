export type AnalyzeResult = {
  data: { name: string; value: number }[]
  title: string
  description: string
  summary: string
}

export interface BizResult<T = any> {
  data?: T | null
  code?: number
  message?: string
  success?: boolean
}
