import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Flag, Minus, Plus, Play, RotateCcw, PartyPopper, Frown } from 'lucide-react'
import { useHorseRaceStore } from '@/stores/horseRaceStore'
import { useAppStore } from '@/stores/appStore'
import { useGameStore } from '@/stores/gameStore'
import { PlayingCard } from '@/components/game/PlayingCard'
import { Button } from '@/components/ui/Button'
import { SUIT_SYMBOLS } from '@/types'
import type { Suit, Card, HorsePosition } from '@/types'
import { cn } from '@/utils'

// ============================================
// Constants
// ============================================

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const SUIT_NAMES: Record<Suit, string> = {
  hearts: 'Coeur',
  diamonds: 'Carreau',
  clubs: 'Trèfle',
  spades: 'Pique',
}
const SUIT_COLORS: Record<Suit, { bg: string; border: string; text: string; glow: string }> = {
  hearts: { bg: 'bg-poker-red/20', border: 'border-poker-red', text: 'text-poker-red-light', glow: 'glow-red' },
  diamonds: { bg: 'bg-poker-red/20', border: 'border-poker-red', text: 'text-poker-red-light', glow: 'glow-red' },
  clubs: { bg: 'bg-gold/20', border: 'border-gold', text: 'text-gold', glow: 'glow-gold' },
  spades: { bg: 'bg-gold/20', border: 'border-gold', text: 'text-gold', glow: 'glow-gold' },
}

const FINISH_LINE = 7
const TRACK_CELLS = 8

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } },
}

const horseGallopVariants = {
  gallop: {
    y: [0, -3, 0],
    rotate: [-1, 1, -1],
    transition: { duration: 0.2, repeat: Infinity, ease: 'easeInOut' as const },
  },
  idle: { y: 0, rotate: 0 },
}

const cardRevealVariants = {
  hidden: { y: -80, opacity: 0, scale: 0.6, rotateX: 45 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { type: 'spring' as const, damping: 15, stiffness: 200 },
  },
  exit: { y: 30, opacity: 0, scale: 0.8 },
}

// ============================================
// Betting Phase Component
// ============================================

interface BettingPhaseProps {
  onStartRace: () => void
}

