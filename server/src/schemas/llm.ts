import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import * as schema from '../database/schema.ts'

export const llm = {
  chat: {
    self: z.object({
      id: z.string(),
      messages: z.any({ description: '消息列表' }),
    }),
    inster: createInsertSchema(schema.chat),
    queryById: z.object({
      id: z.string({ description: '聊天记录id' }),
    }),
  },
}
