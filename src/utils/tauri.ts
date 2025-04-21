import type { DownloadCodeParams } from '@/types'
import { contentDispositionParser } from 'common'
import { saveAs } from 'file-saver-es'
import { fetcher } from './fetcher'
import { storage } from './storage'
// import { invoke } from '@tauri-apps/api/core'
// import { BizResult } from 'types'

const downloadCode = async (params: DownloadCodeParams) => {
  const { config } = storage.getScope()
  const res = await fetcher(`${import.meta.env.BIZ_RUST_WEB_SERVER_URL}/download/code`, {
    method: 'POST',
    response: true,
    body: JSON.stringify({
      chat_id: params.chatId,
      message_id: params.messageId,
      template_src_dir: config.template_src_dir,
    }),
  })
  if (!res.body) return '下载失败'
  const { type, parameters } = contentDispositionParser(res.headers.get('content-disposition')) ?? {}
  const fileName = type === 'attachment' ? parameters?.filename : `${params.chatId}-${params.messageId}.zip`
  saveAs(await res.blob(), fileName)
}

export const tauri = {
  downloadCode,
}
