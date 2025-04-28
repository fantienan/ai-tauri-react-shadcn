import type { PageConfig } from '@/types'

export const defaultPageConfig: PageConfig = {
  components: [
    {
      id: 'chart',
      type: 'chart',
      dataSource: [],
      chartType: 'bar',
      title: '',
      description: '',
      summary: '',
    },
  ],
}
