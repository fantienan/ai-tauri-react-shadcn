import type { BizScope } from '@/types'

const getScope = () => {
  try {
    const bizScope = sessionStorage.getItem('__BIZ_SCOPE__')
    if (bizScope) return JSON.parse(bizScope) as BizScope
  } catch (e) {}
  const defautlBizScope: BizScope = {
    config: {
      SM_MAPBOX_TOKEN: '',
      SM_GEOVIS_TOKEN: '',
      SM_TIANDITU_TOKEN: '',
      template_src_dir: '',
    },
  }
  return defautlBizScope
}

export const storage = {
  getScope,
}
