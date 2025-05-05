import type { DataStreamWriter } from 'ai'
import type { DashboardSchema } from 'common/utils'
import { v4 as uuidv4 } from 'uuid'
import type { AgentToolResults } from './agent.ts'
import { generateDescriptionInformation, getDatabase } from './utils/index.ts'

export type ChatContextInstance = InstanceType<typeof ChatContext>

export type ChatContextProps = {
  dataStream: DataStreamWriter
  isCreateDashboard?: boolean
}
export class ChatContext {
  dashboardSchema?: DashboardSchema
  dataStream: DataStreamWriter
  isCreateDashboard?: boolean
  getDatabase = getDatabase
  private toolResults?: AgentToolResults
  constructor(props: ChatContextProps) {
    this.dataStream = props.dataStream
    this.isCreateDashboard = props.isCreateDashboard
  }
  genUUID() {
    return uuidv4()
  }

  setToolResults(toolResults?: AgentToolResults) {
    this.toolResults = toolResults
  }

  generateDescriptionInformation() {
    if (!this.toolResults) return
    const data = this.toolResults.map((v) => ({ title: v.result.title, footer: v.result.footer }))
    return generateDescriptionInformation({ data })
  }
  filterTables(result: { name: string }[]) {
    return result.filter((v) => v.name.startsWith('analyze_'))
  }
}
