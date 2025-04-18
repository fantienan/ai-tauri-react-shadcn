import type { LanguageModelV1Middleware } from 'ai'

const cache = new Map<string, any>()

export const llmCacheMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params)

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const result = await doGenerate()

    cache.set(cacheKey, result)

    return result
  },
}
