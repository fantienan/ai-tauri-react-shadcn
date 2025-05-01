import { CopyIcon, DownloadIcon, ThumbDownIcon, ThumbUpIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useArtifact } from '@/hooks/use-artifact'
import { BASE_URL } from '@/lib/constant'
import type { Vote } from '@/types'
import { fetcher } from '@/utils'
import type { Message } from 'ai'
import equal from 'fast-deep-equal'
import { Gauge } from 'lucide-react'
import { memo } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { useCopyToClipboard } from 'usehooks-ts'
import { useChatbar } from '../chat/chat-provider'

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
  //   showCode,
  showDownload,
  showDashboard,
}: {
  chatId: string
  message: Message
  vote: Vote | undefined
  isLoading: boolean
  showDownload?: boolean
  showCode?: boolean
  showDashboard?: boolean
}) {
  const { mutate } = useSWRConfig()
  const [, copyToClipboard] = useCopyToClipboard()
  const { setArtifact } = useArtifact()
  const { onDownloadCode } = useChatbar()

  if (isLoading) return null
  if (message.role === 'user') return null

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  ?.filter((part) => part.type === 'text')
                  .map((part) => part.text)
                  .join('\n')
                  .trim()

                if (!textFromParts) {
                  toast.error('没有要复制的文本！')
                  return
                }

                await copyToClipboard(textFromParts)
                toast.success('已复制到剪贴板！')
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>复制</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-upvote"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const upvote = fetcher(`/llm/vote?chatId=${chatId}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ chatId, messageId: message.id, isUpvoted: true }),
                })

                toast.promise(upvote, {
                  loading: '点赞回复...',
                  success: () => {
                    mutate<Vote[]>(
                      `${BASE_URL}/llm/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter((vote) => vote.messageId !== message.id)

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ]
                      },
                      { revalidate: false },
                    )

                    return '赞同的回应！'
                  },
                  error: '未能赞同回复',
                })
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>点赞回复</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-downvote"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const downvote = fetcher(`/llm/vote?chatId=${chatId}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ chatId, messageId: message.id, isUpvoted: false }),
                })

                toast.promise(downvote, {
                  loading: '反对回应...',
                  success: () => {
                    mutate<Vote[]>(
                      `${BASE_URL}/llm/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter((vote) => vote.messageId !== message.id)

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ]
                      },
                      { revalidate: false },
                    )

                    return '被否决的回应！'
                  },
                  error: '无法否决回应。',
                })
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>反对回应</TooltipContent>
        </Tooltip>
        {showDownload && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-download"
                className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
                variant="outline"
                onClick={async () => {
                  const download = onDownloadCode({ chatId, messageId: message.id })
                  toast.promise(download, {
                    loading: '下载...',
                    success: () => '下载成功！',
                    error: (e) => (e instanceof Error ? e.message : typeof e === 'string' ? e : '下载失败'),
                  })
                }}
              >
                <DownloadIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>下载</TooltipContent>
          </Tooltip>
        )}

        {/* {showCode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-code"
                className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
                variant="outline"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  const boundingBox = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                  }
                  setArtifact({
                    documentId: 'a',
                    kind: '',
                    content: '',
                    title: '',
                    isVisible: true,
                    status: 'idle',
                    boundingBox,
                  })
                }}
              >
                <CodeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>代码</TooltipContent>
          </Tooltip>
        )} */}
        {showDashboard && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-dashboard"
                className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
                variant="outline"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  debugger
                  setArtifact({
                    kind: 'dashboard',
                    title: '仪表盘',
                    isVisible: true,
                    status: 'idle',
                    boundingBox: {
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                    },
                    paramater: { chatId, messageId: message.id },
                  })
                }}
              >
                <Gauge />
              </Button>
            </TooltipTrigger>
            <TooltipContent>仪表盘</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

export const MessageActions = memo(PureMessageActions, (prevProps, nextProps) => {
  if (!equal(prevProps.vote, nextProps.vote)) return false
  if (prevProps.isLoading !== nextProps.isLoading) return false

  return true
})
