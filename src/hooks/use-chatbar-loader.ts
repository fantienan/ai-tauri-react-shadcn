import type { ChatbarProps } from '@/components/chat/chat-bar'
import { useAppStore, useThemeStore } from '@/stores'
import { DBMessage } from '@/types'
import { BizResult } from '@/types'
import { fetcher, tauri } from '@/utils'
import { convertToUIMessages } from '@ai-dashboard/common/utils'
import useSWR from 'swr'
import { v4 as uuidv4 } from 'uuid'

export type ChatLoaderData = {
  initialMessages: DBMessage[]
  error?: boolean
}

// export function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
//   return messages.map((message) => ({
//     id: message.id,
//     parts: message.parts as UIMessage['parts'],
//     role: message.role as UIMessage['role'],
//     content: '',
//     createdAt: new Date(message.createdAt),
//     experimental_attachments: (message.attachments as Attachment[]) ?? [],
//   }))
// }

export const useChatbarLoader = ({ chatId }: { chatId?: string }) => {
  const user = useAppStore().session.user
  const theme = useThemeStore().theme
  const setTheme = useThemeStore().setTheme

  const { data, isLoading } = useSWR(
    chatId ? `/llm/message/queryByChatId?chatId=${chatId}` : null,
    async (input: string, init?: RequestInit) => fetcher<BizResult<DBMessage[]>>(input, init).then((res) => res.data),
  )
  const loaderData: ChatbarProps & Omit<ChatLoaderData, 'initialMessages'> = {
    id: chatId ?? uuidv4(),
    initialMessages: Array.isArray(data) ? convertToUIMessages(data) : [],
    user,
    theme,
    setTheme,
    isReadonly: false,
    error: !!(chatId && !isLoading && !Array.isArray(data)),
    useChatOptions: {
      api: `${import.meta.env.BIZ_NODE_SERVER_URL}/llm/chat`,
    },
    onDownloadCode: async (params) => {
      if (window.isTauri) return tauri.downloadCode(params)
      return fetcher<BizResult<string>>('', { method: 'POST', body: JSON.stringify(params) })
    },
  }
  return loaderData
}
