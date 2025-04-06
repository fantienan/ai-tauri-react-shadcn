import { Messages } from '@/components/messages'
import { MultimodalInput } from '@/components/multimodal-input'
import { Vote } from '@/types'
import { fetcher } from '@/utils'
import { useChat } from '@ai-sdk/react'
import { Attachment, UIMessage } from 'ai'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
// import { useSWRConfig } from 'swr'
import { v4 as uuidv4 } from 'uuid'
import { ChatHeader } from './chat-header'
// import { unstable_serialize } from 'swr/infinite';

interface ChatProps {
  id: string
  initialMessages: UIMessage[]
  isReadonly: boolean
}

export function Chat({ id, initialMessages, isReadonly }: ChatProps) {
  //   const { mutate } = useSWRConfig()
  const { messages, setMessages, handleSubmit, input, setInput, append, status, stop, reload } = useChat({
    id,
    api: `${import.meta.env.BIZ_SERVER_URL}/llm/chat`,
    body: { id },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: uuidv4,
    onFinish: () => {
      //   mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: () => {
      toast.error('发生错误，请重试！')
    },
  })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const { data: votes } = useSWR<Vote[]>(messages.length >= 2 ? `/api/vote?chatId=${id}` : null, fetcher)
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Messages
        chatId={id}
        status={status}
        votes={[]}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={isReadonly}
      />
      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        {!isReadonly && (
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        )}
      </form>
    </div>
  )
}
