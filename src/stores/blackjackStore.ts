import { create } from 'zustand'
import type { Card, BlackjackPlayer, BlackjackDealer, BlackjackPhase, BlackjackHand, Rank, Suit } from '@/types'

// ============================================
// Blackjack Game Store
// ============================================

interface BlackjackStore {
  // State
  phase: BlackjackPhase
  players: BlackjackPlayer[]
  dealer: BlackjackDealer
  deck: Card[]
  currentPlayerIndex: number
  minBet: number
  maxBet: number

  // Actions
  initGame: (playerNames: string[]) => void
  placeBet: (playerId: string, amount: number) => void
  startDealing: () => void
  hit: () => void
  stand: () => void
  doubleDown: () => void
  playDealerTurn: () => void
  determineWinners: () => void
  newRound: () => void
  resetGame: () => void

  // Getters
  getCurrentPlayer: () => BlackjackPlayer | null
  canHit: () => boolean
  canDoubleDown: () => boolean
}

// Create a standard 52-card deck (6 decks for Blackjack)
const createDeck = (numDecks: number = 6): Card[] => {
  const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades']
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (let d = 0; d < numDecks; d++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        const value = rank === 'A' ? 11 :
                      rank === 'J' || rank === 'Q' || rank === 'K' ? 10 :
                      parseInt(rank)

        deck.push({
          id: `${suit}-${rank}-${d}`,
          suit,
          rank,
          value,
          unit: rank === 'A' ? 'SHOT' : 'gorgees',
        })
      }
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

// Calculate hand value (with soft ace handling)
const calculateHandValue = (cards: Card[]): BlackjackHand => {
  let value = 0
  let aces = 0

  for (const card of cards) {
    if (card.rank === 'A') {
      aces++
      value += 11
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      value += 10
    } else {
      value += parseInt(card.rank)
    }
  }

  // Convert aces from 11 to 1 if busting
  let isSoft = aces > 0
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }

  isSoft = aces > 0 && value <= 21

  return {
    cards,
    value,
    isSoft,
    isBlackjack: cards.length === 2 && value === 21,
    isBusted: value > 21,
  }
}

// Create empty hand
const createEmptyHand = (): BlackjackHand => ({
  cards: [],
  value: 0,
  isSoft: false,
  isBlackjack: false,
  isBusted: false,
})

