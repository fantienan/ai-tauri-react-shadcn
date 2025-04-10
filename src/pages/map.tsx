import { ChatBar } from '@/components/chat/chat-bar'
import { Map } from '@/components/map-ui'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLoader } from '@/hooks/use-loader'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores'
import { convertToUIMessages } from '@/utils'
import { Bot } from 'lucide-react'

export default function Page() {
  const { id, initialMessages } = useLoader()
  const setMap = useAppStore((state) => state.setMap)

  return (
    <div className={cn('flex min-h-svh w-full')}>
      <Map dispatch={({ map }) => setMap(map)} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon" className="absolute bottom-10 right-10 rounded-full shadow-md">
            <Bot className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ChatBar isReadonly={false} id={id} initialMessages={convertToUIMessages(initialMessages)} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
