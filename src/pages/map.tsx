import { Map } from '@/components/map-ui'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores'

export default function Page() {
  const setMap = useAppStore((state) => state.setMap)
  debugger
  return (
    <div className={cn('flex min-h-svh w-full')}>
      <Map dispatch={({ map }) => setMap(map)} />
    </div>
  )
}
