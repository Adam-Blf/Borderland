import { create } from 'zustand'
import type { Card, NinetyNinePlayer, NinetyNinePhase, Rank, Suit } from '@/types'

// ============================================
// Le 99 - Card Game Store
// ============================================

interface NinetyNineStore {
  // State
  phase: NinetyNinePhase
  players: NinetyNinePlayer[]
  currentPlayerIndex: number
  deck: Card[]
  discardPile: Card[]
  currentTotal: number
  direction: 1 | -1
  lastPlayedCard: Card | null
  loser: NinetyNinePlayer | null

  // Actions
  initGame: (playerNames: string[]) => void
  playCard: (cardIndex: number, aceValue?: 1 | 11) => boolean
  drawCard: () => Card | null
  nextTurn: () => void
  resetGame: () => void

  // Getters
  getCurrentPlayer: () => NinetyNinePlayer | null
  canPlayCard: (card: Card, aceValue?: 1 | 11) => boolean
  getCardValue: (card: Card, aceValue?: 1 | 11) => number
}

// Create a standard 52-card deck
const createDeck = (): Card[] => {
  const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades']
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      const value = rank === 'A' ? 1 :
                    rank === 'J' ? 11 :
                    rank === 'Q' ? 12 :
                    rank === 'K' ? 13 :
                    parseInt(rank)

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value,
        unit: rank === 'A' ? 'SHOT' : 'gorgees',
      })
    }
  }

  return deck
}

// Shuffle array using Fisher-Yates
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get card value for 99 game (special rules)
const getCardValueFor99 = (card: Card, aceValue: 1 | 11 = 1): number => {
  switch (card.rank) {
    case '4': return 0 // Reverse (handled separately)
    case '9': return 0 // Skip
    case '10': return -10
    case 'K': return 0 // Reset to 99 or 0
    case 'A': return aceValue
    case 'J': return 10
    case 'Q': return 10
    default: return parseInt(card.rank)
  }
}

// Check if playing a card would exceed 99
const wouldExceed99 = (currentTotal: number, card: Card, aceValue: 1 | 11 = 1): boolean => {
  // King resets to 99 (safe) or keeps current
  if (card.rank === 'K') return false

  const value = getCardValueFor99(card, aceValue)
  return currentTotal + value > 99
}

export const useNinetyNineStore = create<NinetyNineStore>()((set, get) => ({
  // Initial state
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  deck: [],
  discardPile: [],
  currentTotal: 0,
  direction: 1,
  lastPlayedCard: null,
  loser: null,

  // Initialize game with player names
  initGame: (playerNames: string[]) => {
    const deck = shuffleArray(createDeck())

    // Create players and deal 3 cards each
    const players: NinetyNinePlayer[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      hand: deck.splice(0, 3),
      isOut: false,
      lives: 3,
    }))

    set({
      phase: 'playing',
      players,
      currentPlayerIndex: 0,
      deck,
      discardPile: [],
      currentTotal: 0,
      direction: 1,
      lastPlayedCard: null,
      loser: null,
    })
  },

  // Play a card from hand
  playCard: (cardIndex: number, aceValue: 1 | 11 = 1) => {
    const { players, currentPlayerIndex, deck, discardPile, currentTotal, direction } = get()
    const currentPlayer = players[currentPlayerIndex]

    if (!currentPlayer || currentPlayer.isOut) return false
    if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) return false

    const card = currentPlayer.hand[cardIndex]

    // Check if this would bust (exceed 99)
    if (wouldExceed99(currentTotal, card, aceValue)) {
      // Player loses a life
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        lives: currentPlayer.lives - 1,
        isOut: currentPlayer.lives <= 1,
      }

      // Check if game over
      const activePlayers = updatedPlayers.filter(p => !p.isOut)
      if (activePlayers.length <= 1) {
        set({
          players: updatedPlayers,
          phase: 'ended',
          loser: updatedPlayers[currentPlayerIndex],
        })
        return false
      }

      set({
        players: updatedPlayers,
        loser: updatedPlayers[currentPlayerIndex],
      })

      // Move to next player
      get().nextTurn()
      return false
    }

    // Remove card from hand
    const newHand = [...currentPlayer.hand]
    newHand.splice(cardIndex, 1)

    // Calculate new total
    let newTotal = currentTotal
    let newDirection = direction

    switch (card.rank) {
      case '4':
        newDirection = direction === 1 ? -1 : 1
        break
      case 'K':
        newTotal = 99
        break
      default:
        newTotal += getCardValueFor99(card, aceValue)
    }

    // Clamp total to 0-99
    newTotal = Math.max(0, Math.min(99, newTotal))

    // Draw a new card if deck has cards
    let newDeck = [...deck]
    if (newDeck.length > 0) {
      const drawnCard = newDeck.shift()!
      newHand.push(drawnCard)
    } else if (discardPile.length > 1) {
      // Reshuffle discard pile (except last card)
      const lastCard = discardPile[discardPile.length - 1]
      newDeck = shuffleArray(discardPile.slice(0, -1))
      const drawnCard = newDeck.shift()!
      newHand.push(drawnCard)
    }

    // Update player hand
    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      hand: newHand,
    }

    set({
      players: updatedPlayers,
      deck: newDeck,
      discardPile: [...discardPile, card],
      currentTotal: newTotal,
      direction: newDirection,
      lastPlayedCard: card,
    })

    // Move to next turn
    get().nextTurn()
    return true
  },

  // Draw a card
  drawCard: () => {
    const { deck, discardPile } = get()

    if (deck.length === 0 && discardPile.length <= 1) return null

    let newDeck = [...deck]
    if (newDeck.length === 0) {
      // Reshuffle discard pile
      const lastCard = discardPile[discardPile.length - 1]
      newDeck = shuffleArray(discardPile.slice(0, -1))
      set({ discardPile: [lastCard] })
    }

    const card = newDeck.shift()!
    set({ deck: newDeck })
    return card
  },

  // Move to next player
  nextTurn: () => {
    const { players, currentPlayerIndex, direction } = get()

    let nextIndex = currentPlayerIndex
    let attempts = 0

    do {
      nextIndex = (nextIndex + direction + players.length) % players.length
      attempts++
    } while (players[nextIndex].isOut && attempts < players.length)

    set({ currentPlayerIndex: nextIndex })
  },

  // Reset game
  resetGame: () => {
    set({
      phase: 'setup',
      players: [],
      currentPlayerIndex: 0,
      deck: [],
      discardPile: [],
      currentTotal: 0,
      direction: 1,
      lastPlayedCard: null,
      loser: null,
    })
  },

  // Get current player
  getCurrentPlayer: () => {
    const { players, currentPlayerIndex } = get()
    return players[currentPlayerIndex] || null
  },

  // Check if a card can be played
  canPlayCard: (card: Card, aceValue: 1 | 11 = 1) => {
    const { currentTotal } = get()
    return !wouldExceed99(currentTotal, card, aceValue)
  },

  // Get card value
  getCardValue: (card: Card, aceValue: 1 | 11 = 1) => {
    return getCardValueFor99(card, aceValue)
  },
}))
