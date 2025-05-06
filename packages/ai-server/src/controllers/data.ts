import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
import { createDataService } from '../services/data.ts'

export default async function (fastify: FastifyInstance) {
  const service = createDataService(fastify)

  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .post(
      fastify.bizAppConfig.routes.data.getMetadata,
      { schema: { body: fastify.bizSchemas.data.getMetadata } },
      async function (request) {
        return service.getMetadata(request.body)
      },
    )
}
