import { createProviderRegistry, wrapLanguageModel } from 'ai';
import { LLMProvider } from './llm-provider/llm-provider.ts';
import * as tools from './tools/index.ts';
import * as utils from './utils.ts';
import { g2Chart } from './chart/index.ts';
import { llmCacheMiddleware } from './middlewares/index.ts';
import type { LanguageModelV1Middleware, ToolSet } from 'ai';

export class Agent {
  llmProvider: InstanceType<typeof LLMProvider>;
  tools: ToolSet;
  utils: typeof utils;
  g2Chart: typeof g2Chart;
  middleware: LanguageModelV1Middleware[];
  constructor() {
    this.llmProvider = new LLMProvider();
    this.tools = tools;
    this.utils = utils;
    this.g2Chart = g2Chart;
    this.middleware = [llmCacheMiddleware];
  }

  wrappedLanguageModel() {
    return wrapLanguageModel({
      model: this.llmProvider.registry.languageModel('deepseek:deepseek-chat'),
      middleware: this.middleware,
    });
  }
}
