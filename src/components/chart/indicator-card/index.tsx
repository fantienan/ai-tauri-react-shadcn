import { Card } from '@/components/ui/card'
import { AnalyzeResultWithIndicatorCardSchema } from '@/types'
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

const PureIndicatorCards = ({ configs }: { configs: IndicatorCardProps[] }) => {
  return configs.map(({ data, title }) => (
    <div key={title.value} className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 ">
      <IndicatorCard title={title} data={data} />
    </div>
  ))
}

export const IndicatorCards = memo(PureIndicatorCards, (prevProps, nextProps) => {
  if (prevProps.configs !== nextProps.configs) return false
  return true
})
