import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

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

const dashboardSchema = z.object({
  title: genSchemaItem('Dashboard 标题'),
  chart: z
    .array(
      z.object({
        chartType: z.enum(['bar', 'line', 'pie'], { description: '图表类型' }),
        title: genSchemaItem('图表标题'),
        data: z.array(z.object({ name: z.string(), value: z.number() }), { description: '图表数据' }),
      }),
      {
        description: '图表配置',
      },
    )
    .optional(),
  indicatorCard: z
    .array(
      z.object(
        {
          title: genSchemaItem('指标卡片标题'),
          data: genSchemaItem('指标卡片数据'),
        },
        { description: '指标卡片' },
      ),
      { description: '指标卡片配置' },
    )
    .optional(),
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

export const dashboard = {
  zod: dashboardSchema,
  json: zodToJsonSchema(dashboardSchema),
}
