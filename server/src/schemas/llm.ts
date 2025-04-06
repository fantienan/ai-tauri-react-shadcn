import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import * as schema from '../database/schema.ts'

export const llm = {
  chat: {
    self: z.object({
      id: z.string({ description: '聊天记录id' }),
      messages: z.any({ description: '消息列表' }),
    }),
    inster: createInsertSchema(schema.chat).omit({ id: true, createdAt: true }),
    update: createUpdateSchema(schema.chat).required({ id: true }),
    queryById: createSelectSchema(schema.chat).pick({ id: true }).required({ id: true }),
    history: createSelectSchema(schema.chat)
      .pick({ userId: true })
      .required({ userId: true })
      .and(z.object({ limit: z.number({ description: '数量' }).default(10) })),
  },
}
