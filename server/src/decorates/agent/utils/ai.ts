import { deepseek } from '@ai-sdk/deepseek'
import type { CoreAssistantMessage, CoreToolMessage } from 'ai'
import {
  type Message,
  type UIMessage,
  customProvider,
  extractReasoningMiddleware,
  generateText,
  wrapLanguageModel,
} from 'ai'

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
type ResponseMessage = ResponseMessageWithoutId & { id: string }

export const regularPrompt = '你是一位友善的助手！请保持你的回答简洁且有帮助。'

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

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message
}) {
  const { text: title } = await generateText({
    model: llmProvider.languageModel('chat-model-reasoning'),
    system: `\n
        - 您将根据用户开始对话的第一条消息生成一个简短的标题
        - 确保其长度不超过 80 个字符
        - 标题应为用户消息的摘要
        - 请勿使用引号或冒号`,
    prompt: JSON.stringify(message),
  })

  return title
}

export function getTrailingMessageId({ messages }: { messages: Array<ResponseMessage> }) {
  return messages.at(-1)?.id ?? null
}
