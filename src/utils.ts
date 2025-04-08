import { BizResult } from '@@/types/server'

interface ApplicationError extends Error {
  info: string
  status: number
}

export const baseUrl = import.meta.env.BIZ_SERVER_URL
export const llmUrl = `${baseUrl}/llm`
export const chatUrl = `${llmUrl}/chat`
export const messageUrl = `${llmUrl}/message`

export const fetcher = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<BizResult<T>> => {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const res = await fetch(`${baseUrl}${input}`, { ...init, headers })

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as ApplicationError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}
