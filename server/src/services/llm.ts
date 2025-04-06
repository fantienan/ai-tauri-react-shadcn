import { desc, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { MakeRequiredAndOptional } from 'types'
import { z } from 'zod'
import { chat, message } from '../database/schema.ts'

export type LlmService = ReturnType<typeof createLlmService>

export const createLlmService = (fastify: FastifyInstance) => {
  return {
    chat: {
      insert: async function (params: typeof chat.$inferInsert) {
        try {
          const result = await fastify.bizSqliteDb.insert(chat).values(params).returning()
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      queryById: async function (params: Pick<typeof chat.$inferSelect, 'id'>) {
        try {
          const result = await fastify.bizSqliteDb.select().from(chat).where(eq(chat.id, params.id)).limit(1)
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      update: async function (params: MakeRequiredAndOptional<typeof chat.$inferSelect, 'id'>) {
        try {
          const { id, ...values } = params
          const result = await fastify.bizSqliteDb.update(chat).set(values).where(eq(chat.id, id)).returning().limit(1)
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      history: async function (params: z.infer<typeof fastify.bizSchemas.llm.chat.history>) {
        try {
          const result = await fastify.bizSqliteDb
            .select()
            .from(chat)
            .where(eq(chat.userId, params.userId))
            .orderBy(desc(chat.createdAt))
            .limit(params.limit)
          return fastify.BizResult.success({ data: result })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
    },
    message: {
      insert: async function (params: { messages: (typeof message.$inferSelect)[] }) {
        try {
          const result = await fastify.bizSqliteDb.insert(message).values(params.messages).returning()
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
    },
  }
}
