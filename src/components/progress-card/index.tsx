import { StopIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import clsx from 'clsx'
import { memo } from 'react'

export const PureProgressCard = ({
  stop,
  value = 0,
  className,
}: { value?: number; className?: string; stop: () => void }) => {
  return (
    <Card className={`${className} md:w-[340px] w-full py-4`}>
      <CardContent className="flex items-center gap-4">
        <Progress className={clsx({ 'animate-pulse': !value })} value={value} />
        <Button
          data-testid="stop-button"
          className="rounded-full w-7 h-7 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault()
            stop()
          }}
        >
          <StopIcon size={10} />
        </Button>
      </CardContent>
    </Card>
  )
}

export const ProgressCard = memo(PureProgressCard, (prevProps, nextProps) => {
  if (prevProps.value !== nextProps.value) return false
  return true
})
