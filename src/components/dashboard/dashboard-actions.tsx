import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useArtifact } from '@/hooks/use-artifact'
import { Download, Gauge, Share, Upload } from 'lucide-react'
import { memo } from 'react'
import { toast } from 'sonner'
import { useChatbar } from '../chat/chat-provider'

const PureDashboardActions = ({
  chatId,
  messageId,
  showDownload,
  showPreview,
  showShare,
}: { chatId: string; messageId: string; showShare?: boolean; showPreview?: boolean; showDownload?: boolean }) => {
  const { onDownloadCode } = useChatbar()
  const { setArtifact } = useArtifact()

  if (!showDownload && !showPreview && !showShare) return null

  return (
    <div className="flex gap-1 justify-end">
      {showShare && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="dashboard-share"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="ghost"
              size="icon"
              onClick={() => {}}
            >
              <Upload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>分享</TooltipContent>
        </Tooltip>
      )}

      {showPreview && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="dashboard-preview"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
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
                  paramater: { chatId, messageId },
                })
              }}
            >
              <Gauge />
            </Button>
          </TooltipTrigger>
          <TooltipContent>预览</TooltipContent>
        </Tooltip>
      )}
      {showDownload && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="dashboard-download"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="ghost"
              size="icon"
              onClick={async () => {
                const download = onDownloadCode({ chatId, messageId })
                toast.promise(download, {
                  loading: '下载...',
                  success: () => '下载成功！',
                  error: (e) => (e instanceof Error ? e.message : typeof e === 'string' ? e : '下载失败'),
                })
              }}
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>下载</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export const DashboardActions = memo(PureDashboardActions, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false
  if (prevProps.messageId !== nextProps.messageId) return false
  if (prevProps.showDownload !== nextProps.showDownload) return false
  if (prevProps.showPreview !== nextProps.showPreview) return false
  if (prevProps.showShare !== nextProps.showShare) return false

  return true
})
