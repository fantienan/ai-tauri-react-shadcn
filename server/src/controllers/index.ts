import { FastifyInstance } from 'fastify'

const controllers = async (fastify: FastifyInstance) => {
  fastify.register(import('./llm.ts'), {
    prefix: fastify.bizAppConfig.routes.llm.prefix,
  })
}

export default controllers
