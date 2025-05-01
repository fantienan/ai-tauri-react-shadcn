import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AnalyzeResult } from '@/types'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

type RechartsProps = Omit<AnalyzeResult, 'chartRendererType'>

export function Recharts({ chartType = 'bar', title, description, summary, data, ...config }: RechartsProps) {
  const {
    chartConfig,
    valueFieldnames,
    nameFieldnames: [nameFieldname],
  } = useMemo(() => {
    return Object.keys(data[0]).reduce(
      (prev, key) => {
        const value = data[0][key]
        if (Number.isFinite(value)) {
          prev.valueFieldnames.push(key)
          prev.chartConfig[key] = {
            color: `hsl(var(--chart-${prev.valueFieldnames.length}))`,
          }
        } else {
          prev.nameFieldnames.push(key)
        }
        return prev
      },
      { nameFieldnames: [], valueFieldnames: [], chartConfig: { ...config } } as {
        chartConfig: ChartConfig
        nameFieldnames: string[]
        valueFieldnames: string[]
      },
    )
  }, [data])

  const render = () => {
    if (chartType === 'indicator-card') {
      return null
    }
    return (
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
    )
  }
  return (
    <Card>
      {!!title && !!description && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      {render()}
      {!!summary && <CardFooter className="flex-col items-start gap-2 text-sm">{summary}</CardFooter>}
    </Card>
  )
}
