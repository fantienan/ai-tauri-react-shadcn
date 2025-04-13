import { AppStoreActions, ThemeStoreProps } from '@/stores'
import type { User } from '@/types'
import React from 'react'

export type ChatbarContextProps = Pick<ThemeStoreProps, 'theme' | 'setTheme'> &
  Pick<AppStoreActions, 'signOut'> & {
    user?: User
    chatId?: string
    onNewChat?: () => void
    onDeleteChat?: (params: { chatId: string }) => void
    onOpenHistoryChat?: (params: { chatId: string }) => void
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
