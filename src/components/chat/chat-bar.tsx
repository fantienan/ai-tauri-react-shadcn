import { AppSidebar } from '@/components/app-sidebar'
import { Chat, ChatProps } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const ChatBar = (props: ChatProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Chat {...props} key={props.id} />
      </SidebarInset>
    </SidebarProvider>
  )
}
