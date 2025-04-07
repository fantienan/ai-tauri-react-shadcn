import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AnalyzeResult } from '@@/types/server'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

type ChartBarProps = { config?: ChartConfig } & Omit<AnalyzeResult, 'chartRendererType' | 'chartType'>

export function ChartBar({ config, data, title, description, summary }: ChartBarProps) {
  const chartConfig = {
    value: {
      //   label: 'Total Visitors',
      color: 'hsl(var(--chart-1))',
    },
    ...config,
  }
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
          <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {!!summary && <CardFooter className="flex-col items-start gap-2 text-sm">{summary}</CardFooter>}
    </Card>
  )
}
