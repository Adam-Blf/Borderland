export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export type NeonColor = 'green' | 'purple' | 'red' | 'gold'

/** App-level navigation screens (separate from game phases) */
export type AppScreen = 'welcome' | 'hub' | 'game' | 'rules' | 'promptGame' | 'palmTree' | 'horseRace' | 'ninetyNine' | 'blackjack'

export interface ThemeColors {
  blackout: string
  neonGreen: string
  neonPurple: string
  neonRed: string
}

// ============================================
// Prompt Games Types
// ============================================

/** Available prompt-based game types */
export type PromptGameType =
  | 'neverHaveIEver'
  | 'truthOrDare'
  | 'wouldYouRather'
  | 'mostLikelyTo'
  | 'itsA10But'
  | 'sevenSeconds'

/** Configuration for a prompt game displayed in Hub */
export interface PromptGameConfig {
  id: PromptGameType
  title: string
  subtitle: string
  description: string
  icon: string
}

// ============================================
// Le Borderland Card Game Types
// ============================================

/** Card suits */
export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades'

/** French suit names for display */
export const SUIT_FRENCH_NAMES: Record<Suit, string> = {
  clubs: 'Trefle',
  diamonds: 'Carreau',
  hearts: 'Coeur',
  spades: 'Pique',
} as const

/** Suit symbols for UI display */
export const SUIT_SYMBOLS: Record<Suit, string> = {
  clubs: '\u2663',
  diamonds: '\u2666',
  hearts: '\u2665',
  spades: '\u2660',
} as const

/** Card ranks from Ace to King */
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

/** Unit type for penalties */
export type PenaltyUnit = 'gorgees' | 'SHOT'

/** A single playing card */
export interface Card {
  /** Unique identifier (e.g., 'clubs-A', 'hearts-10') */
  id: string
  /** Card suit */
  suit: Suit
  /** Card rank */
  rank: Rank
  /** Numeric value (A=1, 2-10=face, J=11, Q=12, K=13) */
  value: number
  /** Penalty unit - CRITICAL: Ace MUST be 'SHOT', all others 'gorgees' */
  unit: PenaltyUnit
}

/** A player in the game */
export interface Player {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Whether player is still in the game */
  active: boolean
}

/** Contest/Duel escalation levels */
export type ContestLevel = 0 | 1 | 2 | 3

/** Contest multipliers by level */
export const CONTEST_MULTIPLIERS: Record<ContestLevel, number> = {
  0: 1,
  1: 1,
  2: 2,
  3: 4,
} as const

/** Current state of a contest/duel */
export interface ContestState {
  /** Whether a contest is currently active */
  active: boolean
  /** Current escalation level (0-3) */
  level: ContestLevel
  /** The card being contested */
  baseCard: Card | null
  /** Player who initiated or last escalated the contest */
  challenger: Player | null
}

/** Game phases */
export type GamePhase = 'setup' | 'playing' | 'contest' | 'resolution' | 'ended'

/** French rule texts for each suit */
export interface SuitRule {
  title: string
  description: string
}

export const SUIT_RULES: Record<Suit, SuitRule> = {
  clubs: {
    title: 'Le Guess',
    description: 'La carte est FACE CACHÉE. Demande à un joueur de deviner sa valeur exacte (ex: Roi). Clique pour révéler. S\'il a juste, tu distribues. Sinon, il boit.',
  },
  diamonds: {
    title: 'L\'Action',
    description: 'Donne une action au joueur de ton choix.',
  },
  hearts: {
    title: 'La Question',
    description: 'Pose une question au joueur de ton choix.',
  },
  spades: {
    title: 'La Contrainte',
    description: 'Donne une contrainte à accomplir au joueur de ton choix.',
  },
} as const

/** Complete game state */
export interface GameState {
  /** Remaining cards in deck */
  deck: Card[]
  /** Cards that have been played */
  discardPile: Card[]
  /** All players */
  players: Player[]
  /** Index of current player in players array */
  currentPlayerIndex: number
  /** Currently drawn card */
  currentCard: Card | null
  /** Whether the current card is revealed (face up) */
  isCardRevealed: boolean
  /** Contest/duel state */
  contestState: ContestState
  /** Current phase of the game */
  gamePhase: GamePhase
}

/** Result of a penalty calculation */
export interface PenaltyResult {
  amount: number
  unit: PenaltyUnit
  displayText: string
}

// ============================================
// Le Palmier Types
// ============================================

/** Phases of the Palm Tree game */
export type PalmTreePhase = 'setup' | 'playing' | 'trunk' | 'ended'

