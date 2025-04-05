import { ChartOptions } from 'react-charts'
import { Chart } from 'react-charts'
import ResizableBox from './resizable-box'

export const ReactCharts = ({
  options,
}: { options: Partial<Omit<ChartOptions<any>, 'data'>> & Pick<ChartOptions<any>, 'data'> }) => {
  return (
    <ResizableBox>
      <Chart
        options={{
          primaryAxis: { getValue: (datum) => datum.name },
          secondaryAxes: [{ getValue: (datum) => datum.value }],
          ...options,
        }}
      />
    </ResizableBox>
  )
}
