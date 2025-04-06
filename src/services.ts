import { fetcher } from '@/utils'
import { llm, user } from '@@/server/schemas'
import type { BizResult } from 'types'
import { z } from 'zod'
import type { Chat, User } from './types'

const baseUrl = import.meta.env.BIZ_SERVER_URL
const chatUrl = `${baseUrl}/llm/chat`
const userUrl = `${baseUrl}/user`

export async function updateChatVisibility(params: Pick<z.infer<typeof llm.chat.update>, 'id' | 'visibility'>) {
  return await fetcher<BizResult<Chat>>(`${chatUrl}/update`, { method: 'POST', body: JSON.stringify(params) })
}

export async function getUserInfo(params: z.infer<typeof user.queryById>) {
  return await fetcher<BizResult<User>>(`${userUrl}/queryById`, { method: 'POST', body: JSON.stringify(params) })
}
