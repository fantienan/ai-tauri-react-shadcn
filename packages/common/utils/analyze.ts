import type { Attachment, UIMessage } from 'ai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export function convertToUIMessages(
  messages: {
    id: string
    parts: any[]
    role: string
    createdAt: string
    attachments: any[]
  }[],
): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role as UIMessage['role'],
    content: '',
    createdAt: new Date(message.createdAt),
    experimental_attachments: (message.attachments as Attachment[]) ?? [],
  }))
}

const genSchemaItem = (name: string) => {
  return z.object(
    {
      value: z.string({ description: name }),
      prefix: z.string({ description: `${name}前缀` }).optional(),
      suffix: z.string({ description: `${name}后缀` }).optional(),
      description: z.string({ description: `${name}描述` }),
    },
    { description: `${name}配置` },
  )
}

export const genBasiceDataZodSchema = (name: string) => genSchemaItem(name)
export type BasicDataSchema = z.infer<ReturnType<typeof genBasiceDataZodSchema>>

const analyzeResultWithChartTypeZodSchema = z.enum(['bar', 'line', 'pie', 'list', 'table', 'indicator-card'], {
  description: '图表类型',
})

const analyzeResultZodSchema = z.object({
  chartType: analyzeResultWithChartTypeZodSchema,
  title: genSchemaItem('图表标题'),
  data: z.array(z.record(z.string(), z.any()), { description: '图表数据(数组)' }),
  footer: genSchemaItem('图表底部说明').optional(),
  tableName: z.string({ description: '表名' }),
})

export const analyzeResultSchema = { zod: analyzeResultZodSchema, json: zodToJsonSchema(analyzeResultZodSchema) }

export const analyzeResultWithChartTypeSchema = {
  zod: analyzeResultWithChartTypeZodSchema,
  json: zodToJsonSchema(analyzeResultWithChartTypeZodSchema),
}

export type AnalyzeResultSchema = z.infer<typeof analyzeResultZodSchema>

export type AnalyzeResultWithChartTypeSchema = z.infer<typeof analyzeResultWithChartTypeZodSchema>

const dashboardZodSchema = z.object({
  title: genSchemaItem('Dashboard 标题'),
  charts: z.array(analyzeResultZodSchema, { description: '图表配置' }),
})

export const dashboardSchema = { zod: dashboardZodSchema, json: zodToJsonSchema(dashboardZodSchema) }

export type DashboardSchema = z.infer<typeof dashboardZodSchema>
