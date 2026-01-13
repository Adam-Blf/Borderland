import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppScreen } from '@/types'

interface AppState {
  // Navigation
  currentScreen: AppScreen
  navigateTo: (screen: AppScreen) => void
  goToHub: () => void

  // Theme
  activeNeonColor: 'green' | 'purple' | 'red'
  setActiveNeonColor: (color: 'green' | 'purple' | 'red') => void

  // Menu
  isMenuOpen: boolean
  toggleMenu: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation - default to hub
      currentScreen: 'hub',
      navigateTo: (screen) => set({ currentScreen: screen }),
      goToHub: () => set({ currentScreen: 'hub' }),

      // Theme
      activeNeonColor: 'green',
      setActiveNeonColor: (color) => set({ activeNeonColor: color }),

      // Menu
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    }),
    {
      name: 'blackout-storage',
      partialize: (state) => ({
        activeNeonColor: state.activeNeonColor,
        // Don't persist currentScreen - always start at hub
      }),
    }
  )
)
