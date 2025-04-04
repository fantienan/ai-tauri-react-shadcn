import { z } from 'zod'
import { streamText } from 'ai'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'

const llmChatSchema = z.object({
  id: z.string(),
  messages: z.any({ description: '消息列表' }),
})

export default async function (fastify: FastifyInstance) {
  const agent = fastify.bizAgent
  const model = agent.wrappedLanguageModel()

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.chat,
    {
      schema: {
        body: llmChatSchema,
      },
    },
    async function (request, reply) {
      const result = streamText({
        model,
        messages: request.body.messages,
        tools: agent.tools,
        maxSteps: 10,
      })
      reply.header('Content-Type', 'text/plain; charset=utf-8')
      return reply.send(
        result.toDataStreamResponse({
          getErrorMessage: agent.utils.getErrorMessage,
        }),
      )
    },
  )
}
