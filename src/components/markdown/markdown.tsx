// import '@wooorm/starry-night/style/both.css'
import 'github-markdown-css/github-markdown.css'
import { cn } from '@/lib/utils'
import { memo } from 'react'
import { MarkdownHooks } from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStarryNight from 'rehype-starry-night' // 使用 rehype-starry-night 插件
import remarkGfm from 'remark-gfm'
import { CopyIcon } from '../icons'

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <div className="markdown-body">
      <MarkdownHooks
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeStarryNight]}
        components={{
          pre: ({ children, node, className, ...props }) => {
            const code = node?.children[0]
            if (!code || !(code as any).properties) return <pre {...props}>{children}</pre>
            const codeClassName = (code as any).properties.className.find((v: string) => /language-(\w+)/.exec(v))
            const match = /language-(\w+)/.exec(codeClassName || '')
            const language = match ? match[1] : 'text'
            return (
              <pre
                {...props}
                className={cn(
                  className,
                  'border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 my-4 overflow-x-auto',
                )}
              >
                <span className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{language}</span>
                  <span className="flex items-center gap-1">
                    <CopyIcon size={14} />
                    复制
                  </span>
                </span>
                {children}
              </pre>
            )
          },
        }}
      >
        {children}
      </MarkdownHooks>
    </div>
  )
}

export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children)
