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
      description: z.string({ description: `${name}描述` }).optional(),
    },
    { description: `${name}配置` },
  )
}

const analyzeResultWithChartZodSchema = z.object({
  chartType: z.enum(['bar', 'line', 'pie'], { description: '图表类型' }),
  title: genSchemaItem('图表标题'),
  data: z.array(z.record(z.string(), z.any()), { description: '图表数据(数组)' }),
  footer: genSchemaItem('图表底部说明').optional(),
})

const analyzeResultWithIndicatorCardZodSchema = z.object({
  chartType: z.literal('indicator-card', { description: '指示卡片类型' }),
  title: genSchemaItem('指标卡标题'),
  data: z.record(z.string(), z.any(), { description: '指示卡片数据(单个对象)' }),
  footer: genSchemaItem('图表底部说明').optional(),
})

const analyzeResultZodSchema = z.discriminatedUnion('chartType', [
  analyzeResultWithChartZodSchema,
  analyzeResultWithIndicatorCardZodSchema,
])

export const analyzeResultSchema = { zod: analyzeResultZodSchema, json: zodToJsonSchema(analyzeResultZodSchema) }

export type AnalyzeResultSchema = z.infer<typeof analyzeResultZodSchema>

export type AnalyzeResultWithChartSchema = z.infer<typeof analyzeResultWithChartZodSchema>

export type AnalyzeResultWithIndicatorCardSchema = z.infer<typeof analyzeResultWithIndicatorCardZodSchema>

const dashboardZodSchema = z.object({
  title: genSchemaItem('Dashboard 标题'),
  charts: z.array(analyzeResultZodSchema, { description: '图表配置' }).optional(),
  list: z
    .array(
      z.object({
        title: genSchemaItem('列表标题'),
        data: genSchemaItem('列表数据'),
      }),
      { description: '列表配置' },
    )
    .optional(),
})

export const dashboardSchema = { zod: dashboardZodSchema, json: zodToJsonSchema(dashboardZodSchema) }

export type DashboardSchema = z.infer<typeof dashboardZodSchema>
