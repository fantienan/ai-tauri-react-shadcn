import { tool } from 'ai'
import type { AnalyzeResult } from 'common/types'
import { z } from 'zod'
import { logger } from '../../../utils/index.ts'
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
  description: `SQLite数据库数据分析工具，除非用户要求了图表类型，否则不用指定图表类型`,
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
    chartType: z.enum(['bar', 'line', 'pie', 'indicator-card']).optional().describe('图表类型'),
  }),
  execute: async ({ sql, chartType: type }) => {
    try {
      logger.info(`SQLite数据库分析工具执行sql: ${JSON.stringify(sql)}`)
      const db = getDatabase()
      const data = db.prepare(sql).all() as AnalyzeResult['data']
      db.close()
      let chartType = type
      if (!chartType) {
        const { length } = data
        if (length === 1) {
          chartType = 'indicator-card'
        } else if (length <= 10) {
          chartType = 'bar'
        } else {
          chartType = 'line'
        }
      }
      let result = await generateTextLayoutFromAnaylzeResult({ data })
      result = { ...result, chartRendererType: 'recharts', chartType }
      logger.info(`SQLite数据库分析工具执行结果: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const generateDashboardsBasedOnAnalysisResults = tool({
  //   description:
  //     'SQLite数据库分析建议工具，告诉我数据库中的数据能做哪些分析，注意考虑多表联合分析，每个建议需要给出sqlite 查询语句',
  description:
    'Dashboard页面生成工具，你首先看看数据库中所有的表能做哪些分析，然后使用SQLite数据库数据分析工具进行分析，最后当你拿到所有分析数据后给我',
  parameters: z.object({
    content: z.any({ description: '分析结果' }),
  }),
  execute: async (params) => {
    logger.info(`Dashboard生成工具执行参数: ${JSON.stringify(params)}`)
    return params
  },
})
