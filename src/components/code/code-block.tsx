import { Markdown } from '@/components/markdown'
import { memo } from 'react'

interface CodeBlockProps {
  className: string
  children: string
}

export function PureCodeBlock(props: CodeBlockProps) {
  return <Markdown {...props} />
}

function areEqual(prevProps: CodeBlockProps, nextProps: CodeBlockProps) {
  if (prevProps.className !== nextProps.className) return false
  if (prevProps.children !== nextProps.children) return false

  return true
}

export const CodeBlock = memo(PureCodeBlock, areEqual)
