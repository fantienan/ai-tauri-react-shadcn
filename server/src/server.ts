import { serializerCompiler, validatorCompiler } from 'fastify-zod-openapi';
import Fastify from 'fastify';
import { config } from './config/index.ts';
import { errors, Result, sqlite, Agent } from './decorates/index.ts';
import { getFastifyOptions } from './utils/index.ts';

async function main() {
  const fastify = Fastify(getFastifyOptions());
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify
    .decorate('bizAppConfig', config)
    .decorate('bizError', errors)
    .decorate('BizResult', Result)
    .decorate('bizSqlite', sqlite)
    .decorate('bizAgent', new Agent())
    .register(import('@fastify/cors'), config.cors)
    .after(() => {
      fastify
        .get('/ping', () => ({ pong: 'it work' }))
        .register(import('./controllers/index.ts'), {
          prefix: config.routes.root,
        });
    });

  await fastify.listen({ port: config.service.port, host: config.service.host });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
