import { generateObject } from 'ai'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
const a = [
  {
    name: '其他',
    value: 5356.384,
  },
  {
    name: '飞鹤',
    value: 2721.4,
  },
  {
    name: '爸爸的选择',
    value: 1251.8000000000002,
  },
  {
    name: 'Capable/卡比布',
    value: 1002.012,
  },
  {
    name: 'GERBER/嘉宝',
    value: 891,
  },
]

export default async function (fastify: FastifyInstance) {
  const agent = fastify.bizAgent
  const dashboard = fastify.bizDashboard
  const model = agent.utils.llmProvider.languageModel('chat-model-reasoning')
  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .post(fastify.bizAppConfig.routes.test.dashboard, async function (request, reply) {
      const result = await generateObject({
        model,
        schema: dashboard.zod,
        prompt: '生成dashboard页面配置，数据源为：' + JSON.stringify(a),
        // tools: agent.tools,
      })

      //   reply.header('Content-Type', 'text/plain; charset=utf-8')
      console.log('result', result.object)
      return reply.send(result.object)
    })
}
