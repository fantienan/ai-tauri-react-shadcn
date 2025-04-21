import contentDisposition from 'content-disposition'

export const contentDispositionParser = (content?: string | null) => {
  if (!content) return
  return contentDisposition.parse(content)
}
