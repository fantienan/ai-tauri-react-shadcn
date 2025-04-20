import { tool } from 'ai'
import type { AnalyzeResult } from 'types'
import { z } from 'zod'
import { logger } from '../../../utils/index.ts'
import { createBizError } from '../../errors.ts'
import { Result } from '../../result.ts'
import { generateTextLayoutFromAnaylzeResult, getDatabase } from '../utils/index.ts'

export const sqliteSchema = tool({
  description: '获取SQLite数据库所有的表',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),

  execute: async ({ sql }) => {
    try {
      const db = getDatabase()
      const result = db.prepare(sql).all()
      db.close()
      logger.info(result, 'sqliteSchemaTool')
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const sqliteTableField = tool({
  description: '获取SQLite数据库所有表的字段信息，调用此工具之前需要获取数据库中所有的表',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),
  execute: async ({ sql }) => {
    try {
      const db = getDatabase()
      const result = db.prepare(sql).all()
      db.close()
      logger.info(result, 'sqliteFieldTool')
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const sqliteAnalyze = tool({
  description: `SQLite数据库分析工具，调用此工具需要满足以下要求:
    - 调用此工具之前需要先获取数据库中所有的表和每个表的所有字段信息
    - 调用此工具之后不要再生成其他文字描述
    - 分析结果数据结构要求如下：
        - 用value作为统计值的字段名称，如果有多种类型的统计值则以value1、value2的方式命名
        - 用name作为统计分类的字段名称，如果有多种类型的分类值则以name1、name2的方式命名
        - 如果用户没有指定图表类型则使用默认值
        - 如果用户没有指定图表渲染器则使用默认值`,
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
      const db = getDatabase()
      const data = db.prepare(sql).all() as AnalyzeResult['data']
      db.close()
      let result = await generateTextLayoutFromAnaylzeResult({ data })
      result = { ...result, chartRendererType, chartType }
      logger.info(result, 'sqliteAnalyzeTool')
      return result
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})
