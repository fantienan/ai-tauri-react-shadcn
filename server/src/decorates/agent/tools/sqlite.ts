import { tool } from 'ai';
import { z } from 'zod';
import { sqlite } from '../../database/index.ts';
import { createBizError } from '../../errors.ts';
import { Result } from '../../result.ts';
import { logger } from '../../../utils/index.ts';
import { g2Chart } from '../chart/index.ts';

export const sqliteSchema = tool({
  description: '获取SQLite数据库所有的表',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),

  execute: async ({ sql }) => {
    try {
      const db = sqlite.getDatabase();
      const result = db.prepare(sql).all();
      db.close();
      logger.info('sqliteSchemaTool', result);
      return result;
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_ERROR, error);
      throw error;
    }
  },
});

export const sqliteTableField = tool({
  description: '获取SQLite数据库所有表的字段信息，调用此工具之前需要获取数据库中所有的表',
  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),
  execute: async ({ sql }) => {
    try {
      const db = sqlite.getDatabase();
      const result = db.prepare(sql).all();
      db.close();
      logger.info('sqliteFieldTool', result);
      return result;
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_ERROR, error);
      throw error;
    }
  },
});

export const sqliteAnalyze = tool({
  description:
    'SQLite数据库分析工具，调用此工具之前需要先获取数据库中所有的表和每个表的所有字段信息，注意，分析结果中用value作为统计值的字段名称，name作为统计目标的字段名称',

  parameters: z.object({
    sql: z.string().describe('要执行的 SQL 查询'),
  }),
  execute: async ({ sql }) => {
    try {
      const db = sqlite.getDatabase();
      const result = db.prepare(sql).all();
      logger.info('sqliteAnalyzeTool', result);
      db.close();
      return g2Chart.getSpec({ data: result, encode: { x: 'name', y: 'value' } });
    } catch (error) {
      if (error instanceof Error) return createBizError(Result.AI_ERROR, error);
      throw error;
    }
  },
});
