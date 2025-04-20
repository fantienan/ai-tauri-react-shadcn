import * as DatabaseSchema from '@@/server/database/schema'

export type ChatVisibilityType = DatabaseSchema.Chat['visibility']

export type User = DatabaseSchema.User

export type Chat = DatabaseSchema.Chat
export type DBMessage = DatabaseSchema.DBMessage
export type Vote = DatabaseSchema.Vote

export type DownloadCodeParams = Pick<DBMessage, 'chatId'> & {
  messageId: DBMessage['id']
}

export type BizScope = {
  config: {
    SM_MAPBOX_TOKEN: string
    SM_GEOVIS_TOKEN: string
    SM_TIANDITU_TOKEN: string
    template_src_dir: string
  }
}
