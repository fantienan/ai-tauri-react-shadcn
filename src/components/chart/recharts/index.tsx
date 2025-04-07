import { ChartBar } from './bar'

interface RechartsProps {
  data: any[]
}

export const Recharts = ({ data }: RechartsProps) => {
  return <ChartBar data={data} />
}
