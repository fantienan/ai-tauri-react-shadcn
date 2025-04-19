import type { DownloadCodeParams } from '@/types'
import { invoke } from '@tauri-apps/api/core'
import { BizResult } from 'types'

const downloadCode = async (params: DownloadCodeParams) => {
  const result = await invoke<BizResult>('download_code', { chat_id: params.chatId, message_id: params.messageId })
  if (!result.success) return result.message ?? '下载失败'
}

export const tauri = {
  downloadCode,
}
