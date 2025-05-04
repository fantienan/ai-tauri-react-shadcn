import { Greeting } from '@/components/greeting'
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import equal from 'fast-deep-equal'
import { type ComponentProps, memo, useMemo } from 'react'
import { PreviewMessage, ThinkingMessage } from './message'

interface MessagesProps {
  chatId: string
  stop: () => void
  status: UseChatHelpers['status']
  votes: any[] | undefined
  messages: UIMessage[]
  setMessages: UseChatHelpers['setMessages']
  reload: UseChatHelpers['reload']
  isReadonly: boolean
}

function PreviewMessageWrap(props: ComponentProps<typeof PreviewMessage>) {
  const messageActions = useMemo(() => {
    return props.message.parts?.reduce(
      (prev, part) => {
        if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'sqliteAnalyze') {
          prev.showCode = true
          prev.showDownload = true
          prev.showDashboard = true
        }
        return prev
      },
      {} as { showCode?: boolean; showDownload?: boolean; showDashboard?: boolean },
    )
  }, [props.message])
  return <PreviewMessage {...props} {...messageActions} />
}

function PureMessages({ stop, chatId, status, votes, messages, setMessages, reload, isReadonly }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>({ status })

  return (
    <div ref={messagesContainerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <PreviewMessageWrap
          stop={stop}
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {status === 'submitted' && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <ThinkingMessage />
      )}

      <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.status && nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.messages, nextProps.messages)) return false
  if (!equal(prevProps.votes, nextProps.votes)) return false
  if (prevProps.stop !== nextProps.stop) return false

  return true
})
