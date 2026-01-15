import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Hash, RotateCcw, Skull, Users, Zap } from 'lucide-react'
import { useNinetyNineStore } from '@/stores/ninetyNineStore'
import { useAppStore } from '@/stores/appStore'
import { useGameStore } from '@/stores/gameStore'
import { PlayingCard } from '@/components/game/PlayingCard'
import { Button } from '@/components/ui/Button'
import { SUIT_SYMBOLS } from '@/types'
import type { Card, NinetyNinePlayer } from '@/types'
import { cn } from '@/utils'

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateY: 180 },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 200 },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
}

const totalVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 },
  },
}

// ============================================
// Helper Functions
// ============================================

const getCardDisplayValue = (card: Card): string => {
  switch (card.rank) {
    case '4': return '±0 ↺'
    case '9': return '±0'
    case '10': return '-10'
    case 'K': return '=99'
    case 'A': return '+1/11'
    case 'J':
    case 'Q':
      return '+10'
    default:
      return `+${card.rank}`
  }
}

const getSpecialEffect = (card: Card): string | null => {
  switch (card.rank) {
    case '4': return 'Inverse le sens !'
    case '9': return 'Passe le tour'
    case 'K': return 'Reset à 99 !'
    case 'A': return 'Choisis +1 ou +11'
    default: return null
  }
}

// ============================================
// Sub-Components
// ============================================

interface PlayerHandProps {
  player: NinetyNinePlayer
  isCurrentPlayer: boolean
  onPlayCard: (index: number, aceValue?: 1 | 11) => void
  canPlayCard: (card: Card, aceValue?: 1 | 11) => boolean
}

