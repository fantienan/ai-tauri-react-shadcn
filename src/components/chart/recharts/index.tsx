import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AnalyzeResult } from '@/types'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Pie, PieChart, XAxis } from 'recharts'
import { IndicatorCard } from '../indicator-card'
import { useChartUtils } from './use-chart-utils'

type RechartsProps = Omit<AnalyzeResult, 'chartRendererType'>

export function Recharts(props: RechartsProps) {
  const { chartType = 'bar', title, description, summary, data, ...config } = props
  const {
    chartConfig,
    valueFieldnames,
    nameFieldnames: [nameFieldname],
  } = useChartUtils({ config, data })

  if (chartType === 'indicator-card')
    return <IndicatorCard data={data} title={title} description={description} summary={summary} />
  return (
    <Card>
      {!!title && !!description && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}

      <CardContent>
        <ChartContainer config={chartConfig}>
          {chartType === 'line' ? (
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={nameFieldname}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              {valueFieldnames.map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="natural"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey={valueFieldnames[0]} nameKey={nameFieldname} />
            </PieChart>
          ) : (
            <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={nameFieldname} tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              {valueFieldnames.map((key) => (
                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={8}>
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                </Bar>
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
      {!!summary && <CardFooter className="flex-col items-start gap-2 text-sm">{summary}</CardFooter>}
    </Card>
  )
}
