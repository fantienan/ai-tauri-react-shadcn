import type { ChartConfig } from '@/components/ui/chart'
import { useMemo } from 'react'

export const useChartUtils = ({ config, data }: { config: ChartConfig; data: Record<string, any>[] }) => {
  return useMemo(() => {
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
  }, [data, config])
}
