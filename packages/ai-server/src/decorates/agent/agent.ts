import { StepResult } from 'ai'
import { ChatContextInstance } from './context.ts'
import { createSqliteTools } from './tools/index.ts'
import * as utils from './utils/index.ts'

export type AgentInstance = InstanceType<typeof Agent>

export type AgentToolResults = StepResult<ReturnType<AgentInstance['createTools']>>['toolResults']

export class Agent {
  utils: typeof utils
  constructor() {
    this.utils = utils
  }
  createTools(context: ChatContextInstance) {
    return createSqliteTools(context)
  }
}
