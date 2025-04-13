import { Chatbar } from '@/components/chat/chat-bar'
import { useChatbarLoader } from '@/hooks/use-chatbar-loader'
import { Navigate, useNavigate, useParams } from 'react-router'

export default function Page() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { error, ...chatbarLoaderData } = useChatbarLoader({ chatId: id })
  if (error) return <Navigate replace to="/chat" />
  return (
    <Chatbar
      showFooter
      onDeleteChat={({ chatId }) => {
        if (chatbarLoaderData.id === chatId) navigate('/chat')
      }}
      onNewChat={() => navigate(`/chat`, { replace: true })}
      onOpenHistoryChat={({ chatId }) => navigate(`/chat/${chatId}`, { replace: true })}
      {...chatbarLoaderData}
    />
  )
}
