import { fetcherWithResult } from '@/utils'
import { llm, user } from '@@/server/schemas'
import { z } from 'zod'
import type { Chat, User } from './types'

export async function updateChatVisibility(params: Pick<z.infer<typeof llm.chat.update>, 'id' | 'visibility'>) {
  return await fetcherWithResult<Chat>(`/llm/chat/update`, { method: 'POST', body: JSON.stringify(params) })
}

export async function getUserInfo(params: z.infer<typeof user.queryById>) {
  return await fetcherWithResult<User>(`/user/queryById`, { method: 'POST', body: JSON.stringify(params) })
}
