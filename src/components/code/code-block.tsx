import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
interface CodeBlockProps {
  node: any
  inline: boolean
  className: string
  children: any
}

export function CodeBlock(props: CodeBlockProps) {
  const { node, inline, className, children, ...p } = props
  if (!inline) {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    return (
      <div className="not-prose flex flex-col">
        <SyntaxHighlighter
          {...p}
          children={String(children).replace(/\n$/, '')}
          language={language}
          PreTag="div"
          style={{}}
          //   className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
        />
      </div>
    )
  } else {
    return (
      <code className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`} {...p}>
        {children}
      </code>
    )
  }
}
