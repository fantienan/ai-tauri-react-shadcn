import { fetcher } from '@/utils'
import { llm, user } from '@@/server/schemas'
import { z } from 'zod'
import type { Chat, User } from './types'

export async function updateChatVisibility(params: Pick<z.infer<typeof llm.chat.update>, 'id' | 'visibility'>) {
  return fetcher<Chat>(`/llm/chat/update`, { method: 'POST', body: JSON.stringify(params) })
}

export async function getUserInfo(params: z.infer<typeof user.queryById>) {
  return fetcher<User>(`/user/queryById`, { method: 'POST', body: JSON.stringify(params) })
}
