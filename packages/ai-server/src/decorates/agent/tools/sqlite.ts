import { ToolSet, tool } from 'ai'
import { analyzeResultWithChartTypeSchema } from 'common/utils'
import { z } from 'zod'
import { logger } from '../../../utils/index.ts'
import { createBizError } from '../../errors.ts'
import { Result } from '../../result.ts'
import { CreateToolParams } from '../types.ts'
import { generateDescriptionInformation, getDatabase } from '../utils/index.ts'

type CreateSqliteToolParams = CreateToolParams

const filterTables = (table: { name: string }[]) => {
  return table.filter((v) => ['daily_summary', 'order_product_details'].includes(v.name))
}

export const createSqliteSchemaTool = ({}: CreateSqliteToolParams) =>
  tool({
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
        logger.info(`获取SQLite数据库所有表成功`)
        return result
      } catch (error) {
        if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
        throw error
      }
    },
  })

export const createSqliteTableFieldTool = ({}: CreateSqliteToolParams) =>
  tool({
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
        logger.info(`获取SQLite数据库所有表的字段信息成功`)
        return result
      } catch (error) {
        if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
        throw error
      }
    },
  })

export const createSqliteAnalyzeTool = ({}: CreateSqliteToolParams) =>
  tool({
    description: `SQLite数据库数据分析工具，除非用户要求了图表类型，否则不用生成图表类型，注意如果用户明确指出要生成Dashboard页面，你要将isDashboard参数设置为true`,
    parameters: z.object({
      from: z
        .enum(['generateDashboardsBasedOnAnalysisResults'])
        .describe('调用SQLite数据库数据分析工具的来源')
        .optional(),
      sql: z.string().describe('要执行的 SQL 查询'),
      chartType: analyzeResultWithChartTypeSchema.zod.optional().describe('图表类型'),
      tableName: z.string().describe('表名'),
    }),
    execute: async ({ sql, from, ...parameters }) => {
      try {
        logger.info(`SQLite数据库数据分析工具执行sql: ${JSON.stringify(sql)}`)
        const db = getDatabase()
        const data = db.prepare(sql).all() as Record<string, any>[]
        db.close()
        const { footer, title } = await generateDescriptionInformation({ data })
        logger.info(`SQLite数据库数据分析工具执行成功`)
        return { ...parameters, data, title, footer }
      } catch (error) {
        if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
        throw error
      }
    },
  })

export const createGenerateDashboardsBasedOnDataAnalysisResultsTool = ({}: CreateSqliteToolParams) =>
  tool({
    description: `
    Dashboard生成工具，调用此工具需要满足以下条件：
        - 用户明确指出要生成Dashboard
        - 在开始生成Dashboard和生成结束时必须调用此工具
        - 使用SQLite数据库数据分析工具进行分析，至少给出7种分析方案， 分析结果以图表展示，图表类型如下：
            - 4个指标卡，图表类型为indicator-card
            - 1个折线图，图表类型为line
            - 1个柱状图，图表类型为bar
            - 1个列表，图表类型为list
    `,
    parameters: z.object({
      state: z.enum(['start', 'end']).describe('Dashboard生成工具的状态'),
    }),
    execute: async (parameters) => {
      logger.info(`Dashboard生成工具执行参数: ${JSON.stringify(parameters)}`)
      return parameters
    },
  })

export const createSqliteTools = (params: CreateSqliteToolParams) => ({
  sqliteSchema: createSqliteSchemaTool(params),
  sqliteTableField: createSqliteTableFieldTool(params),
  sqliteAnalyze: createSqliteAnalyzeTool(params),
  generateDashboardsBasedOnDataAnalysisResults: createGenerateDashboardsBasedOnDataAnalysisResultsTool(params),
})
