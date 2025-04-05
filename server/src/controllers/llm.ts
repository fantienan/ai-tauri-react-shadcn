import { appendResponseMessages, createDataStreamResponse, smoothStream, streamText } from 'ai'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
import { v4 as uuidv4 } from 'uuid'
import { createLlmService } from '../services/llm.ts'

export default async function (fastify: FastifyInstance) {
  const agent = fastify.bizAgent
  const llmSchema = fastify.bizSchemas.llm
  const model = agent.utils.llmProvider.languageModel('chat-model-reasoning')
  const service = createLlmService(fastify)
  /** @todo 需要添加用戶验证 */
  const session = {
    user: {
      id: 'localdev',
    },
  }

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.chat,
    {
      schema: {
        body: llmSchema.chat.self,
      },
    },
    async function (request, reply) {
      const userMessage = agent.utils.getMostRecentUserMessage(request.body.messages)

      if (!userMessage) {
        return fastify.bizErrors.createBizError(fastify.BizResult.AI_CHAT_ERROR, { message: 'No user message found' })
      }
      const chatRes = await service.chat.queryById({ id: request.body.id })
      let chat = chatRes.data
      if (!chat) {
        const title = await agent.utils.generateTitleFromUserMessage({ message: userMessage })
        chat = (await service.chat.insert({ userId: session.user.id, title })).data
        if (!chat) {
          return fastify.bizErrors.createBizError(fastify.BizResult.AI_CHAT_ERROR, { message: 'Chat not found' })
        }
      } else if (chat.userId !== session.user.id) {
        return fastify.bizErrors.createBizError(401, { message: 'Unauthorized' })
      }

      await service.message.insert({
        messages: [
          {
            chatId: chat.id,
            id: userMessage.id,
            role: 'user',
            parts: userMessage.parts,
            attachments: userMessage.experimental_attachments ?? [],
            createdAt: new Date(),
          },
        ],
      })

      //   const result = streamText({
      //     model,
      //     system: agent.utils.systemPrompt(),
      //     messages: request.body.messages,
      //     tools: agent.tools,
      //     maxSteps: 10,
      //     experimental_transform: smoothStream({ chunking: 'word' }),
      //     experimental_generateMessageId: uuidv4,
      //   })
      reply.header('Content-Type', 'text/plain; charset=utf-8')
      return reply.send(
        createDataStreamResponse({
          execute: (dataStream) => {
            const result = streamText({
              model,
              system: agent.utils.systemPrompt(),
              messages: request.body.messages,
              tools: agent.tools,
              maxSteps: 10,
              experimental_transform: smoothStream({ chunking: 'word' }),
              experimental_generateMessageId: uuidv4,
              onFinish: async ({ response }) => {
                if (session.user?.id) {
                  try {
                    const assistantId = agent.utils.getTrailingMessageId({
                      messages: response.messages.filter((message) => message.role === 'assistant'),
                    })

                    if (!assistantId) {
                      throw fastify.bizErrors.createBizError(fastify.BizResult.AI_CHAT_ERROR, {
                        message: 'No assistant message found!',
                      })
                    }

                    const [, assistantMessage] = appendResponseMessages({
                      messages: [userMessage],
                      responseMessages: response.messages,
                    })

                    await service.message.insert({
                      messages: [
                        {
                          id: assistantId,
                          chatId: chat.id,
                          role: assistantMessage.role,
                          parts: assistantMessage.parts,
                          attachments: assistantMessage.experimental_attachments ?? [],
                          createdAt: new Date(),
                        },
                      ],
                    })
                  } catch (_) {
                    console.error('Failed to save chat')
                  }
                }
              },
              experimental_telemetry: {
                isEnabled: fastify.bizAppConfig.isProductionEnvironment,
                functionId: 'stream-text',
              },
            })
            result.consumeStream()
            result.mergeIntoDataStream(dataStream, { sendReasoning: true })
          },
          onError: () => {
            return 'Oops, an error occured!'
          },
        }),
      )
      //   return reply.send(
      //     result.toDataStreamResponse({
      //       getErrorMessage: agent.utils.getErrorMessage,
      //     }),
      //   )
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.chat + '/inster',
    {
      schema: {
        body: llmSchema.chat.inster,
      },
    },
    async function (request) {
      return service.chat.insert(request.body)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    fastify.bizAppConfig.routes.llm.chat + '/queryById',
    {
      schema: {
        querystring: llmSchema.chat.queryById,
      },
    },
    async function (request) {
      return service.chat.queryById(request.query)
    },
  )
}
