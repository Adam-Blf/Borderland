import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Card,
  Suit,
  Rank,
  Player,
  GameState,
  ContestState,
  ContestLevel,
  PenaltyUnit,
  PenaltyResult,
} from '@/types'
import { CONTEST_MULTIPLIERS } from '@/types'

// ============================================
// Constants
// ============================================

const SUITS: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

/** Maps rank to numeric value */
const RANK_VALUES: Record<Rank, number> = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13,
}

// ============================================
// Initial States
// ============================================

const initialContestState: ContestState = {
  active: false,
  level: 0,
  baseCard: null,
  challenger: null,
}

const initialGameState: GameState = {
  deck: [],
  discardPile: [],
  players: [],
  currentPlayerIndex: 0,
  currentCard: null,
  isCardRevealed: false,
  contestState: initialContestState,
  gamePhase: 'setup',
}

// ============================================
// Pure Functions (Game Logic)
// ============================================

/**
 * Creates a standard 52-card deck
 * CRITICAL: Ace cards have unit 'SHOT', all others have 'gorgees'
 */
export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const value = RANK_VALUES[rank]
      // CRITICAL RULE: Ace = SHOT, everything else = gorgees
      const unit: PenaltyUnit = rank === 'A' ? 'SHOT' : 'gorgees'

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value,
        unit,
      })
    }
  }

  return deck
}

/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array (does not mutate original)
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/**
 * Creates a player with a unique ID
 */
export function createPlayer(name: string): Player {
  return {
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    active: true,
  }
}

/**
 * Calculates the final penalty based on contest level
 * Unit stays the same (SHOT stays SHOT, gorgees stays gorgees)
 */
export function calculatePenalty(
  baseAmount: number,
  level: ContestLevel,
  unit: PenaltyUnit
): PenaltyResult {
  const multiplier = CONTEST_MULTIPLIERS[level]
  const amount = baseAmount * multiplier

  const displayText = unit === 'SHOT'
    ? `${amount} SHOT${amount > 1 ? 'S' : ''}`
    : `${amount} gorgee${amount > 1 ? 's' : ''}`

  return { amount, unit, displayText }
}

/**
 * Gets the next player index (circular)
 */
export function getNextPlayerIndex(
  currentIndex: number,
  players: Player[]
): number {
  const activePlayers = players.filter(p => p.active)
  if (activePlayers.length === 0) return 0

  let nextIndex = (currentIndex + 1) % players.length

  // Skip inactive players
  while (!players[nextIndex]?.active && nextIndex !== currentIndex) {
    nextIndex = (nextIndex + 1) % players.length
  }

  return nextIndex
}

// ============================================
// Store Interface
// ============================================

interface GameStore extends GameState {
  // Game Setup
  initGame: (playerNames?: string[]) => void
  resetGame: () => void

  // Player Management (Welcome Screen)
  setPlayers: (names: string[]) => void
  clearPlayers: () => void
  hasPlayers: () => boolean

  // Player Management (In-Game)
  addPlayer: (name: string) => void
  removePlayer: (playerId: string) => void
  deactivatePlayer: (playerId: string) => void

  // Turn Management
  drawCard: () => Card | null
  revealCard: () => void
  nextTurn: () => void

  // Contest System
  startContest: (challenger: Player) => void
  escalateContest: (challenger: Player) => boolean
  resolveContest: (loser: Player) => PenaltyResult | null
  cancelContest: () => void

  // Card Action
  handleCardAction: () => void

  // Getters (computed values)
  getCurrentPlayer: () => Player | null
  getCardsRemaining: () => number
  isGameOver: () => boolean
}

