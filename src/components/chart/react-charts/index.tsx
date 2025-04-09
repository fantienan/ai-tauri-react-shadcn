import { Chart } from 'react-charts'
import type { AnalyzeResult } from 'types'
import ResizableBox from './resizable-box'

export const ReactCharts = ({ options }: { options: Omit<AnalyzeResult, 'chartRendererType'> }) => {
  const { data } = options
  return (
    <ResizableBox>
      <Chart
        options={{
          primaryAxis: { getValue: (datum) => datum.name },
          secondaryAxes: [{ getValue: (datum) => datum.value }],
          data: [{ data }],
        }}
      />
    </ResizableBox>
  )
}
