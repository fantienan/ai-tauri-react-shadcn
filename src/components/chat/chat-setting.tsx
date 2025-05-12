import { memo } from 'react'

const PureChatSetting = () => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1>设置</h1>
        <div className="text-sm">所有设置项</div>
      </div>
    </div>
  )
}

export const ChatSetting = memo(PureChatSetting)
