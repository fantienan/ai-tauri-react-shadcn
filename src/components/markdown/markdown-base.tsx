import markdownit from 'markdown-it'
import React from 'react'

const md = markdownit({ html: true, breaks: true })

interface MarkdownViewProps {
  content: string
}

const MarkdownBase: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </div>
  )
}

export default MarkdownBase
