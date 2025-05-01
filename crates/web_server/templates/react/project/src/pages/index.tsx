// import { Markdown } from '@/components/markdown'
// import { Recharts } from '@/components/recharts'
// import { PageConfig } from '@/types'
// import { fetcher, defaultPageConfig } from '@/utils'
// import useSWR from 'swr'

export default function IndexPage() {
  //   const { data } = useSWR<PageConfig>('app.json', fetcher, { fallbackData: defaultPageConfig })
  return (
    <div className="overflow-hidden w-dvw h-dvh justify-center flex">
      <div className="w-200 flex flex-col gap-4">
        {/* <Recharts {...data!.chartSpec!} />
        <Markdown>{data!.summary}</Markdown> */}
      </div>
    </div>
  )
}