/** A card in the palm tree circle */
export interface PalmTreeCard {
  card: Card
  position: number
  isDrawn: boolean
}

/** Action result when drawing a card */
export interface PalmTreeAction {
  type: 'drink' | 'give'
  amount: number
  isBonus?: boolean
}

/** Complete Palm Tree game state */
export interface PalmTreeState {
  circleCards: PalmTreeCard[]
  trunkCard: Card | null
  isTrunkRevealed: boolean
  currentCard: PalmTreeCard | null
  drawnCards: Card[]
  phase: PalmTreePhase
  lastAction: PalmTreeAction | null
}

// ============================================
// Le PMU / Horse Race Types
// ============================================

/** Phases of the Horse Race game */
export type HorseRacePhase = 'betting' | 'racing' | 'result'

/** A player's bet on a horse */
export interface HorseBet {
  playerId: string
  playerName: string
  horseSuit: Suit
  amount: number
}

/** Position of a horse on the track */
export interface HorsePosition {
  suit: Suit
  position: number
}

/** Complete Horse Race game state */
export interface HorseRaceState {
  phase: HorseRacePhase
  bets: HorseBet[]
  horses: HorsePosition[]
  deck: Card[]
  currentCard: Card | null
  drawnCards: Card[]
  winner: Suit | null
  finishPosition: number
}

// ============================================
// Card Games Configuration
// ============================================

/** Card game types for hub display */
export type CardGameType = 'game' | 'palmTree' | 'horseRace' | 'ninetyNine' | 'blackjack'

/** Configuration for a card game displayed in Hub */
export interface CardGameConfig {
  id: CardGameType
  title: string
  subtitle: string
  description: string
  icon: string
  accentColor: 'gold' | 'red' | 'green' | 'purple'
}

// ============================================
// Le 99 Game Types
// ============================================

/** Phases of the 99 game */
export type NinetyNinePhase = 'setup' | 'playing' | 'ended'

/** A player in the 99 game */
export interface NinetyNinePlayer {
  id: string
  name: string
  hand: Card[]
  isOut: boolean
  lives: number
}

/** Special card effects in 99 */
export const NINETY_NINE_SPECIAL_CARDS: Record<string, { value: number | 'reverse' | 'skip' | 'reset'; description: string }> = {
  '4': { value: 'reverse', description: 'Inverse le sens du jeu' },
  '9': { value: 0, description: 'Valeur 0, passe le tour' },
  '10': { value: -10, description: '-10 au total' },
  'K': { value: 0, description: 'Valeur 0, le prochain doit jouer' },
  'A': { value: 1, description: '+1 ou +11' },
} as const

/** Complete 99 game state */
export interface NinetyNineState {
  phase: NinetyNinePhase
  players: NinetyNinePlayer[]
  currentPlayerIndex: number
  deck: Card[]
  discardPile: Card[]
  currentTotal: number
  direction: 1 | -1
  lastPlayedCard: Card | null
  loser: NinetyNinePlayer | null
}

// ============================================
// Blackjack Game Types
// ============================================

/** Phases of the Blackjack game */
export type BlackjackPhase = 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'result'

/** Blackjack hand with calculated values */
export interface BlackjackHand {
  cards: Card[]
  value: number
  isSoft: boolean
  isBlackjack: boolean
  isBusted: boolean
}

/** A player in Blackjack */
export interface BlackjackPlayer {
  id: string
  name: string
  hand: BlackjackHand
  bet: number
  isStanding: boolean
  hasDoubled: boolean
  result?: 'win' | 'lose' | 'push' | 'blackjack'
}

/** Dealer state */
export interface BlackjackDealer {
  hand: BlackjackHand
  isRevealed: boolean
}

/** Complete Blackjack game state */
export interface BlackjackState {
  phase: BlackjackPhase
  players: BlackjackPlayer[]
  dealer: BlackjackDealer
  deck: Card[]
  currentPlayerIndex: number
  minBet: number
  maxBet: number
}

// ============================================
// Faluche Games Types (from faluche.app)
// ============================================

/** Faluche game types */
export type FalucheGameType =
  | 'biskit'
  | 'quatre21'
  | 'monFoieEstMonGlaive'
  | 'purple'
  | 'chevre'
  | 'flipCup'

/** Faluche game categories */
export type FalucheGameCategory = 'DICE' | 'CARD' | 'ORAL'

/** Configuration for a Faluche game displayed in Hub */
export interface FalucheGameConfig {
  id: FalucheGameType
  title: string
  subtitle: string
  description: string
  category: FalucheGameCategory
  icon: string
  accentColor: 'amber' | 'cyan' | 'rose' | 'violet'
}
