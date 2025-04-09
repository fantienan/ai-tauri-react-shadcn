import { AppSidebar } from '@/components/app-sidebar'
import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DBMessage } from '@/types'
import { Attachment, UIMessage } from 'ai'
import { useLoaderData, useParams } from 'react-router'
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
