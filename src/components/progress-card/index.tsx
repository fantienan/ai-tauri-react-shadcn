import { StopIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export const ProgressCard = ({ value = 0 }: { value?: number }) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Progress className="animate-pulse" value={value} />
        <Button
          data-testid="stop-button"
          className="rounded-full w-8 h-8 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault()
            stop()
          }}
        >
          <StopIcon size={14} />
        </Button>
      </CardContent>
    </Card>
  )
}
