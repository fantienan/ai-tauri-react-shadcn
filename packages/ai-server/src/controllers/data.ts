import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'

export default async function (fastify: FastifyInstance) {
  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .post(
      fastify.bizAppConfig.routes.data.getMetadata,
      { schema: { body: fastify.bizSchemas.data.getMetadata } },
      async function (request, reply) {},
    )
}
