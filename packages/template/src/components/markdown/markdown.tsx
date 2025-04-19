// import '@wooorm/starry-night/style/both.css'
import 'github-markdown-css/github-markdown.css'
import { cn } from '@/lib/utils'
import { common } from '@wooorm/starry-night'
import tsx from '@wooorm/starry-night/source.tsx'
import { createRef, memo } from 'react'
import { MarkdownHooks } from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStarryNight from 'rehype-starry-night' // 使用 rehype-starry-night 插件
import remarkGfm from 'remark-gfm'

const remarkPlugins = [remarkGfm]

const rehypePlugins = [
  rehypeSanitize,
  () => rehypeStarryNight({ grammars: [...common, tsx], allowMissingScopes: true }),
]

const NonMemoizedMarkdown = ({
  children,
  inline,
  className: propClassName,
}: { children: string; inline?: boolean; className?: string }) => {
  if (inline) return <pre>{children}</pre>

  return (
    <div className={cn('markdown-body', propClassName)}>
      <MarkdownHooks
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          pre: ({ children: c, node, className, ...props }) => {
            const ref = createRef<HTMLPreElement>()
            const code = node?.children[0] as any
            let language = 'text'
            if (code?.properties?.className) {
              const codeClassName = code.properties.className.find((v: string) => /language-(\w+)/.exec(v))
              const match = /language-(\w+)/.exec(codeClassName || '')
              language = match ? match[1] : 'text'
            }

            return (
              <pre
                {...props}
                ref={ref}
                className={cn(
                  className,
                  'border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 my-4 overflow-x-auto',
                )}
              >
                {c}
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

export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => {
  if (prevProps.children !== nextProps.children) return false
  if (prevProps.className !== nextProps.className) return false
  if (prevProps.inline !== nextProps.inline) return false
  return true
})
