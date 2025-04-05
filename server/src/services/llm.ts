import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { type Chat, DBMessage, chat, message } from '../database/schema.ts'
import type { OptionalProperty } from '../types.ts'

export type LlmService = ReturnType<typeof createLlmService>

export const createLlmService = (fastify: FastifyInstance) => {
  return {
    chat: {
      insert: async function (params: OptionalProperty<Chat, 'id' | 'createdAt'>) {
        try {
          const result = await fastify.bizSqliteDb.insert(chat).values(params).returning()
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      queryById: async function (params: { id: string }) {
        try {
          const result = await fastify.bizSqliteDb.select().from(chat).where(eq(chat.id, params.id))
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
    },
    message: {
      insert: async function (params: { messages: DBMessage[] }) {
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
