import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { AnalyzeResultWithChartSchema } from '@/types'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Pie, PieChart, XAxis } from 'recharts'
import { CardFooterRenderer, CardHeaderRenderer, useChartUtils } from '../utils'

export function Recharts(props: AnalyzeResultWithChartSchema & { className?: string }) {
  const { className, chartType = 'bar', title, data, footer, ...config } = props
  const {
    chartConfig,
    valueFieldnames,
    nameFieldnames: [nameFieldname],
  } = useChartUtils({ config, data })

  return (
    <Card className={className}>
      <CardHeaderRenderer {...title} />

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
      {!!footer && <CardFooterRenderer {...footer} />}
    </Card>
  )
}
