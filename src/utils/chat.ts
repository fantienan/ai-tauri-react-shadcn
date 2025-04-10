import type { DBMessage } from '@/types'
import type { Attachment, UIMessage } from 'ai'

export function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role as UIMessage['role'],
    content: '',
    createdAt: new Date(message.createdAt),
    experimental_attachments: (message.attachments as Attachment[]) ?? [],
  }))
}
