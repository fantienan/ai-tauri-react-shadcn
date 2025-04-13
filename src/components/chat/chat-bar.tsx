import { AppSidebar } from '@/components/app-sidebar'
import { Chat, ChatProps } from '@/components/chat'
import { SidebarInset, SidebarProvider, type SidebarProviderProps } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { ChatbarProvider, ChatbarProviderProps } from './chat-provider'

export type ChatbarProps = ChatProps &
  Pick<SidebarProviderProps, 'className' | 'defaultOpen' | 'showFooter'> &
  ChatbarProviderProps

export const Chatbar = ({
  className,
  showFooter,
  defaultOpen,
  id,
  initialMessages,
  isReadonly,
  ...chatbarProviderProps
}: ChatbarProps) => {
  return (
    <ChatbarProvider chatId={id} {...chatbarProviderProps}>
      <SidebarProvider showFooter={showFooter} defaultOpen={defaultOpen} className={cn(className)}>
        <AppSidebar />
        <SidebarInset>
          <Chat initialMessages={initialMessages} isReadonly={isReadonly} id={id} key={id} />
        </SidebarInset>
      </SidebarProvider>
    </ChatbarProvider>
  )
}
