import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-zod-openapi'
import { config } from './config/index.ts'
import { Agent, Result, errors, sqliteDb } from './decorates/index.ts'
import * as schemas from './schemas/index.ts'
import { dashboardSchema, getFastifyOptions } from './utils/index.ts'

async function main() {
  const fastify = Fastify(getFastifyOptions())
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)
  fastify
    .decorate('bizAppConfig', config)
    .decorate('bizError', errors)
    .decorate('BizResult', Result)
    .decorate('bizAgent', new Agent())
    .decorate('bizDb', sqliteDb)
    .decorate('bizSchemas', schemas)
    .decorate('bizDashboardSchema', dashboardSchema)
    /** @todo 需要添加用戶验证 */
    .decorate('session', { user: { id: 'localdev' } })
    .register(import('@fastify/cors'), config.cors)
    .after(() => {
      fastify
        .get('/ping', () => ({ pong: 'it work' }))
        .register(import('./controllers/index.ts'), { prefix: config.routes.root })
    })

  await fastify.listen({ port: config.service.port, host: config.service.host })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
