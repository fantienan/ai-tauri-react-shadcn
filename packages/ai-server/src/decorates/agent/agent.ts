import { createSqliteTools } from './tools/index.ts'
import type { CreateToolParams } from './types.ts'
import * as utils from './utils/index.ts'

export class Agent {
  utils: typeof utils
  constructor() {
    this.utils = utils
  }
  createTools(params: CreateToolParams) {
    return createSqliteTools(params)
  }
}
