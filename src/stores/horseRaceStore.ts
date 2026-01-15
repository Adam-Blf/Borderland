import { create } from 'zustand'
import type { Card, Suit, HorseRaceState, HorseBet, HorsePosition } from '@/types'
import { createDeck, shuffleDeck } from './gameStore'

// ============================================
// Constants
// ============================================

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

const createInitialHorses = (): HorsePosition[] =>
  SUITS.map((suit) => ({ suit, position: 0 }))

// ============================================
// Store Interface
// ============================================

interface HorseRaceStore extends HorseRaceState {
  // Setup
  initGame: (finishPosition?: number) => void
  resetGame: () => void

  // Betting Phase
  placeBet: (playerId: string, playerName: string, suit: Suit, amount: number) => void
  removeBet: (playerId: string) => void
  startRace: () => void

  // Racing Phase
  drawNextCard: () => Card | null
  getHorsePosition: (suit: Suit) => number

  // Results
  calculateResults: () => { playerId: string; playerName: string; result: number; won: boolean }[]
}

// ============================================
// Initial State
// ============================================

const initialState: HorseRaceState = {
  phase: 'betting',
  bets: [],
  horses: createInitialHorses(),
  deck: [],
  currentCard: null,
  drawnCards: [],
  winner: null,
  finishPosition: 7,
}

// ============================================
// Store Implementation
// ============================================

export const useHorseRaceStore = create<HorseRaceStore>()((set, get) => ({
  ...initialState,

  initGame: (finishPosition = 7) => {
    // Create a deck without Aces (Aces are the horses)
    const fullDeck = createDeck()
    const raceDeck = fullDeck.filter((card) => card.rank !== 'A')

    set({
      phase: 'betting',
      bets: [],
      horses: createInitialHorses(),
      deck: shuffleDeck(raceDeck),
      currentCard: null,
      drawnCards: [],
      winner: null,
      finishPosition,
    })
  },

  resetGame: () => set({ ...initialState, horses: createInitialHorses() }),

  placeBet: (playerId, playerName, suit, amount) => {
    set((state) => {
      // Replace if player already has a bet
      const existingIndex = state.bets.findIndex((b) => b.playerId === playerId)
      const newBet: HorseBet = { playerId, playerName, horseSuit: suit, amount }

      if (existingIndex >= 0) {
        const newBets = [...state.bets]
        newBets[existingIndex] = newBet
        return { bets: newBets }
      }

      return { bets: [...state.bets, newBet] }
    })
  },

  removeBet: (playerId) => {
    set((state) => ({
      bets: state.bets.filter((b) => b.playerId !== playerId),
    }))
  },

  startRace: () => {
    if (get().bets.length === 0) return
    set({ phase: 'racing' })
  },

  drawNextCard: () => {
    const { deck, phase, finishPosition } = get()
    if (phase !== 'racing' || deck.length === 0) return null

    const [drawnCard, ...remainingDeck] = deck

    // Advance the corresponding horse
    set((state) => {
      const newHorses = state.horses.map((horse) => {
        if (horse.suit === drawnCard.suit) {
          return { ...horse, position: horse.position + 1 }
        }
        return horse
      })

      // Check if a horse has won
      const winningHorse = newHorses.find((h) => h.position >= finishPosition)

      return {
        deck: remainingDeck,
        currentCard: drawnCard,
        drawnCards: [...state.drawnCards, drawnCard],
        horses: newHorses,
        winner: winningHorse?.suit ?? null,
        phase: winningHorse ? 'result' : 'racing',
      }
    })

    return drawnCard
  },

  getHorsePosition: (suit) => {
    return get().horses.find((h) => h.suit === suit)?.position ?? 0
  },

  calculateResults: () => {
    const { bets, winner } = get()
    if (!winner) return []

    return bets.map((bet) => ({
      playerId: bet.playerId,
      playerName: bet.playerName,
      result: bet.horseSuit === winner
        ? -bet.amount  // Winner: distributes their sips
        : bet.amount,  // Loser: drinks their sips
      won: bet.horseSuit === winner,
    }))
  },
}))
