import { AppSidebar } from '@/components/app-sidebar'
import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
console.log(import.meta.env.BIZ_SERVER_URL)

export default function Page() {
  const { id = uuidv4() } = useParams<{ id: string }>() ?? {}
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Chat id={id} key={id} initialMessages={[]} isReadonly={false} />
      </SidebarInset>
    </SidebarProvider>
  )
}
