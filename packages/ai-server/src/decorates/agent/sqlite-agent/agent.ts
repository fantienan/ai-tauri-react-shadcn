import { CoreAssistantMessage, CoreToolMessage, StepResult, StreamTextOnStepFinishCallback } from 'ai'
import { CreateDashboardProgressSchema, DashboardSchema } from 'common/utils'
import { ChatContextInstance } from '../context.ts'
import { SQLiteAgentTool, createSqliteTools } from './tools.ts'

export type SQLiteAgentInstance = InstanceType<typeof SQLiteAgent>

export type SQLiteAgentToolResults = StepResult<SQLiteAgentTool>['toolResults']

export type SQLiteAgentProps = {
  chatContext: ChatContextInstance
}

export class SQLiteAgent {
  chatContext: ChatContextInstance<SQLiteAgentTool>
  constructor(props: SQLiteAgentProps) {
    this.chatContext = props.chatContext
  }

  createTools() {
    return createSqliteTools(this.chatContext)
  }

  async createDashboard({
    toolResults,
    messages,
  }: {
    toolResults: SQLiteAgentToolResults
    messages: ((CoreAssistantMessage | CoreToolMessage) & { id: string })[]
  }) {
    try {
      const dashboardSchema: DashboardSchema = {
        title: {
          value: 'Dashboard标题',
          description: 'Dashboard描述',
        },
        charts: [],
      }
      let internalToolResults = toolResults
      if (internalToolResults.length === 1) {
        internalToolResults = (messages.filter((v) => v.role === 'tool').at(-2)?.content as any) ?? []
      }

      dashboardSchema.charts = internalToolResults.reduce(
        (prev, curr) => {
          if (curr.toolName === 'sqliteAnalyze' && curr.result) prev.push(curr.result as any)
          return prev
        },
        [] as DashboardSchema['charts'],
      )
      return dashboardSchema
    } catch (e) {}
  }

  async onStepFinish({
    stepType,
    finishReason,
    toolResults,
    response,
  }: Parameters<StreamTextOnStepFinishCallback<SQLiteAgentTool>>[0]) {
    if (
      this.chatContext.isCreateDashboard &&
      stepType === 'tool-result' &&
      finishReason === 'tool-calls' &&
      toolResults.length
    ) {
      const dashboardGenerationCompleted = toolResults.some(
        (v) => v.toolName === 'generateDashboardsBasedOnDataAnalysisResults' && v.result.state === 'end',
      )
      const progress = toolResults.at(-1)?.result.progress as CreateDashboardProgressSchema
      if (progress && progress.current === progress.total) this.chatContext.setToolResults(toolResults)
      if (dashboardGenerationCompleted) {
        this.chatContext.dashboardSchema = await this.createDashboard({
          toolResults,
          messages: response.messages,
        })
      }
    }
  }
}
