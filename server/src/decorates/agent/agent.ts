import { wrapLanguageModel } from 'ai'
import type { LanguageModelV1Middleware, ToolSet } from 'ai'
import { LLMProvider } from './llm-provider/llm-provider.ts'
import { llmCacheMiddleware } from './middlewares/index.ts'
import * as tools from './tools/index.ts'
import * as utils from './utils.ts'

export class Agent {
  llmProvider: InstanceType<typeof LLMProvider>
  tools: ToolSet
  utils: typeof utils
  middleware: LanguageModelV1Middleware[]
  constructor() {
    this.llmProvider = new LLMProvider()
    this.tools = tools
    this.utils = utils
    this.middleware = [llmCacheMiddleware]
  }

  wrappedLanguageModel() {
    return wrapLanguageModel({
      model: this.llmProvider.registry.languageModel('deepseek:deepseek-chat'),
      middleware: this.middleware,
    })
  }
}
