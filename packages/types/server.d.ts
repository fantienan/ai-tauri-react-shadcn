export type AnalyzeResult = {
  data: { name: string; value: number }[]
}

export interface BizResult<T = any> {
  data?: T | null
  code?: number
  message?: string
  success?: boolean
}
