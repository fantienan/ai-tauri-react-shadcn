import { BASE_URL } from '@/lib/constant'
import { BizResult } from '@/types'

// 函数重载声明
export function fetcher<T>(input: RequestInfo | URL, init?: RequestInit & { response: true }): Promise<Response>
export function fetcher<T>(input: RequestInfo | URL, init?: RequestInit): Promise<BizResult<T>>

export async function fetcher<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { response?: true },
): Promise<Response | BizResult<T>> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  let i = input
  if (typeof input === 'string' && !input.startsWith('http')) i = `${BASE_URL}${input}`
  const res = await fetch(i, { ...init, headers })

  if (init?.response === true) {
    return res
  }
  return res.json()
}
