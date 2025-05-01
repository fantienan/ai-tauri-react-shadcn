import {
  CoreToolMessage,
  appendResponseMessages,
  convertToCoreMessages,
  createDataStreamResponse,
  generateObject,
  streamText,
} from 'ai'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
import { AnalyzeResult } from 'types'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { createLlmService } from '../services/index.ts'

export default async function (fastify: FastifyInstance) {
  const agent = fastify.bizAgent
  const llmSchema = fastify.bizSchemas.llm
  const model = agent.utils.llmProvider.languageModel('chat-model-reasoning')
  const service = createLlmService(fastify)
  const session = fastify.session

  const getChatById = async (id: string) => {
    const chat = await service.chat.queryById({ id })
    if (!chat || !chat.data) {
      return fastify.BizResult.error({ code: 404, message: 'Chat not found' })
    }
    if (chat.data.userId !== session.user.id) {
      return fastify.BizResult.error({ code: 401, message: 'Unauthorized' })
    }
    return chat
  }

  const createDashboard = async (params: z.infer<typeof fastify.bizSchemas.llm.dashboard.insert>) => {
    const chat = await getChatById(params.chatId)
    if (!chat.success) return chat
    const message = await service.message.queryById(params.messageId)
    if (!message.success) return message

    const coreMessage = convertToCoreMessages([message.data as any]).map((v) => {
      if (v.role === 'tool' && v.content[0].type === 'tool-result' && v.content[0].toolName === 'sqliteAnalyze') {
        const msg = v as CoreToolMessage
        msg.content = msg.content.map((val) => {
          const { chartRendererType, chartType, ...result } = val.result as AnalyzeResult
          return { ...val, result }
        })
      }
      return v
    })

    fastify.log.info(`获取分析结果: ${JSON.stringify(coreMessage)}`)

    fastify.log.info('生成Dashboard配置...')

    const { object } = await generateObject({
      model,
      system: agent.utils.systemPrompt('dashboard'),
      schema: fastify.bizDashboardSchema.zod,
      messages: coreMessage,
    })

    fastify.log.info(`Dashboard配置：${JSON.stringify(object)}`)

    return service.dashboard.insert({ ...params, data: JSON.stringify(object), userId: session.user.id })
  }

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.chat,
    {
      schema: {
        body: llmSchema.chat.self,
      },
    },
    async function (request, reply) {
      const { messages, id } = request.body
      const userMessage = agent.utils.getMostRecentUserMessage(messages)

      if (!userMessage) {
        return fastify.bizError.createBizError(fastify.BizResult.AI_CHAT_ERROR, { message: 'No user message found' })
      }
      const chatRes = await service.chat.queryById({ id })
      let chat = chatRes.data
      if (!chat) {
        const title = await agent.utils.generateTitleFromUserMessage({ message: userMessage })
        chat = (await service.chat.insert({ userId: session.user.id, title, id })).data
        if (!chat) return fastify.BizResult.error({ code: 404, message: 'Chat not found' })
      } else if (chat.userId !== session.user.id) {
        return fastify.BizResult.error({ code: 401, message: 'Unauthorized' })
      }

      await service.message.insert({
        messages: [
          {
            chatId: chat.id,
            id: userMessage.id,
            role: 'user',
            parts: userMessage.parts,
            attachments: userMessage.experimental_attachments ?? [],
          },
        ],
      })

      reply.header('Content-Type', 'text/plain; charset=utf-8')
      return reply.send(
        createDataStreamResponse({
          execute: (dataStream) => {
            const result = streamText({
              model,
              system: agent.utils.systemPrompt(),
              messages,
              tools: agent.tools,
              maxSteps: 10,
              // experimental_transform: smoothStream({ chunking: 'word' }),
              experimental_generateMessageId: uuidv4,
              //   onStepFinish: async ({ request }) => {
              //     fastify.log.info(`onStepFinish: ${JSON.stringify(request.body)}`)
              //   },
              onFinish: async ({ response }) => {
                if (session.user?.id) {
                  try {
                    const assistantId = agent.utils.getTrailingMessageId({
                      messages: response.messages.filter((message) => message.role === 'assistant'),
                    })

                    if (!assistantId) {
                      throw fastify.bizError.createBizError(fastify.BizResult.AI_CHAT_ERROR, {
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
                        },
                      ],
                    })
                  } catch (_) {
                    console.error('Failed to save chat')
                  }
                }
              },
              experimental_telemetry: {
                isEnabled: true,
                functionId: 'stream-text',
              },
            })
            result.consumeStream()
            result.mergeIntoDataStream(dataStream, { sendReasoning: true })
          },
          onError: (error) => {
            fastify.log.error(error)
            return 'Oops, an error occured!'
          },
        }),
      )
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
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.chat + '/update',
    {
      schema: {
        body: llmSchema.chat.update,
      },
    },
    async function (request) {
      return service.chat.update(request.body)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    fastify.bizAppConfig.routes.llm.chat + '/history',
    {
      schema: {
        querystring: llmSchema.chat.history,
      },
    },
    async function (request) {
      return service.chat.history({ ...request.query, limit: request.query.limit ?? 10, id: session.user.id })
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().delete(
    fastify.bizAppConfig.routes.llm.chat,
    {
      schema: {
        body: llmSchema.chat.delete,
      },
    },
    async function (request) {
      const chat = await getChatById(request.body.id)
      if (!chat.success) return chat
      return service.chat.delete(request.body)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    fastify.bizAppConfig.routes.llm.vote,
    {
      schema: {
        querystring: llmSchema.vote.self,
      },
    },
    async function (request) {
      const chat = await getChatById(request.query.chatId)
      if (!chat.success) return chat
      const votes = await service.vote.queryByChatId(request.query)
      return fastify.BizResult.success({ data: votes })
    },
  )
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().patch(
    fastify.bizAppConfig.routes.llm.vote,
    {
      schema: {
        body: llmSchema.vote.batch,
      },
    },
    async function (request) {
      const chat = await getChatById(request.body.chatId)
      if (!chat.success) return chat
      return service.vote.update(request.body)
    },
  )
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    fastify.bizAppConfig.routes.llm.message + '/queryByChatId',
    {
      schema: {
        querystring: llmSchema.message.queryByChatId,
      },
    },
    async function (request) {
      const chat = await getChatById(request.query.chatId)
      if (!chat.success) return chat
      return service.message.queryMessageByChatId(request.query)
    },
  )

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    fastify.bizAppConfig.routes.llm.dashboard + '/insert',
    {
      schema: {
        body: llmSchema.dashboard.insert,
      },
    },
    async function (request) {
      const chat = await getChatById(request.body.chatId)
      if (!chat.success) return chat
      const message = await service.message.queryById(request.body.messageId)
      if (!message.success) return message

      const coreMessage = convertToCoreMessages([message.data as any]).map((v) => {
        if (v.role === 'tool' && v.content[0].type === 'tool-result' && v.content[0].toolName === 'sqliteAnalyze') {
          const msg = v as CoreToolMessage
          msg.content = msg.content.map((val) => {
            const { chartRendererType, chartType, ...result } = val.result as AnalyzeResult
            return { ...val, result }
          })
        }
        return v
      })

      fastify.log.info(`获取分析结果: ${JSON.stringify(coreMessage)}`)

      fastify.log.info('生成Dashboard配置...')

      const { object } = await generateObject({
        model,
        system: agent.utils.systemPrompt('dashboard'),
        schema: fastify.bizDashboardSchema.zod,
        messages: coreMessage,
      })

      fastify.log.info(`Dashboard配置：${JSON.stringify(object)}`)

      return service.dashboard.insert({ ...request.body, data: JSON.stringify(object), userId: session.user.id })
    },
  )
  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .get(
      fastify.bizAppConfig.routes.llm.dashboard + '/query',
      { schema: { querystring: fastify.bizSchemas.llm.dashboard.query } },
      async function (request) {
        return service.dashboard.query(request.query)
      },
    )

  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .post(
      fastify.bizAppConfig.routes.llm.dashboard + '/try',
      { schema: { body: fastify.bizSchemas.llm.dashboard.try } },
      async function (request) {
        const dashboard = await service.dashboard.query(request.body)
        if (dashboard.success) return dashboard
        return createDashboard(request.body)
      },
    )
}
