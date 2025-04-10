import type { MapKitInstance } from '@/components/map-renderer'
import { getUserInfo } from '@/services'
import type { User } from '@/types'
import { logger } from '@/utils'
import { toast } from 'sonner'
import { create } from 'zustand'

const log = logger.extend('app-store')

export interface AppStoreState {
  session: {
    user?: User
  }
  map?: MapKitInstance
}

type AppStoreActions = {
  dispatch: (state: Partial<AppStoreState>) => void
  getUserInfo: () => Promise<User | undefined>
  signOut: () => Promise<void>
  setMap: (map: MapKitInstance) => void
}

export const useAppStore = create<AppStoreState & AppStoreActions>((set) => ({
  session: {
    user: undefined,
  },
  map: undefined,
  dispatch: (state) => set((prev) => ({ ...prev, ...state })),
  getUserInfo: async () => {
    const res = await getUserInfo({ id: 'localdev' }).catch(() => undefined)
    if (!res || !res.success || !res.data) {
      toast.error('获取用户信息失败，请稍后重试！')
      return
    }
    log('获取用户信息成功', res.data)
    set((prev) => ({ ...prev, session: { ...prev.session, user: res.data! } }))
    return res.data
  },
  signOut: async () => {},
  setMap: (map) => set((prev) => ({ ...prev, map })),
}))
