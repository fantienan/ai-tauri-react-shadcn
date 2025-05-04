import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { AnalyzeResultSchema } from 'common/utils'
import { memo } from 'react'

type ListItem = {
  id: string
  className?: string
  avatar?: {
    src?: string
    title: React.ReactNode
    alt?: string
    className?: string
  }
  title?: React.ReactNode
  description?: React.ReactNode
  suffix?: React.ReactNode
}

export type ListProps = Omit<AnalyzeResultSchema, 'chartType' | 'data'> & { className?: string; data: ListItem[] }

function PureList({ data, className }: ListProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {data.map(({ id, avatar, className, title, description, suffix }) => (
        <div key={id} className={cn('flex items-center', className)}>
          {!!avatar && (
            <Avatar className={cn('h-9 w-9', avatar.className)}>
              <AvatarImage src={avatar.src} alt={avatar.alt} />
              <AvatarFallback>{avatar.title}</AvatarFallback>
            </Avatar>
          )}
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="ml-auto font-medium">{suffix}</div>
        </div>
      ))}
    </div>
  )
}
export const List = memo(PureList, (prevProps, nextProps) => {
  if (prevProps.data !== nextProps.data) return false
  if (prevProps.className !== nextProps.className) return false
  if (prevProps.title !== nextProps.title) return false
  if (prevProps.footer !== nextProps.footer) return false
  return true
})
