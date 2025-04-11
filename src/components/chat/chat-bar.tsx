import { AppSidebar } from '@/components/app-sidebar'
import { Chat, ChatProps } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export const ChatBar = ({
  className,
  showFooter,
  ...props
}: ChatProps & { className?: string; showFooter?: boolean }) => {
  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar showFooter={showFooter} />
      <SidebarInset>
        <Chat {...props} key={props.id} />
      </SidebarInset>
    </SidebarProvider>
  )
}