// ============================================
// Store Implementation
// ============================================

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state spread
      ...initialGameState,

      // ========================================
      // Game Setup Actions
      // ========================================

      initGame: (playerNames?: string[]) => {
        const existingPlayers = get().players

        let players: Player[]

        if (playerNames && playerNames.length >= 2) {
          // Legacy mode: names provided directly
          players = playerNames
            .filter(name => name.trim().length > 0)
            .map(createPlayer)
        } else if (existingPlayers.length >= 2) {
          // New mode: reuse existing players, reactivate all
          players = existingPlayers.map(p => ({ ...p, active: true }))
        } else {
          console.warn('At least 2 players required')
          return
        }

        const deck = shuffleDeck(createDeck())

        set({
          deck,
          discardPile: [],
          players,
          currentPlayerIndex: 0,
          currentCard: null,
          isCardRevealed: false,
          contestState: initialContestState,
          gamePhase: 'playing',
        })
      },

      resetGame: () => {
        // Reset game state but preserve players
        const { players } = get()
        set({
          ...initialGameState,
          players, // Keep existing players
        })
      },

      // ========================================
      // Player Management (Welcome Screen)
      // ========================================

      setPlayers: (names: string[]) => {
        const sanitizedNames = names
          .map(n => n.trim().slice(0, 20).replace(/[<>]/g, ''))
          .filter(n => n.length > 0)

        if (sanitizedNames.length < 2) {
          console.warn('At least 2 players required')
          return
        }

        const players = sanitizedNames.map(createPlayer)
        set({ players })
      },

      clearPlayers: () => {
        set({ players: [] })
      },

      hasPlayers: () => {
        const { players } = get()
        return players.length >= 2
      },

      // ========================================
      // Player Management Actions
      // ========================================

      addPlayer: (name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return

        const newPlayer = createPlayer(trimmed)
        set(state => ({
          players: [...state.players, newPlayer],
        }))
      },

      removePlayer: (playerId: string) => {
        set(state => ({
          players: state.players.filter(p => p.id !== playerId),
        }))
      },

      deactivatePlayer: (playerId: string) => {
        set(state => ({
          players: state.players.map(p =>
            p.id === playerId ? { ...p, active: false } : p
          ),
        }))
      },

      // ========================================
      // Turn Management Actions
      // ========================================

      drawCard: () => {
        const { deck, gamePhase } = get()

        if (gamePhase !== 'playing' || deck.length === 0) {
          if (deck.length === 0) {
            set({ gamePhase: 'ended' })
          }
          return null
        }

        const [drawnCard, ...remainingDeck] = deck

        set({
          deck: remainingDeck,
          currentCard: drawnCard,
          isCardRevealed: false,
        })

        return drawnCard
      },

      revealCard: () => {
        set({ isCardRevealed: true })
      },

      nextTurn: () => {
        const { currentCard, players, currentPlayerIndex, deck } = get()

        // Move current card to discard if exists
        const discardUpdate = currentCard
          ? { discardPile: [...get().discardPile, currentCard] }
          : {}

        // Check if game should end
        if (deck.length === 0) {
          set({
            ...discardUpdate,
            currentCard: null,
            isCardRevealed: false,
            contestState: initialContestState,
            gamePhase: 'ended',
          })
          return
        }

        const nextIndex = getNextPlayerIndex(currentPlayerIndex, players)

        set({
          ...discardUpdate,
          currentPlayerIndex: nextIndex,
          currentCard: null,
          isCardRevealed: false,
          contestState: initialContestState,
          gamePhase: 'playing',
        })
      },

      // ========================================
      // Contest System Actions
      // ========================================

      startContest: (challenger: Player) => {
        const { currentCard, gamePhase } = get()

        if (!currentCard || gamePhase !== 'playing') {
          return
        }

        set({
          contestState: {
            active: true,
            level: 1,
            baseCard: currentCard,
            challenger,
          },
          gamePhase: 'contest',
        })
      },

      escalateContest: (challenger: Player) => {
        const { contestState } = get()

        if (!contestState.active || contestState.level >= 3) {
          return false
        }

        const newLevel = (contestState.level + 1) as ContestLevel

        set({
          contestState: {
            ...contestState,
            level: newLevel,
            challenger,
          },
        })

        return true
      },

      resolveContest: (_loser: Player) => {
        const { contestState } = get()

        if (!contestState.active || !contestState.baseCard) {
          return null
        }

        const { baseCard, level } = contestState
        const penalty = calculatePenalty(baseCard.value, level, baseCard.unit)

        set({
          gamePhase: 'resolution',
        })

        return penalty
      },

      cancelContest: () => {
        set({
          contestState: initialContestState,
          gamePhase: 'playing',
        })
      },

      // ========================================
      // Card Action Handler
      // ========================================

      handleCardAction: () => {
        const { currentCard, gamePhase } = get()

        if (!currentCard || gamePhase !== 'playing') {
          return
        }

        // UI component will use SUIT_RULES to display the appropriate action
      },

      // ========================================
      // Computed Getters
      // ========================================

      getCurrentPlayer: () => {
        const { players, currentPlayerIndex } = get()
        return players[currentPlayerIndex] ?? null
      },

      getCardsRemaining: () => {
        return get().deck.length
      },

      isGameOver: () => {
        const { deck, gamePhase } = get()
        return gamePhase === 'ended' || deck.length === 0
      },
    }),
    {
      name: 'borderland-game-storage',
      partialize: (state) => ({
        players: state.players,
      }),
    }
  )
)
