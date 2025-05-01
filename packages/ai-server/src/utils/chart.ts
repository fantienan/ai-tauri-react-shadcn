import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const zodSchema = z.array(z.object({ name: z.string(), value: z.number() }), { description: '图表数据' })

export const chartDataSchema = { zod: zodSchema, json: zodToJsonSchema(zodSchema) }
