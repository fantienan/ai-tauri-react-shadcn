import { tool } from 'ai'
import type { AnalyzeResult } from 'types'
import { z } from 'zod'
import { chartDataSchema, logger } from '../../../utils/index.ts'
import { createBizError } from '../../errors.ts'
import { Result } from '../../result.ts'
import { generateTextLayoutFromAnaylzeResult, getDatabase } from '../utils/index.ts'

const filterTables = (table: { name: string }[]) => {
  return table.filter((v) => ['daily_summary', 'order_product_details'].includes(v.name))
}

export const sqliteSchema = tool({
  description: '获取SQLite数据库所有的表',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),

  execute: async ({ sql }) => {
    try {
      logger.info(`获取SQLite数据库所有表工具执行sql: ${sql}`)
      const db = getDatabase()
      const result = filterTables(db.prepare(sql).all() as any)
      db.close()
      logger.info(`获取SQLite数据库所有表工具执行结果: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const sqliteTableField = tool({
  description: '获取SQLite数据库所有表的字段信息',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),
  execute: async ({ sql }) => {
    try {
      logger.info(`获取SQLite数据库所有表的字段信息执行sql: ${sql}`)
      const db = getDatabase()
      const result = db.prepare(sql).all()
      db.close()
      logger.info(`获取SQLite数据库所有表的字段信息执行结果: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const sqliteAnalyze = tool({
  description: `SQLite数据库分析工具`,
  //   分析结果数据结构要求如下：
  //         - 用value作为统计值的字段名称
  //         - 用name作为统计分类的字段名称`,
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
    chartRendererType: z
      .enum(['react-charts', 'vega', 'g2-chart', 'recharts'])
      .optional()
      .describe('图表渲染器类型')
      .default('recharts'),
    chartType: z.enum(['bar', 'line']).optional().describe('图表类型').default('bar'),
  }),
  execute: async ({ sql, chartType, chartRendererType }) => {
    try {
      logger.info(`SQLite数据库分析工具执行sql: ${JSON.stringify(sql)}`)
      const db = getDatabase()
      const data = db.prepare(sql).all() as AnalyzeResult['data']
      db.close()
      let result = await generateTextLayoutFromAnaylzeResult({ data })
      result = { ...result, chartRendererType, chartType }
      logger.info(`SQLite数据库分析工具执行结果: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const sqliteDatabaseAnalysisSuggestion = tool({
  description:
    'SQLite数据库分析建议工具，告诉我数据库中的数据能做哪些分析，注意考虑多表联合分析，每个建议需要给出sqlite 查询语句',
  parameters: z.object({
    content: z.array(
      z.object({ content: z.string({ description: '建议' }), sql: z.string({ description: '查询语句' }) }),
      { description: '数据分析建议' },
    ),
  }),
  execute: async (params) => {
    logger.info(`SQLite数据库分析建议工具执行参数: ${JSON.stringify(params)}`)
    return params
  },
})

// export const sqliteDashboard = tool({
//     description: 'SQLite数据库Dashboard工具，生成dashboard配置',
//     parameters: z.object({}),
//     execute: async () => {}
// })
