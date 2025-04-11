import { ChatBar } from '@/components/chat/chat-bar'
import { useLoader } from '@/hooks/use-loader'
import { convertToUIMessages } from '@/utils'
import { useNavigate } from 'react-router'

export default function Page() {
  const { id, initialMessages } = useLoader()

  const navigate = useNavigate()

  const onNewChat = () => {
    navigate(`/chat`, { replace: true })
  }

  return (
    <ChatBar
      onNewChat={onNewChat}
      showFooter
      isReadonly={false}
      id={id}
      initialMessages={convertToUIMessages(initialMessages)}
    />
  )
}
