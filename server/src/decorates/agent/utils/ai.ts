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
import type { AnalyzeResult } from 'types'
import { z } from 'zod'

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
type ResponseMessage = ResponseMessageWithoutId & { id: string }

export const regularPrompt = `你是一位友善的助手！请保持你的回答简洁且有帮助。`

export const systemPrompt = () => {
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
    system: `\n
        - 您将根据用户开始对话的第一条消息生成一个简短的标题
        - 确保其长度不超过 80 个汉字
        - 标题应为用户消息的摘要
        - 请勿使用引号或冒号`,
    prompt: JSON.stringify(message),
  })

  return title
}

export function getTrailingMessageId({ messages }: { messages: ResponseMessage[] }) {
  return messages.at(-1)?.id ?? null
}

export async function generateTextLayoutFromAnaylzeResult({ data }: { data: AnalyzeResult['data'] }) {
  const { object } = await generateObject({
    model: llmProvider.languageModel('chat-model-reasoning'),
    schema: z.object({
      title: z.string().describe('标题'),
      description: z.string().describe('描述'),
      summary: z.string().describe('总结'),
      data: z.any().describe('数据'),
    }),
    system: `\n
    您将根据这些数据生成一些文字，要求如下：
        - 返回的结果是一个json对象，包含title、description、summary三个字段
        - 根据数据生成标题，标题要求简洁明了，不要超过10个汉字，存放在title字段中
        - 根据数据生成描述, 描述要求简洁明了，不要超过20个汉字，存放在description字段中
        - 根据数据生成总结, 总结要求简洁明了，不要超过30个汉字，存放在summary字段中`,
    prompt: JSON.stringify(data),
  })
  return { data, ...object } as AnalyzeResult
}
