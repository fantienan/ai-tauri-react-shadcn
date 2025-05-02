import { tool } from 'ai'
import { AnalyzeResultSchema, analyzeResultWithChartTypeSchema } from 'common/utils'
import { z } from 'zod'
import { logger } from '../../../utils/index.ts'
import { createBizError } from '../../errors.ts'
import { Result } from '../../result.ts'
import { generateDescriptionInformation, getDatabase } from '../utils/index.ts'

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
  description: `SQLite数据库数据分析工具，除非用户要求了图表类型，否则不用生成图表类型，注意如果用户明确指出要生成Dashboard页面，你要将isDashboard参数设置为true`,
  parameters: z.object({
    isDashboard: z.boolean().describe('是否生成Dashboard页面'),
    sql: z.string().describe('要执行的 SQL 查询'),
    chartType: analyzeResultWithChartTypeSchema.zod.optional().describe('图表类型'),
  }),
  execute: async ({ sql, chartType, isDashboard }) => {
    try {
      logger.info(`SQLite数据库分析工具执行sql: ${JSON.stringify(sql)}`)
      const db = getDatabase()
      let internalChartType = isDashboard ? undefined : chartType

      const result: AnalyzeResultSchema = {
        data: db.prepare(sql).all() as any[],
        chartType: 'bar',
        title: {
          value: '',
          description: '',
        },
      }
      db.close()
      if (!internalChartType) {
        const { length } = result.data
        if (length === 1) {
          ;(result as any).chartType = 'indicator-card'
          ;(result as any).data = result.data[0]
        } else if (length <= 10) {
          result.chartType = 'bar'
        } else {
          result.chartType = 'line'
        }
      }
      const { footer, title } = await generateDescriptionInformation(result)
      result.title = { ...result.title, ...title }
      result.footer = footer
      logger.info(`SQLite数据库分析工具执行结果: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const generateDashboardsBasedOnAnalysisResults = tool({
  description:
    'Dashboard页面生成工具，你首先看看数据库中所有的表能做哪些分析，然后使用SQLite数据库数据分析工具进行分析，最后当所有数据分析工具都执行完毕后告诉我。注意此工具需要用户明确指出要生成Dashboard页面，否则你不需要执行此工具',
  parameters: z.object({ isFinish: z.boolean({ description: '所有SQLite数据库分析工具是否全部执行完毕' }) }),
  execute: async (params) => {
    logger.info(`Dashboard生成工具执行参数: ${JSON.stringify(params)}`)
    return params
  },
})