const PlayerHand = ({ player, isCurrentPlayer, onPlayCard, canPlayCard }: PlayerHandProps) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)

  const handleCardClick = (index: number) => {
    if (!isCurrentPlayer || player.isOut) return

    const card = player.hand[index]

    // If it's an Ace, show choice
    if (card.rank === 'A') {
      setSelectedCardIndex(index)
      return
    }

    // Check if playable
    if (canPlayCard(card)) {
      onPlayCard(index)
    }
  }

  const handleAceChoice = (value: 1 | 11) => {
    if (selectedCardIndex !== null) {
      onPlayCard(selectedCardIndex, value)
      setSelectedCardIndex(null)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'p-4 rounded-2xl transition-all',
        isCurrentPlayer
          ? 'bg-gold/10 border-2 border-gold/40 shadow-lg shadow-gold/20'
          : 'bg-black/20 border border-ivory/10',
        player.isOut && 'opacity-40'
      )}
    >
      {/* Player Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-cinzel font-bold',
            isCurrentPlayer ? 'text-gold' : 'text-ivory/80'
          )}>
            {player.name}
          </span>
          {player.isOut && (
            <span className="text-xs text-poker-red px-2 py-0.5 bg-poker-red/20 rounded-full">
              ÉLIMINÉ
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={cn(
                'text-lg',
                i < player.lives ? 'text-poker-red' : 'text-ivory/20'
              )}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-2 justify-center">
        {player.hand.map((card, index) => {
          const playable = isCurrentPlayer && canPlayCard(card)

          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className="relative"
              whileHover={playable ? { y: -8, scale: 1.05 } : undefined}
              whileTap={playable ? { scale: 0.95 } : undefined}
            >
              <div
                onClick={() => handleCardClick(index)}
                className={cn(
                  'cursor-pointer transition-all',
                  !playable && isCurrentPlayer && 'opacity-50',
                  playable && 'ring-2 ring-gold/50 rounded-lg'
                )}
              >
                <PlayingCard
                  card={card}
                  size="sm"
                  isRevealed={isCurrentPlayer}
                />
              </div>

              {/* Card Value Badge */}
              {isCurrentPlayer && (
                <div className={cn(
                  'absolute -bottom-2 left-1/2 -translate-x-1/2',
                  'text-xs font-bold px-2 py-0.5 rounded-full',
                  'bg-velvet border border-gold/30',
                  playable ? 'text-gold' : 'text-poker-red'
                )}>
                  {getCardDisplayValue(card)}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Ace Choice Modal */}
      <AnimatePresence>
        {selectedCardIndex !== null && player.hand[selectedCardIndex]?.rank === 'A' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-black/40 rounded-xl border border-gold/30"
          >
            <p className="text-sm text-ivory/80 mb-2 text-center">Choisir la valeur de l'As :</p>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant="chip"
                color={canPlayCard(player.hand[selectedCardIndex], 1) ? 'gold' : 'red'}
                onClick={() => handleAceChoice(1)}
                disabled={!canPlayCard(player.hand[selectedCardIndex], 1)}
              >
                +1
              </Button>
              <Button
                size="sm"
                variant="chip"
                color={canPlayCard(player.hand[selectedCardIndex], 11) ? 'gold' : 'red'}
                onClick={() => handleAceChoice(11)}
                disabled={!canPlayCard(player.hand[selectedCardIndex], 11)}
              >
                +11
              </Button>
              <Button
                size="sm"
                variant="outline"
                color="gold"
                onClick={() => setSelectedCardIndex(null)}
              >
                Annuler
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

export function NinetyNineScreen() {
  const { goToHub } = useAppStore()
  const { players: gamePlayers } = useGameStore()
  const {
    phase,
    players,
    currentPlayerIndex,
    currentTotal,
    direction,
    lastPlayedCard,
    loser,
    initGame,
    playCard,
    canPlayCard,
    resetGame,
  } = useNinetyNineStore()

  const [showEffect, setShowEffect] = useState(false)
  const [effectText, setEffectText] = useState('')
  const [totalAnimation, setTotalAnimation] = useState(false)

  // Initialize game with existing players
  useEffect(() => {
    if (phase === 'setup' && gamePlayers.length > 0) {
      const playerNames = gamePlayers.map(p => p.name)
      initGame(playerNames)
    } else if (phase === 'setup') {
      // Default players if none exist
      initGame(['Joueur 1', 'Joueur 2', 'Joueur 3'])
    }
  }, [phase, gamePlayers, initGame])

  // Show special effect feedback
  useEffect(() => {
    if (lastPlayedCard) {
      const effect = getSpecialEffect(lastPlayedCard)
      if (effect) {
        setEffectText(effect)
        setShowEffect(true)
        setTimeout(() => setShowEffect(false), 2000)
      }
      setTotalAnimation(true)
      setTimeout(() => setTotalAnimation(false), 300)
    }
  }, [lastPlayedCard])

  const handlePlayCard = (cardIndex: number, aceValue?: 1 | 11) => {
    playCard(cardIndex, aceValue)
  }

  const handlePlayAgain = () => {
    resetGame()
    const playerNames = gamePlayers.length > 0
      ? gamePlayers.map(p => p.name)
      : ['Joueur 1', 'Joueur 2', 'Joueur 3']
    initGame(playerNames)
  }

  const currentPlayer = players[currentPlayerIndex]
  const activePlayers = players.filter(p => !p.isOut)

  return (
    <div className="min-h-screen bg-velvet-deep flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 px-4 py-3 backdrop-blur-xl bg-velvet/80 border-b border-gold/20"
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={goToHub}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-montserrat text-sm">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <Hash className="w-6 h-6 text-neon-purple" />
            <h1 className="font-cinzel text-xl text-gold text-glow-gold">Le 99</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-ivory/60">
            <Users className="w-4 h-4" />
            <span>{activePlayers.length}/{players.length}</span>
          </div>
        </div>
      </motion.header>

      {/* Total Display */}
      <motion.div
        className="py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="inline-flex flex-col items-center">
          <span className="text-sm text-ivory/50 font-montserrat mb-1">TOTAL</span>
          <motion.div
            variants={totalVariants}
            animate={totalAnimation ? 'pulse' : 'initial'}
            className={cn(
              'text-7xl font-cinzel font-bold',
              currentTotal >= 90
                ? 'text-poker-red text-glow-red'
                : currentTotal >= 70
                  ? 'text-gold text-glow-gold'
                  : 'text-casino-green-light'
            )}
          >
            {currentTotal}
          </motion.div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-ivory/40">
              Direction: {direction === 1 ? '→' : '←'}
            </span>
            {lastPlayedCard && (
              <span className="text-sm text-gold/60">
                Dernière: {lastPlayedCard.rank}{SUIT_SYMBOLS[lastPlayedCard.suit]}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Rules Banner */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-black/40 border border-gold/20">
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <span className="text-ivory/60">4 = Reverse</span>
          <span className="text-ivory/60">9 = ±0</span>
          <span className="text-ivory/60">10 = -10</span>
          <span className="text-ivory/60">K = 99</span>
          <span className="text-ivory/60">A = +1/+11</span>
        </div>
      </div>

      {/* Special Effect Feedback */}
      <AnimatePresence>
        {showEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-6 py-3 bg-neon-purple/30 border-2 border-neon-purple rounded-xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-purple animate-pulse" />
                <span className="text-lg font-cinzel text-neon-purple font-bold">
                  {effectText}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Players */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {players.map((player, index) => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrentPlayer={index === currentPlayerIndex && phase === 'playing'}
              onPlayCard={handlePlayCard}
              canPlayCard={canPlayCard}
            />
          ))}
        </div>
      </div>

      {/* Current Player Indicator */}
      {phase === 'playing' && currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-velvet/90 backdrop-blur-xl border-t border-gold/20"
        >
          <p className="text-center text-gold font-cinzel">
            C'est au tour de <span className="font-bold">{currentPlayer.name}</span>
          </p>
        </motion.div>
      )}

      {/* Game Over Modal */}
      <AnimatePresence>
        {phase === 'ended' && loser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-8 max-w-md"
            >
              <Skull className="w-16 h-16 text-poker-red mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-cinzel text-poker-red text-glow-red mb-2">
                BUST !
              </h2>
              <p className="text-2xl font-cinzel text-gold mb-2">
                {loser.name} a dépassé 99 !
              </p>
              <p className="text-ivory/60 mb-8">
                {loser.name} boit un shot ! 🥃
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  color="gold"
                  onClick={goToHub}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Button>
                <Button
                  variant="chip"
                  color="gold"
                  onClick={handlePlayAgain}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Rejouer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
