import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { useNavigate } from 'react-router'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const onClick = () => {
    setOpenMobile(false)
    navigate('/chat')
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
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
    </Sidebar>
  )
}
