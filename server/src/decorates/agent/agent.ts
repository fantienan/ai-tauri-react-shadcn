import type { ToolSet } from 'ai'
import * as tools from './tools/index.ts'
import * as utils from './utils/index.ts'

export class Agent {
  tools: ToolSet
  utils: typeof utils
  constructor() {
    this.tools = tools
    this.utils = utils
  }
}