function BettingPhase({ onStartRace }: BettingPhaseProps) {
  const { placeBet, bets, startRace } = useHorseRaceStore()
  const { players } = useGameStore()
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null)
  const [betAmount, setBetAmount] = useState(3)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  const currentPlayer = players[currentPlayerIndex]
  const hasMorePlayers = currentPlayerIndex < players.length - 1
  const hasBets = bets.length > 0

  const handleConfirmBet = () => {
    if (!currentPlayer || !selectedSuit) return

    placeBet(currentPlayer.id, currentPlayer.name, selectedSuit, betAmount)

    if (hasMorePlayers) {
      setCurrentPlayerIndex((i) => i + 1)
      setSelectedSuit(null)
      setBetAmount(3)
    }
  }

  const handleStartRace = () => {
    startRace()
    onStartRace()
  }

  // Create a mock ace card for display
  const createAceCard = (suit: Suit): Card => ({
    id: `${suit}-A`,
    suit,
    rank: 'A',
    value: 1,
    unit: 'SHOT',
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full"
    >
      {/* Current Player */}
      <motion.div variants={itemVariants} className="text-center mb-6">
        <div className="text-sm text-ivory/60 mb-1">Tour de</div>
        <div className="text-2xl font-cinzel text-gold text-glow-gold">
          {currentPlayer?.name || 'Joueur'}
        </div>
      </motion.div>

      {/* Horse Selection */}
      <motion.div variants={itemVariants} className="mb-6">
        <h3 className="text-center text-sm text-ivory/60 mb-4 font-montserrat">
          Choisis ton cheval
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {SUITS.map((suit) => (
            <motion.button
              key={suit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSuit(suit)}
              className={cn(
                'relative rounded-xl p-2 transition-all',
                'border-2',
                selectedSuit === suit
                  ? [SUIT_COLORS[suit].bg, SUIT_COLORS[suit].border, SUIT_COLORS[suit].glow]
                  : 'border-gold/20 hover:border-gold/40'
              )}
            >
              <PlayingCard card={createAceCard(suit)} size="sm" isRevealed />
              {selectedSuit === suit && (
                <motion.div
                  layoutId="horse-selection"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                >
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bet Amount */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-center text-sm text-ivory/60 mb-3 font-montserrat">
          Mise (gorgées)
        </h3>
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            color="gold"
            size="sm"
            onClick={() => setBetAmount((a) => Math.max(1, a - 1))}
            disabled={betAmount <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="text-4xl font-cinzel text-gold text-glow-gold w-16 text-center">
            {betAmount}
          </div>
          <Button
            variant="outline"
            color="gold"
            size="sm"
            onClick={() => setBetAmount((a) => Math.min(10, a + 1))}
            disabled={betAmount >= 10}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div variants={itemVariants} className="space-y-3">
        <Button
          variant="chip"
          color="gold"
          size="lg"
          className="w-full"
          disabled={!selectedSuit}
          onClick={handleConfirmBet}
        >
          {hasMorePlayers ? 'Confirmer & Joueur Suivant' : 'Confirmer la Mise'}
        </Button>

        {hasBets && !hasMorePlayers && (
          <Button
            variant="solid"
            color="green"
            size="lg"
            className="w-full gap-2"
            onClick={handleStartRace}
          >
            <Play className="w-5 h-5" />
            Lancer la Course !
          </Button>
        )}
      </motion.div>

      {/* Current Bets Summary */}
      {bets.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-6 p-4 rounded-xl bg-black/30 border border-gold/20"
        >
          <h4 className="text-xs text-ivory/50 mb-2 font-montserrat">Mises enregistrées</h4>
          <div className="space-y-1">
            {bets.map((bet) => (
              <div key={bet.playerId} className="flex justify-between text-sm">
                <span className="text-ivory/80">{bet.playerName}</span>
                <span className={SUIT_COLORS[bet.horseSuit].text}>
                  {SUIT_SYMBOLS[bet.horseSuit]} {bet.amount} gorgées
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================
// Racing Phase Component
// ============================================

interface RacingPhaseProps {
  onRaceEnd: () => void
}

function RacingPhase({ onRaceEnd }: RacingPhaseProps) {
  const { horses, currentCard, winner, drawNextCard } = useHorseRaceStore()
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (winner) {
      setTimeout(onRaceEnd, 1500)
    }
  }, [winner, onRaceEnd])

  const handleDraw = () => {
    if (isDrawing || winner) return
    setIsDrawing(true)
    drawNextCard()
    setTimeout(() => setIsDrawing(false), 600)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col p-4"
    >
      {/* Race Track - scrollable on mobile */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col justify-center gap-4 overflow-x-auto pb-2 -mx-2 px-2"
      >
        {horses.map((horse) => (
          <RaceTrackLane
            key={horse.suit}
            horse={horse}
            isWinner={winner === horse.suit}
            isActive={currentCard?.suit === horse.suit}
          />
        ))}
      </motion.div>

      {/* Current Card Display */}
      <motion.div variants={itemVariants} className="flex justify-center my-6">
        <AnimatePresence mode="wait">
          {currentCard ? (
            <motion.div
              key={currentCard.id}
              variants={cardRevealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PlayingCard card={currentCard} size="md" isRevealed isHighlighted />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="w-28 h-40 rounded-xl border-2 border-dashed border-gold/30 flex items-center justify-center"
            >
              <span className="text-gold/50 text-sm">Tire une carte</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Draw Button */}
      {!winner && (
        <motion.div variants={itemVariants}>
          <Button
            variant="chip"
            color="gold"
            size="xl"
            className="w-full gap-2"
            onClick={handleDraw}
            disabled={isDrawing}
          >
            <Play className="w-5 h-5" />
            Tirer une Carte
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

interface RaceTrackLaneProps {
  horse: HorsePosition
  isWinner: boolean
  isActive: boolean
}

function RaceTrackLane({ horse, isWinner, isActive }: RaceTrackLaneProps) {
  const colors = SUIT_COLORS[horse.suit]
  const progress = (horse.position / FINISH_LINE) * 100

  // Create ace card for the horse
  const aceCard: Card = {
    id: `${horse.suit}-A`,
    suit: horse.suit,
    rank: 'A',
    value: 1,
    unit: 'SHOT',
  }

  return (
    <div className="relative">
      {/* Track Background - min-width ensures proper display on small screens */}
      <div className="h-16 min-w-[320px] bg-black/30 rounded-lg border border-gold/20 relative overflow-hidden">
        {/* Track Cells */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: TRACK_CELLS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 border-r border-gold/10',
                i === TRACK_CELLS - 1 && 'border-r-2 border-gold/40'
              )}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          className={cn('absolute left-0 top-0 bottom-0', colors.bg, 'opacity-50')}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />

        {/* Horse (Ace Card) */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          initial={{ left: '2%' }}
          animate={{
            left: `${Math.min(2 + (horse.position / FINISH_LINE) * 85, 87)}%`,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <motion.div
            animate={isActive ? 'gallop' : 'idle'}
            variants={horseGallopVariants}
            className={cn(isWinner && 'animate-bounce')}
          >
            <div className="scale-[0.6] origin-center">
              <PlayingCard
                card={aceCard}
                size="sm"
                isRevealed
                isHighlighted={isActive || isWinner}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Finish Flag */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Flag className={cn('w-5 h-5', isWinner ? 'text-gold animate-pulse' : 'text-gold/40')} />
        </div>
      </div>

      {/* Winner Badge */}
      <AnimatePresence>
        {isWinner && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -right-2 -top-2 z-20"
          >
            <div className="bg-gold text-velvet-deep rounded-full p-1">
              <Trophy className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// Result Phase Component
// ============================================

function ResultPhase() {
  const { goToHub } = useAppStore()
  const { winner, calculateResults, resetGame, initGame } = useHorseRaceStore()
  const results = calculateResults()

  const handlePlayAgain = () => {
    resetGame()
    initGame()
  }

  if (!winner) return null

  const winnerColors = SUIT_COLORS[winner]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-md w-full"
      >
        {/* Winner Announcement */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={cn(
              'inline-flex items-center justify-center w-20 h-20 rounded-full mb-4',
              winnerColors.bg,
              winnerColors.border,
              'border-2',
              winnerColors.glow
            )}
          >
            <span className={cn('text-5xl', winnerColors.text)}>
              {SUIT_SYMBOLS[winner]}
            </span>
          </motion.div>

          <h2 className="text-3xl font-cinzel text-gold text-glow-gold mb-2">
            Victoire !
          </h2>
          <p className="text-ivory/60">
            L'As de {SUIT_NAMES[winner]} remporte la course !
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-3 mb-8">
          {results.map((result) => (
            <motion.div
              key={result.playerId}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border',
                result.won
                  ? 'bg-casino-green/20 border-casino-green/40'
                  : 'bg-poker-red/10 border-poker-red/30'
              )}
            >
              <div className="flex items-center gap-3">
                {result.won ? (
                  <PartyPopper className="w-5 h-5 text-casino-green-light" />
                ) : (
                  <Frown className="w-5 h-5 text-poker-red-light" />
                )}
                <span className="text-ivory font-semibold">{result.playerName}</span>
              </div>
              <div className={cn('font-cinzel font-bold', result.won ? 'text-casino-green-light' : 'text-poker-red-light')}>
                {result.won ? `DONNE ${Math.abs(result.result)}` : `BOIT ${result.result}`}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            color="gold"
            className="flex-1 gap-2"
            onClick={goToHub}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button
            variant="chip"
            color="gold"
            className="flex-1 gap-2"
            onClick={handlePlayAgain}
          >
            <RotateCcw className="w-4 h-4" />
            Rejouer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

export function HorseRaceScreen() {
  const { goToHub } = useAppStore()
  const { phase, initGame } = useHorseRaceStore()
  const [localPhase, setLocalPhase] = useState<'betting' | 'racing' | 'result'>('betting')

  // Initialize game on mount
  useEffect(() => {
    initGame(FINISH_LINE)
  }, [initGame])

  // Sync local phase with store phase
  useEffect(() => {
    if (phase === 'result') {
      setLocalPhase('result')
    }
  }, [phase])

  const handleStartRace = () => {
    setLocalPhase('racing')
  }

  const handleRaceEnd = () => {
    setLocalPhase('result')
  }

  return (
    <div className="min-h-screen bg-velvet-deep flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 px-4 py-3 backdrop-blur-xl bg-velvet/80 border-b border-gold/20"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={goToHub}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-montserrat text-sm">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold" />
            <h1 className="font-cinzel text-xl text-gold text-glow-gold">Le PMU</h1>
          </div>

          <div className="text-sm text-ivory/60 font-montserrat capitalize">
            {localPhase === 'betting' ? 'Mises' : localPhase === 'racing' ? 'Course' : 'Résultat'}
          </div>
        </div>
      </motion.header>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        {localPhase === 'betting' && (
          <BettingPhase key="betting" onStartRace={handleStartRace} />
        )}
        {localPhase === 'racing' && (
          <RacingPhase key="racing" onRaceEnd={handleRaceEnd} />
        )}
        {localPhase === 'result' && <ResultPhase key="result" />}
      </AnimatePresence>
    </div>
  )
}
