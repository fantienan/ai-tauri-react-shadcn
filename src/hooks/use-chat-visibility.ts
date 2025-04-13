import { type ChatHistory, getChatHistoryPaginationKey } from '@/components/sidebar-history'
import { updateChatVisibility } from '@/services'
import { ChatVisibilityType } from '@/types'
import { llmUrl } from '@/utils'
import { useMemo } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string
  initialVisibility: ChatVisibilityType
}) {
  const { mutate, cache } = useSWRConfig()
  const history: ChatHistory = cache.get(`${llmUrl}/chat/history`)?.data

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(`${chatId}-visibility`, null, {
    fallbackData: initialVisibility,
  })

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility
    const chat = history.chats.find((chat) => chat.id === chatId)
    if (!chat) return 'private'
    return chat.visibility
  }, [history, chatId, localVisibility])

  const setVisibilityType = (updatedVisibilityType: ChatVisibilityType) => {
    setLocalVisibility(updatedVisibilityType)
    mutate(unstable_serialize(getChatHistoryPaginationKey))
    updateChatVisibility({ id: chatId, visibility: updatedVisibilityType })
  }

  return { visibilityType, setVisibilityType }
}
