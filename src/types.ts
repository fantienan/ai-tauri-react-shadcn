import * as DatabaseSchema from '@@/server/database/schema'

export type ChatVisibilityType = DatabaseSchema.Chat['visibility']

export type User = DatabaseSchema.User

export type Chat = DatabaseSchema.Chat
export type DBMessage = DatabaseSchema.DBMessage
export type Vote = DatabaseSchema.Vote
