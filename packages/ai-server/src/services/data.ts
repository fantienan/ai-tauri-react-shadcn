import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { metadataInfo } from '../database/schema.ts'

export type UserService = ReturnType<typeof createUserService>

export const createUserService = (fastify: FastifyInstance) => {
  const db = fastify.bizDb
  return {
    getMetadata: async function (params: z.infer<typeof fastify.bizSchemas.data.getMetadata>) {
      try {
        const result = await db.select().from(metadataInfo).where({ tableName: params.tableName })
        return fastify.BizResult.success({ data: result })
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    },
  }
}
