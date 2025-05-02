import { generateObject } from 'ai'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'

export default async function (fastify: FastifyInstance) {
  const agent = fastify.bizAgent
  const dashboardSchema = fastify.bizDashboardSchema
  const model = agent.utils.llmProvider.languageModel('chat-model-reasoning')
  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .post(fastify.bizAppConfig.routes.test.dashboard, async function (_request, reply) {
      const result = await generateObject({
        model,
        schema: dashboardSchema.zod,
        // prompt: '生成dashboardSchema页面配置，数据源为：' + JSON.stringify(a),
        messages: [],

        // tools: agent.tools,
      })

      //   reply.header('Content-Type', 'text/plain; charset=utf-8')
      console.log('result', result.object)
      return reply.send(result.object)
    })
}
