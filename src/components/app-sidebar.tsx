import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { useAppStore } from '@/stores'
import { useNavigate } from 'react-router'
import { SidebarHistory } from './sidebar-history'
import { SidebarUserNav } from './sidebar-user-nav'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const user = useAppStore().session.user
  const onClick = () => {
    setOpenMobile(false)
    navigate('/')
  }

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <div onClick={onClick} className="flex flex-row gap-3 items-center">
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">Chatbot</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" type="button" className="p-2 h-fit" onClick={onClick}>
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">新聊天</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{/* <SidebarHistory user={user} /> */}</SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
