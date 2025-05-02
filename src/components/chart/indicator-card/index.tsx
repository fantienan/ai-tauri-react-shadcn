import { Card } from '@/components/ui/card'
import { AnalyzeResultSchema } from '@/types'
import { CardFooterRenderer, CardHeaderRenderer, useChartUtils } from '../utils'

export type IndicatorCardProps = Omit<Extract<AnalyzeResultSchema, { chartType: 'indicator-card' }>, 'chartType'>

export const IndicatorCard = ({ title, data, footer }: IndicatorCardProps) => {
  const { valueFieldnames } = useChartUtils({ data: [data] })
  return (
    <Card>
      <CardHeaderRenderer {...title} value={data[valueFieldnames[0]]} />
      {!!footer && <CardFooterRenderer {...footer} />}
    </Card>
  )
}

export const IndicatorCards = ({ configs }: { configs: IndicatorCardProps[] }) => {
  return configs.map(({ data, title }) => (
    <div
      key={title.value}
      className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6"
    >
      <IndicatorCard title={title} data={data} />
    </div>
  ))
}