export const useBlackjackStore = create<BlackjackStore>()((set, get) => ({
  // Initial state
  phase: 'betting',
  players: [],
  dealer: {
    hand: createEmptyHand(),
    isRevealed: false,
  },
  deck: [],
  currentPlayerIndex: 0,
  minBet: 1,
  maxBet: 10,

  // Initialize game with player names
  initGame: (playerNames: string[]) => {
    const deck = shuffleArray(createDeck(6))

    const players: BlackjackPlayer[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      hand: createEmptyHand(),
      bet: 0,
      isStanding: false,
      hasDoubled: false,
    }))

    set({
      phase: 'betting',
      players,
      dealer: {
        hand: createEmptyHand(),
        isRevealed: false,
      },
      deck,
      currentPlayerIndex: 0,
    })
  },

  // Place bet (in drinks/shots)
  placeBet: (playerId: string, amount: number) => {
    const { players, minBet, maxBet } = get()
    const clampedBet = Math.max(minBet, Math.min(maxBet, amount))

    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, bet: clampedBet } : p
    )

    set({ players: updatedPlayers })
  },

  // Start dealing cards
  startDealing: () => {
    const { players, deck } = get()
    let currentDeck = [...deck]

    // Deal 2 cards to each player
    const updatedPlayers = players.map(player => {
      const cards = [currentDeck.shift()!, currentDeck.shift()!]
      return {
        ...player,
        hand: calculateHandValue(cards),
      }
    })

    // Deal 2 cards to dealer (one face down)
    const dealerCards = [currentDeck.shift()!, currentDeck.shift()!]
    const dealerHand = calculateHandValue(dealerCards)

    set({
      phase: 'playerTurn',
      players: updatedPlayers,
      dealer: {
        hand: dealerHand,
        isRevealed: false,
      },
      deck: currentDeck,
      currentPlayerIndex: 0,
    })
  },

  // Player hits (takes another card)
  hit: () => {
    const { players, currentPlayerIndex, deck } = get()
    const player = players[currentPlayerIndex]

    if (!player || player.isStanding || player.hand.isBusted) return

    const newCard = deck[0]
    const newDeck = deck.slice(1)
    const newCards = [...player.hand.cards, newCard]
    const newHand = calculateHandValue(newCards)

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = {
      ...player,
      hand: newHand,
      isStanding: newHand.isBusted, // Auto-stand if busted
    }

    set({ players: updatedPlayers, deck: newDeck })

    // If busted or standing, move to next player
    if (newHand.isBusted) {
      get().stand()
    }
  },

  // Player stands
  stand: () => {
    const { players, currentPlayerIndex } = get()

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      isStanding: true,
    }

    // Find next player who hasn't stood
    let nextIndex = currentPlayerIndex + 1
    while (nextIndex < players.length && updatedPlayers[nextIndex].isStanding) {
      nextIndex++
    }

    if (nextIndex >= players.length) {
      // All players done, dealer's turn
      set({ players: updatedPlayers, phase: 'dealerTurn' })
      // Auto-play dealer
      setTimeout(() => get().playDealerTurn(), 500)
    } else {
      set({ players: updatedPlayers, currentPlayerIndex: nextIndex })
    }
  },

  // Double down (double bet, one card, then stand)
  doubleDown: () => {
    const { players, currentPlayerIndex, deck } = get()
    const player = players[currentPlayerIndex]

    if (!player || player.hand.cards.length !== 2) return

    const newCard = deck[0]
    const newDeck = deck.slice(1)
    const newCards = [...player.hand.cards, newCard]
    const newHand = calculateHandValue(newCards)

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = {
      ...player,
      hand: newHand,
      bet: player.bet * 2,
      hasDoubled: true,
      isStanding: true,
    }

    set({ players: updatedPlayers, deck: newDeck })

    // Move to next player or dealer
    get().stand()
  },

  // Play dealer's turn (dealer hits until 17+)
  playDealerTurn: () => {
    const { dealer, deck, players } = get()

    // Check if all players busted
    const allBusted = players.every(p => p.hand.isBusted)
    if (allBusted) {
      set({
        phase: 'result',
        dealer: { ...dealer, isRevealed: true },
      })
      get().determineWinners()
      return
    }

    let currentDeck = [...deck]
    let dealerHand = dealer.hand

    // Dealer hits until 17 or higher
    while (dealerHand.value < 17) {
      const newCard = currentDeck.shift()!
      const newCards = [...dealerHand.cards, newCard]
      dealerHand = calculateHandValue(newCards)
    }

    set({
      dealer: {
        hand: dealerHand,
        isRevealed: true,
      },
      deck: currentDeck,
      phase: 'result',
    })

    get().determineWinners()
  },

  // Determine winners and assign penalties
  determineWinners: () => {
    const { players, dealer } = get()
    const dealerValue = dealer.hand.isBusted ? 0 : dealer.hand.value

    const updatedPlayers = players.map(player => {
      let result: 'win' | 'lose' | 'push' | 'blackjack'

      if (player.hand.isBusted) {
        result = 'lose'
      } else if (player.hand.isBlackjack && !dealer.hand.isBlackjack) {
        result = 'blackjack'
      } else if (dealer.hand.isBusted) {
        result = 'win'
      } else if (player.hand.value > dealerValue) {
        result = 'win'
      } else if (player.hand.value < dealerValue) {
        result = 'lose'
      } else {
        result = 'push'
      }

      return { ...player, result }
    })

    set({ players: updatedPlayers })
  },

  // Start a new round
  newRound: () => {
    const { players, deck } = get()

    // Reshuffle if deck is low
    let newDeck = deck
    if (deck.length < 52) {
      newDeck = shuffleArray(createDeck(6))
    }

    const resetPlayers = players.map(player => ({
      ...player,
      hand: createEmptyHand(),
      bet: 0,
      isStanding: false,
      hasDoubled: false,
      result: undefined,
    }))

    set({
      phase: 'betting',
      players: resetPlayers,
      dealer: {
        hand: createEmptyHand(),
        isRevealed: false,
      },
      deck: newDeck,
      currentPlayerIndex: 0,
    })
  },

  // Reset game completely
  resetGame: () => {
    set({
      phase: 'betting',
      players: [],
      dealer: {
        hand: createEmptyHand(),
        isRevealed: false,
      },
      deck: [],
      currentPlayerIndex: 0,
    })
  },

  // Get current player
  getCurrentPlayer: () => {
    const { players, currentPlayerIndex } = get()
    return players[currentPlayerIndex] || null
  },

  // Can current player hit?
  canHit: () => {
    const player = get().getCurrentPlayer()
    return player !== null && !player.isStanding && !player.hand.isBusted
  },

  // Can current player double down?
  canDoubleDown: () => {
    const player = get().getCurrentPlayer()
    return player !== null && player.hand.cards.length === 2 && !player.hasDoubled
  },
}))
