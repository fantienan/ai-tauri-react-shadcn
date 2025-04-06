import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
import { createUserService } from '../services/index.ts'

export default async function (fastify: FastifyInstance) {
  const service = createUserService(fastify)
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    '/insert',
    {
      schema: {
        body: fastify.bizSchemas.user.insert,
      },
    },
    async function (request) {
      return await service.insert(request.body)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    '/queryById',
    {
      schema: {
        body: fastify.bizSchemas.user.queryById,
      },
    },
    async function (request) {
      console.log('request.body', request.body)
      return await service.queryById(request.body)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    '/update',
    {
      schema: {
        body: fastify.bizSchemas.user.update,
      },
    },
    async function (request) {
      return await service.update(request.body)
    },
  )
}
