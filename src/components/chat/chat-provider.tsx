import { ThemeStoreProps } from '@/stores'
import type { User } from '@/types'
import { fetcher } from '@/utils'
import type { UseChatOptions } from '@ai-sdk/react'
import React from 'react'
import type { MakeReqiured } from 'types'

export type ChatbarContextProps = Pick<ThemeStoreProps, 'theme' | 'setTheme'> & {
  user?: User
  chatId?: string
  onSignOut?: () => void
  onNewChat?: () => void
  onDeleteChat?: (params: { chatId: string }) => void
  onOpenHistoryChat?: (params: { chatId: string }) => void
  onCreateChat?: (params: { chatId: string }) => void
  onDownloadCode?: (params: { chatId: string; messageId: string }) => Promise<any>
  useChatOptions: UseChatOptions
}

export type ChatbarProviderProps = ChatbarContextProps & Pick<React.HTMLProps<HTMLDivElement>, 'children'>

const ChatbarContext = React.createContext<MakeReqiured<ChatbarContextProps, 'onDownloadCode'> | null>(null)

function useChatbar() {
  const context = React.useContext(ChatbarContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatbarProvider.')
  }

  return context
}

function ChatbarProvider({ children, onDownloadCode: propOnDownloadCode, ...props }: ChatbarProviderProps) {
  const onDownloadCode: ChatbarContextProps['onDownloadCode'] = async (params) => {
    if (propOnDownloadCode) return propOnDownloadCode(params)
    return Promise.reject('onDownloadCode not implemented')
  }
  return <ChatbarContext.Provider value={{ ...props, onDownloadCode }}>{children}</ChatbarContext.Provider>
}
export { useChatbar, ChatbarProvider }
