import { tool } from 'ai'
import type { AnalyzeResult } from 'types'
import { z } from 'zod'
import { logger } from '../../../utils/index.ts'
import { createBizError } from '../../errors.ts'
import { Result } from '../../result.ts'
import { getDatabase } from '../utils/index.ts'

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
      logger.info('sqliteSchemaTool', result)
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
      logger.info('sqliteFieldTool', result)
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
    - 分析结果数据结构要求如下：
        - 用value作为统计值的字段名称，如果有多种类型的统计值则以value1、value2的方式命名
        - 用name作为统计分类的字段名称，如果有多种类型的分类值则以name1、name2的方式命名`,
  parameters: z.object({ sql: z.string().describe('要执行的 SQL 查询') }),
  execute: async ({ sql }) => {
    try {
      const db = getDatabase()
      const result = db.prepare(sql).all()
      logger.info('sqliteAnalyzeTool', result)
      db.close()
      return { data: result } as AnalyzeResult
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})

export const textLayout = tool({
  description: `SQLite数据库分析结果文本编排工具，调用此工具前要准备好分析结果数据，文本
    - 分析结果数据结构要求如下：
        - 用value作为统计值的字段名称，如果有多种类型的统计值则以value1、value2的方式命名
        - 用name作为统计分类的字段名称，如果有多种类型的分类值则以name1、name2的方式命名
        - 为分析结果生成标题，标题要求简洁明了，不要超过10个汉字，存放在title字段中
        - 为分析结果生成描述, 描述要求简洁明了，不要超过20个汉字，存放在description字段中
        - 为分析结果生成总结, 总结要求简洁明了，不要超过30个汉字，存放在summary字段中`,
  parameters: z.object({ data: z.any().describe('分析结果，根据分析结果生成标题、描述和总结') }),
  execute: async ({ data }) => {
    try {
      return { data } as AnalyzeResult
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_AGENT_TOOL_ERROR, error)
      throw error
    }
  },
})
