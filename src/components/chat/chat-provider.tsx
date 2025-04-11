import React from 'react'

export interface ChatContextProps {
  onNewChat: () => void
}

export type ChatProviderProps = Pick<ChatContextProps, 'onNewChat'> & Pick<React.HTMLProps<HTMLDivElement>, 'children'>

const ChatContext = React.createContext<ChatContextProps | null>(null)

function useChatContext() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider.')
  }

  return context
}

function ChatProvider({ children, ...props }: ChatProviderProps) {
  return <ChatContext.Provider value={props}>{children}</ChatContext.Provider>
}
export { useChatContext, ChatProvider }
