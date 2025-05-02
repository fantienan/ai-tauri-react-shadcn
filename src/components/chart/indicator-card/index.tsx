import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyzeResult } from 'common/types'
import { z } from 'zod'

export type IndicatorProps = z.infer<typeof dashb>
export const IndicatorCard = ({ title, data, description, summary }: IndicatorProps) => {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00</CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm"></CardFooter>
    </Card>
  )
}
