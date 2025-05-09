import { Button, ButtonProps } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useArtifact } from '@/hooks/use-artifact'
import { Item } from '@radix-ui/react-dropdown-menu'
import { Download, Gauge, Link } from 'lucide-react'
import { memo } from 'react'
import { toast } from 'sonner'
import { useChatbar } from '../chat/chat-provider'

type Option = {
  key: string
  label: string
  icon: React.ReactNode
  show?: boolean
  action: ButtonProps['onClick']
  renderItem?: (params: { option: Option; node: React.ReactNode }) => React.ReactNode
}

const PureDashboardActions = ({
  chatId,
  messageId,
  showDownload,
  showPreview,
  showShare,
  type,
}: {
  chatId: string
  messageId: string
  showShare?: boolean
  showPreview?: boolean
  showDownload?: boolean
  type?: 'label-icon' | 'icon'
}) => {
  const { onDownloadCode } = useChatbar()
  const { setArtifact } = useArtifact()

  if (!showDownload && !showPreview && !showShare) return null
  const options: Option[] = [
    {
      key: 'share-link',
      label: '共享链接',
      icon: <Link />,
      show: showShare,
      action: () => {},
      renderItem: ({ node }) => {
        return (
          <Popover>
            <PopoverTrigger asChild>{node}</PopoverTrigger>
            <PopoverContent className="w-80">
              <h4 className="font-medium leading-none">共享“{}”</h4>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Width</Label>
                    <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Max. width</Label>
                    <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height">Height</Label>
                    <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight">Max. height</Label>
                    <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      key: 'preview',
      label: '预览',
      icon: <Gauge />,
      show: showPreview,
      action: (event) => {
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
      },
    },
    {
      key: 'download',
      label: '下载',
      show: showDownload,
      icon: <Download />,
      action: async () => {
        const download = onDownloadCode({ chatId, messageId })
        toast.promise(download, {
          loading: '下载...',
          success: () => '下载成功！',
          error: (e) => (e instanceof Error ? e.message : typeof e === 'string' ? e : '下载失败'),
        })
      },
    },
  ]

  const render = (option: Option) => {
    if (!option.show) return null
    if (type === 'label-icon') {
      const node = (
        <Button className="gap-1" data-testid={option.key} onClick={option.action}>
          {option.icon}
          <span className="ml-1">{option.label}</span>
        </Button>
      )
      return option.renderItem?.({ option, node }) ?? node
    }
    return (
      <Tooltip key={option.key}>
        <TooltipTrigger asChild>
          <Button data-testid={option.key} variant="ghost" size="icon" onClick={option.action}>
            {option.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{option.label}</TooltipContent>
      </Tooltip>
    )
  }

  return <div className="flex gap-1 justify-end">{options.map(render)}</div>
}

export const DashboardActions = memo(PureDashboardActions, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false
  if (prevProps.messageId !== nextProps.messageId) return false
  if (prevProps.showDownload !== nextProps.showDownload) return false
  if (prevProps.showPreview !== nextProps.showPreview) return false
  if (prevProps.showShare !== nextProps.showShare) return false
  if (prevProps.type !== nextProps.type) return false

  return true
})
