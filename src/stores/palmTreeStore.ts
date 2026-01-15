import { create } from 'zustand'
import type { Card, PalmTreeState, PalmTreeCard, PalmTreeAction } from '@/types'
import { createDeck, shuffleDeck } from './gameStore'

// ============================================
// Store Interface
// ============================================

interface PalmTreeStore extends PalmTreeState {
  // Setup
  initGame: (cardCount?: number) => void
  resetGame: () => void

  // Gameplay
  drawCircleCard: (position: number) => Card | null
  revealTrunk: () => Card | null

  // Computed
  getRemainingCircleCards: () => number
  isRedCard: (card: Card) => boolean
}

// ============================================
// Initial State
// ============================================

const initialState: PalmTreeState = {
  circleCards: [],
  trunkCard: null,
  isTrunkRevealed: false,
  currentCard: null,
  drawnCards: [],
  phase: 'setup',
  lastAction: null,
}

// ============================================
// Store Implementation
// ============================================

export const usePalmTreeStore = create<PalmTreeStore>()((set, get) => ({
  ...initialState,

  initGame: (cardCount = 10) => {
    const deck = shuffleDeck(createDeck())
    const circleCount = Math.min(Math.max(cardCount, 6), 12)

    // Take cards for the circle
    const circleCards: PalmTreeCard[] = deck
      .slice(0, circleCount)
      .map((card, index) => ({
        card,
        position: index,
        isDrawn: false,
      }))

    // Trunk card (center)
    const trunkCard = deck[circleCount]

    set({
      circleCards,
      trunkCard,
      isTrunkRevealed: false,
      currentCard: null,
      drawnCards: [],
      phase: 'playing',
      lastAction: null,
    })
  },

  resetGame: () => set(initialState),

  drawCircleCard: (position) => {
    const { circleCards, phase } = get()
    if (phase !== 'playing') return null

    const cardIndex = circleCards.findIndex(
      (c) => c.position === position && !c.isDrawn
    )
    if (cardIndex === -1) return null

    const drawnPalmCard = circleCards[cardIndex]
    const isRed = ['hearts', 'diamonds'].includes(drawnPalmCard.card.suit)

    const action: PalmTreeAction = {
      type: isRed ? 'drink' : 'give',
      amount: drawnPalmCard.card.value,
    }

    set((state) => ({
      circleCards: state.circleCards.map((c, i) =>
        i === cardIndex ? { ...c, isDrawn: true } : c
      ),
      currentCard: drawnPalmCard,
      drawnCards: [...state.drawnCards, drawnPalmCard.card],
      lastAction: action,
    }))

    // Check if all circle cards are drawn
    const remaining = get().circleCards.filter((c) => !c.isDrawn).length
    if (remaining === 0) {
      set({ phase: 'trunk' })
    }

    return drawnPalmCard.card
  },

  revealTrunk: () => {
    const { trunkCard, phase } = get()
    if (phase !== 'trunk' || !trunkCard) return null

    const isRed = ['hearts', 'diamonds'].includes(trunkCard.suit)

    const action: PalmTreeAction = {
      type: isRed ? 'drink' : 'give',
      amount: trunkCard.value * 2, // Bonus x2 for the trunk
      isBonus: true,
    }

    set({
      isTrunkRevealed: true,
      phase: 'ended',
      lastAction: action,
    })

    return trunkCard
  },

  getRemainingCircleCards: () =>
    get().circleCards.filter((c) => !c.isDrawn).length,

  isRedCard: (card) => ['hearts', 'diamonds'].includes(card.suit),
}))
