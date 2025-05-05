import { FastifyInstance } from 'fastify'

const controllers = async (fastify: FastifyInstance) => {
  fastify
    .register(import('./llm.ts'), { prefix: fastify.bizAppConfig.routes.llm.prefix })
    .register(import('./user.ts'), { prefix: fastify.bizAppConfig.routes.user })
    .register(import('./data.ts'), { prefix: fastify.bizAppConfig.routes.data.prefix })
}

export default controllers
