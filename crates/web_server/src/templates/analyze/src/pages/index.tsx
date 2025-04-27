import { Markdown } from '@/components/markdown'
import { Recharts } from '@/components/recharts'
import { AppSpec } from '@/types'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export default function IndexPage() {
  const { data } = useSWR<AppSpec>('app.json', fetcher, {
    fallbackData: {
      summary: '',
      chartSpec: {
        data: [],
        chartType: 'bar',
        title: '',
        description: '',
        summary: '',
      },
    },
  })
  return (
    <div className="overflow-hidden w-dvw h-dvh justify-center flex">
      <div className="w-200 flex flex-col gap-4">
        <Recharts {...data!.chartSpec!} />
        <Markdown>{data!.summary}</Markdown>
      </div>
    </div>
  )
}
