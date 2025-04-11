import { ChatBar } from '@/components/chat/chat-bar'
import { useLoader } from '@/hooks/use-loader'
import { convertToUIMessages } from '@/utils'

export default function Page() {
  const { id, initialMessages } = useLoader()

  return <ChatBar showFooter isReadonly={false} id={id} initialMessages={convertToUIMessages(initialMessages)} />
}
