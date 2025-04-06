import { create } from 'zustand'

export interface ThemeStoreState {
  theme: string
}

type ThemeStoreActions = {
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreActions>((set) => ({
  theme: 'default',
  setTheme: (theme) => set((prev) => ({ ...prev, theme })),
}))
