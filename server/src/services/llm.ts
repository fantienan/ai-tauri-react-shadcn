import { SQL, and, desc, eq, gt, lt } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { MakeReqiured, MakeRequiredAndOptional } from 'types'
import { z } from 'zod'
import { chat, message } from '../database/schema.ts'
import * as schemas from '../schemas/index.ts'

export type LlmService = ReturnType<typeof createLlmService>

type LlmServiceHistoryParams = MakeReqiured<z.infer<typeof schemas.llm.chat.history>, 'limit'> & { id: string }

export const createLlmService = (fastify: FastifyInstance) => {
  const db = fastify.bizDb
  async function getChatsByUserId({ id, limit, startingAfter, endingBefore }: LlmServiceHistoryParams) {
    try {
      const extendedLimit = limit + 1

      const query = (whereCondition?: SQL<any>) =>
        db
          .select()
          .from(chat)
          .where(whereCondition ? and(whereCondition, eq(chat.userId, id)) : eq(chat.userId, id))
          .orderBy(desc(chat.createdAt))
          .limit(extendedLimit)

      let filteredChats: (typeof chat.$inferSelect)[] = []

      if (startingAfter) {
        const [selectedChat] = await db.select().from(chat).where(eq(chat.id, startingAfter)).limit(1)

        if (!selectedChat) {
          throw new Error(`Chat with id ${startingAfter} not found`)
        }

        filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt))
      } else if (endingBefore) {
        const [selectedChat] = await db.select().from(chat).where(eq(chat.id, endingBefore)).limit(1)

        if (!selectedChat) {
          throw new Error(`Chat with id ${endingBefore} not found`)
        }

        filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt))
      } else {
        filteredChats = await query()
      }

      const hasMore = filteredChats.length > limit

      return {
        chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
        hasMore,
      }
    } catch (error) {
      console.error('Failed to get chats by user from database')
      throw error
    }
  }

  return {
    chat: {
      insert: async function (params: typeof chat.$inferInsert) {
        try {
          const result = await db.insert(chat).values(params).returning()
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      queryById: async function (params: Pick<typeof chat.$inferSelect, 'id'>) {
        try {
          const result = await db.select().from(chat).where(eq(chat.id, params.id)).limit(1)
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      update: async function (params: MakeRequiredAndOptional<typeof chat.$inferSelect, 'id'>) {
        try {
          const { id, ...values } = params
          const result = await db.update(chat).set(values).where(eq(chat.id, id)).returning().limit(1)
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
      history: async function (params: LlmServiceHistoryParams) {
        try {
          const result = await getChatsByUserId(params)
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
          const result = await db.insert(message).values(params.messages).returning()
          return fastify.BizResult.success({ data: result[0] })
        } catch (error) {
          fastify.log.error(error)
          throw error
        }
      },
    },
  }
}
