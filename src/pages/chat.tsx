import { AppSidebar } from '@/components/app-sidebar'
import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DBMessage } from '@/types'
import { fetcher } from '@/utils'
import { Attachment, UIMessage } from 'ai'
import { useLoaderData, useParams } from 'react-router'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role as UIMessage['role'],
    content: '',
    createdAt: new Date(message.createdAt),
    experimental_attachments: (message.attachments as Attachment[]) ?? [],
  }))
}

export const chatLoader = async ({ params }: { params: { id?: string } }) => {
  if (params.id) {
    const result = await fetcher(`/llm/message/queryByChatId?chatId=${params.id}`).catch(() => {
      return { success: false, message: '获取消息失败', data: [] }
    })
    if (!result.success || !Array.isArray(result.data)) {
      toast.error(result.message)
    } else {
      return { initialMessages: result.data }
    }
  }
  return { initialMessages: [] }
}

export default function Page() {
  const { id = uuidv4() } = useParams<{ id: string }>() ?? {}
  const { initialMessages = [] } = useLoaderData<{ initialMessages: DBMessage[] }>() ?? {}

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Chat id={id} key={id} initialMessages={convertToUIMessages(initialMessages)} isReadonly={false} />
      </SidebarInset>
    </SidebarProvider>
  )
}
