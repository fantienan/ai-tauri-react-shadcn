import {
  CoreAssistantMessage,
  CoreToolMessage,
  DataStreamWriter,
  StepResult,
  appendResponseMessages,
  convertToCoreMessages,
  createDataStreamResponse,
  generateObject,
  streamText,
} from 'ai'
import { DashboardSchema } from 'common/utils'
import type { FastifyInstance } from 'fastify'
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi'
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

  const createDashboardByAi = async (params: z.infer<typeof fastify.bizSchemas.llm.dashboard.insert>) => {
    const chat = await getChatById(params.chatId)
    if (!chat.success) return chat
    const message = await service.message.queryById(params.messageId)
    if (!message.success) return message

    const coreMessage = convertToCoreMessages([message.data as any])

    fastify.log.info(`获取分析数据成功`)

    fastify.log.info('生成Dashboard配置...')

    const { object } = await generateObject({
      model,
      system: agent.utils.systemPrompt({ type: 'dashboard' }),
      schema: fastify.bizDashboardSchema.zod,
      messages: coreMessage,
    })

    fastify.log.info(`Dashboard配置：${JSON.stringify(object)}`)

    return service.dashboard.insert({ ...params, data: JSON.stringify(object), userId: session.user.id })
  }

  const createDashboard = async ({
    toolResults,
    messages,
    onFinish,
  }: Pick<StepResult<ReturnType<typeof agent.createTools>>, 'toolResults'> & {
    dataStream: DataStreamWriter
    messages: ((CoreAssistantMessage | CoreToolMessage) & { id: string })[]
    onFinish: (params: { dashboardSchema: DashboardSchema }) => void
  }) => {
    const createDashboardToolResult = toolResults.find(
      (v) => v.toolName === 'generateDashboardsBasedOnDataAnalysisResults' && v.result.state === 'end',
    )

    if (createDashboardToolResult) {
      try {
        const dashboardSchema: DashboardSchema = {
          title: {
            value: 'Dashboard标题',
            description: 'Dashboard描述',
          },
          charts: [],
        }
        let internalToolResults = toolResults
        if (internalToolResults.length === 1) {
          internalToolResults = (messages.filter((v) => v.role === 'tool').at(-2)?.content as any) ?? []
        }

        dashboardSchema.charts = internalToolResults.reduce(
          (prev, curr) => {
            if (curr.toolName === 'sqliteAnalyze' && curr.result) prev.push(curr.result as any)
            return prev
          },
          [] as DashboardSchema['charts'],
        )
        onFinish({ dashboardSchema })
      } catch (e) {}
    }
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
          execute: async (dataStream) => {
            // 判断用户的意图是否是生成Dashboard
            const { isCreateDashboard } = await agent.utils.userNeedsAnalysis(messages)

            const temporary: { dashboardSchema?: DashboardSchema } = {}

            const result = streamText({
              model,
              system: agent.utils.systemPrompt(),
              messages,
              tools: agent.createTools({ dataStream, isCreateDashboard }),
              maxSteps: 10,
              // experimental_transform: smoothStream({ chunking: 'word' }),
              experimental_generateMessageId: uuidv4,
              onStepFinish: async ({ stepType, finishReason, toolResults, response }) => {
                if (stepType === 'tool-result' && finishReason === 'tool-calls' && toolResults.length) {
                  await createDashboard({
                    dataStream,
                    messages: response.messages,
                    toolResults,
                    onFinish: ({ dashboardSchema }) => {
                      temporary.dashboardSchema = dashboardSchema
                    },
                  })
                }
              },
              onFinish: async ({ response }) => {
                if (session.user?.id) {
                  try {
                    const messageId = agent.utils.getTrailingMessageId({
                      messages: response.messages.filter((message) => message.role === 'assistant'),
                    })

                    if (!messageId) {
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
                          id: messageId,
                          chatId: chat.id,
                          role: assistantMessage.role,
                          parts: assistantMessage.parts,
                          attachments: assistantMessage.experimental_attachments ?? [],
                        },
                      ],
                    })

                    if (temporary.dashboardSchema) {
                      await service.dashboard.insert({
                        chatId: chat.id,
                        messageId,
                        data: temporary.dashboardSchema,
                        userId: session.user.id,
                      })
                    }
                  } catch (e) {
                    fastify.log.error(e, 'Failed to save message')
                  }
                }
              },
              experimental_telemetry: { isEnabled: true, functionId: 'stream-text' },
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
      return createDashboardByAi(request.body)
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
        if (!dashboard.success || dashboard.data) return dashboard
        return createDashboardByAi(request.body)
      },
    )
}
