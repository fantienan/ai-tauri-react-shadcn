import { MakeRequiredAndOptional } from '@ai-dashboard/common/types'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { user } from '../database/schema.ts'

export type UserService = ReturnType<typeof createUserService>

export const createUserService = (fastify: FastifyInstance) => {
  return {
    insert: async function (params: typeof user.$inferInsert) {
      try {
        const result = await fastify.bizDb.insert(user).values(params).returning({ id: user.id })
        return fastify.BizResult.success({ data: result[0] })
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    },
    queryById: async function (params: Pick<typeof user.$inferSelect, 'id'>) {
      try {
        const result = await fastify.bizDb
          .select({ id: user.id, email: user.email })
          .from(user)
          .where(eq(user.id, params.id))
          .limit(1)
        return fastify.BizResult.success({ data: result[0] })
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    },
    update: async function (params: MakeRequiredAndOptional<typeof user.$inferSelect, 'id'>) {
      try {
        const { id, ...values } = params
        const result = await fastify.bizDb
          .update(user)
          .set(values)
          .where(eq(user.id, id))
          .returning({ id: user.id })
          .limit(1)
        return fastify.BizResult.success({ data: result[0] })
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    },
  }
}
