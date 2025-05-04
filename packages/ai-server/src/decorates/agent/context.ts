import type { DataStreamWriter } from 'ai'
import type { DashboardSchema } from 'common/utils'
import { v4 as uuidv4 } from 'uuid'

export type ChatContextInstance = InstanceType<typeof ChatContext>

export class ChatContext {
  dashboardSchema?: DashboardSchema
  dataStream: DataStreamWriter
  isCreateDashboard?: boolean
  constructor(props: { dataStream: DataStreamWriter; isCreateDashboard?: boolean }) {
    this.dataStream = props.dataStream
    this.isCreateDashboard = props.isCreateDashboard
  }
  genUUID() {
    return uuidv4()
  }
}
