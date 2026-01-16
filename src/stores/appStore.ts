import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppScreen, PromptGameType, CardGameType, FalucheGameType } from '@/types'

interface AppState {
  // Navigation
  currentScreen: AppScreen
  navigateTo: (screen: AppScreen) => void
  goToHub: () => void

  // Prompt Games
  currentPromptGame: PromptGameType | null
  startPromptGame: (gameType: PromptGameType) => void

  // Game Rules (Card Games)
  currentRulesGame: CardGameType | null
  showRulesFor: (gameId: CardGameType) => void

  // Classic Games Rules
  currentClassicRulesGame: FalucheGameType | null
  showClassicRulesFor: (gameId: FalucheGameType) => void

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
      goToHub: () => set({ currentScreen: 'hub', currentPromptGame: null, currentRulesGame: null, currentClassicRulesGame: null }),

      // Prompt Games
      currentPromptGame: null,
      startPromptGame: (gameType) =>
        set({ currentPromptGame: gameType, currentScreen: 'promptGame' }),

      // Game Rules (Card Games)
      currentRulesGame: null,
      showRulesFor: (gameId) =>
        set({ currentRulesGame: gameId, currentClassicRulesGame: null, currentScreen: 'rules' }),

      // Classic Games Rules
      currentClassicRulesGame: null,
      showClassicRulesFor: (gameId) =>
        set({ currentClassicRulesGame: gameId, currentRulesGame: null, currentScreen: 'rules' }),

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
