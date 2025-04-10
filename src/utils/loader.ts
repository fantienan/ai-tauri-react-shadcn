import { fetcher } from '@/utils'
import { toast } from 'sonner'

export const chatLoader = async ({ params }: { params: { id?: string } }) => {
  if (params.id) {
    const result = await fetcher(`/llm/message/queryByChatId?chatId=${params.id}`).catch(() => {
      return { success: false, message: '获取消息失败', data: [] }
    })
    if (!result.success || !Array.isArray(result.data)) {
      toast.error(result.message)
    } else {
      return { initialMessages: result.data }
    }
  }
  return { initialMessages: [] }
}
