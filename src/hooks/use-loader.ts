import type { DBMessage } from '@/types'
import { useLoaderData, useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

export const useLoader = () => {
  const { id = uuidv4() } = useParams<{ id: string }>() ?? {}
  const { initialMessages = [] } = useLoaderData<{ initialMessages: DBMessage[] }>() ?? {}
  return { id, initialMessages }
}
