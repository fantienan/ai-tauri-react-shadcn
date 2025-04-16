import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import RehypeSanitize from 'rehype-sanitize'
import RemarkGfm from 'remark-gfm'

interface MarkdownViewProps {
  content: string
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[RemarkGfm]}
        rehypePlugins={[RehypeSanitize]}
        children={content}
        components={{
          code({ className, children, ref, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match?.[1] || 'text'
            return (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={github}
                language={language}
                PreTag="div"
              />
            )
          },
        }}
      />
    </div>
  )
}

export default MarkdownView
