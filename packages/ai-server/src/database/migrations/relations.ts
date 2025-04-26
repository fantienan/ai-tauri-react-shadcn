import { relations } from 'drizzle-orm/relations'
import { chat, message, user, vote } from './schema.ts'

export const voteRelations = relations(vote, ({ one }) => ({
  message: one(message, {
    fields: [vote.messageId],
    references: [message.id],
  }),
  chat: one(chat, {
    fields: [vote.chatId],
    references: [chat.id],
  }),
}))

export const messageRelations = relations(message, ({ one, many }) => ({
  votes: many(vote),
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}))

export const chatRelations = relations(chat, ({ one, many }) => ({
  votes: many(vote),
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  messages: many(message),
}))

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
}))
