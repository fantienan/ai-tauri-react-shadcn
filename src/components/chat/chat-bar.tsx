import { AppSidebar } from '@/components/app-sidebar'
import { Chat, ChatProps } from '@/components/chat'
import { SidebarInset, SidebarProvider, type SidebarProviderProps } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { ChatProvider } from './chat-provider'

export const ChatBar = ({
  className,
  showFooter,
  defaultOpen,
  onNewChat,
  ...props
}: ChatProps & Pick<SidebarProviderProps, 'className' | 'defaultOpen' | 'onNewChat' | 'showFooter'>) => {
  return (
    <SidebarProvider showFooter={showFooter} onNewChat={onNewChat} defaultOpen={defaultOpen} className={cn(className)}>
      <AppSidebar />
      <SidebarInset>
        <ChatProvider onNewChat={onNewChat}>
          <Chat {...props} key={props.id} />
        </ChatProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
