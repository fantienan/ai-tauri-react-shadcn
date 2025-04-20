import type { DownloadCodeParams } from '@/types'
import { fetcher } from './fetcher'
import { storage } from './storage'
// import { invoke } from '@tauri-apps/api/core'
// import { BizResult } from 'types'

const downloadCode = async (params: DownloadCodeParams) => {
  const { config } = storage.getScope()
  const res = await fetcher(`${import.meta.env.BIZ_RUST_WEB_SERVER_URL}/download/code`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: params.chatId,
      message_id: params.messageId,
      template_src_dir: config.template_src_dir,
    }),
  })
  console.log(res)
  //   const result = await invoke<BizResult>('download_code', { chat_id: params.chatId, message_id: params.messageId })
  //   if (!result.success) return result.message ?? '下载失败'
}

export const tauri = {
  downloadCode,
}
