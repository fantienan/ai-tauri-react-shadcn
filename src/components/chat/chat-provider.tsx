import { ThemeStoreProps } from '@/stores'
import type { User } from '@/types'
import type { UseChatOptions } from '@ai-sdk/react'
import React from 'react'

export type ChatbarContextProps = Pick<ThemeStoreProps, 'theme' | 'setTheme'> & {
  user?: User
  chatId?: string
  onSignOut?: () => void
  onNewChat?: () => void
  onDeleteChat?: (params: { chatId: string }) => void
  onOpenHistoryChat?: (params: { chatId: string }) => void
  onCreateChat?: (params: { chatId: string }) => void
  useChatOptions: UseChatOptions
}

export type ChatbarProviderProps = ChatbarContextProps & Pick<React.HTMLProps<HTMLDivElement>, 'children'>

const ChatbarContext = React.createContext<ChatbarContextProps | null>(null)

function useChatbar() {
  const context = React.useContext(ChatbarContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatbarProvider.')
  }

  return context
}

function ChatbarProvider({ children, ...props }: ChatbarProviderProps) {
  return <ChatbarContext.Provider value={props}>{children}</ChatbarContext.Provider>
}
export { useChatbar, ChatbarProvider }
