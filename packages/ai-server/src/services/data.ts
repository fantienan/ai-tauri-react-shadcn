import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { metadataInfo } from '../database/schema.ts'

export type DataService = ReturnType<typeof createDataService>

export const createDataService = (fastify: FastifyInstance) => {
  const db = fastify.bizDb
  return {
    getMetadata: async function (params: z.infer<typeof fastify.bizSchemas.data.getMetadata>) {
      try {
        const result = await db.select().from(metadataInfo).where(eq(metadataInfo.tableName, params.tableName))
        return fastify.BizResult.success({ data: result })
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    },
  }
}
