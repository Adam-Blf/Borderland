import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home } from 'lucide-react'
import { useGameStore } from '@/stores'
import { SUIT_RULES } from '@/types'
import type { Player, GamePhase } from '@/types'
import { Button } from '@/components/ui'
import { PlayingCard } from './PlayingCard'
import { ContestModal } from './ContestModal'
import { cn } from '@/utils'
import { calculatePenalty } from '@/stores/gameStore'

export interface GameBoardProps {
  className?: string
  onQuit?: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const statusVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const cardDrawVariants = {
  hidden: { y: -100, opacity: 0, rotateX: 45 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { type: 'spring' as const, damping: 20 },
  },
  exit: { y: 100, opacity: 0, scale: 0.8 },
}

const ruleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3 } },
}

interface StatusBarProps {
  currentPlayer: Player | null
  cardsRemaining: number
  totalCards: number
}

function StatusBar({ currentPlayer, cardsRemaining, totalCards }: StatusBarProps) {
  const progress = ((totalCards - cardsRemaining) / totalCards) * 100

  return (
    <motion.div className="space-y-3" variants={statusVariants}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary">
          Tour de: <span className="text-neon-green font-bold text-glow-green">{currentPlayer?.name ?? 'N/A'}</span>
        </span>
        <span className="text-text-muted">{cardsRemaining} cartes restantes</span>
      </div>
      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <motion.div
          className="h-full bg-neon-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

interface ActionButtonsProps {
  onDrawCard: () => void
  onStartContest: () => void
  onNextTurn: () => void
  gamePhase: GamePhase
  hasCurrentCard: boolean
}

function ActionButtons({ onDrawCard, onStartContest, onNextTurn, gamePhase, hasCurrentCard }: ActionButtonsProps) {
  if (gamePhase === 'setup') {
    return (
      <p className="text-center text-text-muted">
        Ajoutez des joueurs pour commencer
      </p>
    )
  }

  if (gamePhase === 'ended') {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-neon-purple text-glow-purple mb-4">
          GAME OVER!
        </p>
      </div>
    )
  }

  if (gamePhase === 'playing' && !hasCurrentCard) {
    return (
      <Button
        color="green"
        size="lg"
        className="w-full py-6 text-xl min-h-[60px]"
        onClick={onDrawCard}
      >
        TIRER UNE CARTE
      </Button>
    )
  }

  if ((gamePhase === 'playing' || gamePhase === 'resolution') && hasCurrentCard) {
    return (
      <div className="flex flex-col gap-3">
        <Button
          color="purple"
          size="lg"
          className="w-full py-5 text-lg min-h-[56px]"
          onClick={onStartContest}
        >
          CONTESTER
        </Button>
        <Button
          color="green"
          variant="outline"
          size="lg"
          className="w-full py-4"
          onClick={onNextTurn}
        >
          TOUR SUIVANT
        </Button>
      </div>
    )
  }

  return null
}

export function GameBoard({ className, onQuit }: GameBoardProps) {
  const {
    currentCard,
    gamePhase,
    contestState,
    drawCard,
    startContest,
    escalateContest,
    resolveContest,
    cancelContest,
    nextTurn,
    getCurrentPlayer,
    getCardsRemaining,
  } = useGameStore()

  const currentPlayer = getCurrentPlayer()
  const cardsRemaining = getCardsRemaining()
  const totalCards = 52

  const [showContestModal, setShowContestModal] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)

  // Reset reveal state when a new card is drawn
  useEffect(() => {
    if (currentCard) {
      setCardRevealed(false)
    }
  }, [currentCard?.id])

  const handleRevealCard = useCallback(() => {
    if (!cardRevealed) {
      setCardRevealed(true)
    }
  }, [cardRevealed])

  const currentRule = currentCard ? SUIT_RULES[currentCard.suit] : null

  const penalty = contestState.active && contestState.baseCard
    ? calculatePenalty(contestState.baseCard.value, contestState.level, contestState.baseCard.unit)
    : null

  const handleDrawCard = useCallback(() => {
    drawCard()
  }, [drawCard])

  const handleStartContest = useCallback(() => {
    if (currentPlayer) {
      startContest(currentPlayer)
      setShowContestModal(true)
    }
  }, [currentPlayer, startContest])

  const handleEscalate = useCallback(() => {
    if (currentPlayer) {
      escalateContest(currentPlayer)
    }
  }, [currentPlayer, escalateContest])

  const handleAcceptPenalty = useCallback(() => {
    if (currentPlayer) {
      resolveContest(currentPlayer)
      setShowContestModal(false)
      cancelContest()
    }
  }, [currentPlayer, resolveContest, cancelContest])

  const handleCloseModal = useCallback(() => {
    setShowContestModal(false)
    cancelContest()
  }, [cancelContest])

  const handleNextTurn = useCallback(() => {
    nextTurn()
  }, [nextTurn])

  return (
    <motion.div
      className={cn(
        'min-h-screen w-full',
        'bg-blackout',
        'flex flex-col',
        'p-4 pb-safe',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Home Button - Top Left */}
      {onQuit && (
        <button
          onClick={onQuit}
          className={cn(
            'fixed top-4 left-4 z-40',
            'p-3 rounded-full',
            'bg-surface-elevated border border-text-muted/30',
            'text-text-muted hover:text-neon-green',
            'transition-colors'
          )}
        >
          <Home className="w-5 h-5" />
        </button>
      )}

      {/* Status Zone - Top */}
      <header className="flex-shrink-0 mb-6">
        <StatusBar
          currentPlayer={currentPlayer}
          cardsRemaining={cardsRemaining}
          totalCards={totalCards}
        />
      </header>

      {/* Card Zone - Center */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              variants={cardDrawVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PlayingCard
                card={currentCard}
                size="lg"
                isRevealed={cardRevealed}
                onReveal={handleRevealCard}
                isHighlighted={cardRevealed}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap to Reveal Indicator */}
        <AnimatePresence>
          {currentCard && !cardRevealed && (
            <motion.p
              key="reveal-hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gold text-sm mt-4 animate-pulse text-glow-gold"
            >
              Tap to Reveal
            </motion.p>
          )}
        </AnimatePresence>

        {/* Rule Display - Only show when card is revealed */}
        <AnimatePresence>
          {currentRule && cardRevealed && (
            <motion.div
              key="rule"
              variants={ruleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn(
                'w-full max-w-sm mx-auto',
                'bg-surface-elevated rounded-xl',
                'border border-text-muted/20',
                'p-6 mt-8'
              )}
            >
              <h3 className="text-2xl font-bold text-neon-green text-glow-green">
                {currentRule.title}
              </h3>
              <p className="text-lg text-text-secondary mt-2">
                {currentRule.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!currentCard && gamePhase === 'playing' && (
          <div className="text-center">
            <p className="text-text-muted text-lg mb-2">Aucune carte</p>
            <p className="text-text-secondary">Tire une carte pour commencer</p>
          </div>
        )}
      </main>

      {/* Action Zone - Bottom (thumb zone) */}
      <footer className="flex-shrink-0 mt-auto pt-6">
        <ActionButtons
          onDrawCard={handleDrawCard}
          onStartContest={handleStartContest}
          onNextTurn={handleNextTurn}
          gamePhase={gamePhase}
          hasCurrentCard={!!currentCard}
        />
      </footer>

      {/* Contest Modal */}
      <ContestModal
        isOpen={showContestModal || gamePhase === 'contest'}
        contestState={contestState}
        challengedPlayer={currentPlayer}
        penalty={penalty}
        onEscalate={handleEscalate}
        onAccept={handleAcceptPenalty}
        onClose={handleCloseModal}
      />
    </motion.div>
  )
}
