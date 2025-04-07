import { create } from 'zustand'

export interface ThemeStoreState {
  theme: 'dark' | 'light'
}

type ThemeStoreActions = {
  setTheme: (theme: ThemeStoreState['theme']) => void
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreActions>((set) => ({
  theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  setTheme: (theme) => {
    set((prev) => ({ ...prev, theme }))
    localStorage.setItem('theme', 'dark')
    if (theme === 'dark') {
      document.documentElement.classList.toggle('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.toggle('light')
      document.documentElement.classList.remove('dark')
    }
  },
}))
