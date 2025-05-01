import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'
import type { Vote } from '@/types'
import { UseChatHelpers } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import equal from 'fast-deep-equal'
import { memo } from 'react'
import { PreviewMessage } from '../messages/message'
import { UIArtifact } from './artifact'

interface ArtifactMessagesProps {
  chatId: string
  status: UseChatHelpers['status']
  votes: Array<Vote> | undefined
  messages: Array<UIMessage>
  setMessages: UseChatHelpers['setMessages']
  reload: UseChatHelpers['reload']
  isReadonly: boolean
  artifactStatus: UIArtifact['status']
}

function PureArtifactMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: ArtifactMessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>({ status })

  return (
    <div
      ref={messagesContainerRef}
      className="artifact-message flex flex-col gap-4 h-full items-center overflow-y-scroll pt-10 "
    >
      {messages.map((message, index) => (
        <PreviewMessage
          chatId={chatId}
          key={message.id}
          message={message}
          isLoading={status === 'streaming' && index === messages.length - 1}
          vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          showCode={false}
          showDownload={false}
          showDashboard={false}
        />
      ))}

      <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  )
}

function areEqual(prevProps: ArtifactMessagesProps, nextProps: ArtifactMessagesProps) {
  if (prevProps.artifactStatus === 'streaming' && nextProps.artifactStatus === 'streaming') return true

  if (prevProps.status !== nextProps.status) return false
  if (prevProps.status && nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.votes, nextProps.votes)) return false

  return true
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual)
