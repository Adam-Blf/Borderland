import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppScreen, PromptGameType, CardGameType } from '@/types'

interface AppState {
  // Navigation
  currentScreen: AppScreen
  navigateTo: (screen: AppScreen) => void
  goToHub: () => void

  // Prompt Games
  currentPromptGame: PromptGameType | null
  startPromptGame: (gameType: PromptGameType) => void

  // Game Rules
  currentRulesGame: CardGameType | null
  showRulesFor: (gameId: CardGameType) => void

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
      goToHub: () => set({ currentScreen: 'hub', currentPromptGame: null, currentRulesGame: null }),

      // Prompt Games
      currentPromptGame: null,
      startPromptGame: (gameType) =>
        set({ currentPromptGame: gameType, currentScreen: 'promptGame' }),

      // Game Rules
      currentRulesGame: null,
      showRulesFor: (gameId) =>
        set({ currentRulesGame: gameId, currentScreen: 'rules' }),

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
