import { deepseek } from '@ai-sdk/deepseek'
import type { CoreAssistantMessage, CoreToolMessage } from 'ai'
import {
  type Message,
  type UIMessage,
  customProvider,
  extractReasoningMiddleware,
  generateObject,
  generateText,
  wrapLanguageModel,
} from 'ai'
import { AnalyzeResultSchema } from 'common/utils'
import { z } from 'zod'

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
type ResponseMessage = ResponseMessageWithoutId & { id: string }

export const regularPrompt = `你是一位友善的助手，保持你的回答简洁且有帮助, 使用markdown格式返回文本`

export const systemPrompt = (options?: { type?: 'dashboard' | 'regular' }) => {
  if (options?.type === 'dashboard') {
    return `
    你是一名专业的数据分析师，根据这份数据生成Dashboard配置，要求如下：
        -  将data数组长度为1的图表类型设置为指标卡，其余图表类型保持不变
        - 根据所有数据为Dashboard生成标题和描述，要求准确、简洁、明了，标题在4-10个汉字之间，描述在10-30个汉字之间
    `
  }
  return regularPrompt
}

export function getMostRecentUserMessage(messages: UIMessage[]) {
  const userMessages = messages.filter((message) => message.role === 'user')
  return userMessages.at(-1)
}

export const llmProvider = customProvider({
  languageModels: {
    'chat-model-reasoning': wrapLanguageModel({
      model: deepseek('deepseek-chat'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
  },
})

export async function generateTitleFromUserMessage({ message }: { message: Message }) {
  const { text: title } = await generateText({
    model: llmProvider.languageModel('chat-model-reasoning'),
    messages: [message],
    system: `\n
        - 您将根据用户开始对话的第一条消息生成一个简短的标题
        - 确保其长度不超过 80 个汉字
        - 标题应为用户消息的摘要
        - 请勿使用引号或冒号`,
  })

  return title
}

export function getTrailingMessageId({ messages }: { messages: ResponseMessage[] }) {
  return messages.at(-1)?.id ?? null
}
export async function generateDescriptionInformation({ data }: { data: AnalyzeResultSchema['data'] }) {
  const { object } = await generateObject({
    model: llmProvider.languageModel('chat-model-reasoning'),
    schema: z.object({
      title: z.object({
        value: z.string({ description: '根据数据生成标题，要求准确、简洁、明了，不要超过10个汉字' }),
        description: z.string({ description: '根据数据生成描述, 要求准确、简洁、明了，不要超过20个汉字' }),
      }),
      footer: z.object({
        value: z.string({ description: '根据数据生成总结性文字, 要求准确、简洁、明了，不要超过30个汉字' }),
        description: z.string({ description: '根据数据生成长文本, 要求准确、简洁、明了，不要超过100个汉字' }),
      }),
    }),
    prompt: JSON.stringify(data),
  })
  return object
}

export async function userNeedsAnalysis(messages: any[]) {
  const { object } = await generateObject({
    model: llmProvider.languageModel('chat-model-reasoning'),
    messages,
    schema: z.object({
      isCreateDashboard: z.boolean({ description: '判断用户的意图是否是生成Dashboard' }),
    }),
  })
  return object
}
