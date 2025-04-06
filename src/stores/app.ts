import { getUserInfo } from '@/services'
import { User } from '@/types'
import { toast } from 'sonner'
import { create } from 'zustand'

export interface AppStoreState {
  session: {
    user?: User
  }
}

type AppStoreActions = {
  dispatch: (state: Partial<AppStoreState>) => void
  getUserInfo: () => Promise<User | undefined>
  signOut: () => Promise<void>
}

export const useAppStore = create<AppStoreState & AppStoreActions>((set) => ({
  session: {
    user: undefined,
  },
  dispatch: (state) => set((prev) => ({ ...prev, ...state })),
  getUserInfo: async () => {
    const res = await getUserInfo({ id: 'localdev' }).catch(() => undefined)
    if (!res || !res.success || !res.data) {
      toast.error('获取用户信息失败，请稍后重试！')
      return
    }
    set((prev) => ({ ...prev, session: { ...prev.session, user: res.data! } }))
    return res.data
  },
  signOut: async () => {},
}))
