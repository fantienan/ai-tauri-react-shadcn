import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AnalyzeResultWithIndicatorCardSchema } from '@/types'
import equal from 'fast-deep-equal'
import { memo } from 'react'
import { CardFooterRenderer, CardHeaderRenderer, useChartUtils } from '../utils'

export type IndicatorCardProps = Omit<AnalyzeResultWithIndicatorCardSchema, 'chartType'>

const PureIndicatorCard = ({ title, data, footer }: IndicatorCardProps) => {
  const { valueFieldnames } = useChartUtils({ data: [data] })
  return (
    <Card>
      <CardHeaderRenderer {...title} value={data[valueFieldnames[0]]} />
      {!!footer && <CardFooterRenderer {...footer} />}
    </Card>
  )
}

export const IndicatorCard = memo(PureIndicatorCard, (prevProps, nextProps) => {
  if (!equal(prevProps.title, nextProps.title)) return false
  if (!equal(prevProps.data, nextProps.data)) return false
  if (!equal(prevProps.footer, nextProps.footer)) return false
  return true
})

const PureIndicatorCards = ({ configs, className }: { configs: IndicatorCardProps[]; className?: string }) => {
  return configs.map(({ data, title }) => (
    <div
      key={title.value}
      className={cn('grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full', className)}
    >
      <IndicatorCard title={title} data={data} />
    </div>
  ))
}

export const IndicatorCards = memo(PureIndicatorCards, (prevProps, nextProps) => {
  if (prevProps.configs !== nextProps.configs) return false
  if (prevProps.className !== nextProps.className) return false
  return true
})
