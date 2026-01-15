import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TreePalm, Droplets, Gift, RotateCcw, Sparkles } from 'lucide-react'
import { usePalmTreeStore } from '@/stores/palmTreeStore'
import { useAppStore } from '@/stores/appStore'
import { PlayingCard } from '@/components/game/PlayingCard'
import { Button } from '@/components/ui/Button'
import { SUIT_SYMBOLS } from '@/types'
import type { PalmTreeCard, Card } from '@/types'
import { cn } from '@/utils'

// Hook for responsive radius calculation
function useResponsiveRadius() {
  const calculateRadius = useCallback(() => {
    if (typeof window === 'undefined') return 140
    const vw = window.innerWidth
    // Mobile: smaller, Tablet: medium, Desktop: larger
    if (vw < 640) return Math.min(120, vw * 0.26)
    if (vw < 1024) return Math.min(160, vw * 0.2)
    return Math.min(200, vw * 0.15)
  }, [])

  const [radius, setRadius] = useState(calculateRadius)

  useEffect(() => {
    const handleResize = () => setRadius(calculateRadius())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateRadius])

  return radius
}

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 200 },
  },
}

const actionBadgeVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 15, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.8, y: -20 },
}

const trunkPulseVariants = {
  pulse: {
    scale: [1, 1.03, 1],
    boxShadow: [
      '0 0 20px rgba(212,175,55,0.3)',
      '0 0 40px rgba(212,175,55,0.6)',
      '0 0 20px rgba(212,175,55,0.3)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

// ============================================
// Helper Functions
// ============================================

const getCardPosition = (index: number, total: number, radius: number) => {
  const angle = (index * 360) / total - 90 // Start from top
  const radians = (angle * Math.PI) / 180
  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
    rotation: angle + 90,
  }
}

// ============================================
// Sub-Components
// ============================================

interface CircleCardProps {
  palmCard: PalmTreeCard
  radius: number
  total: number
  onDraw: (position: number) => void
}

const CircleCard = ({ palmCard, radius, total, onDraw }: CircleCardProps) => {
  const { x, y } = getCardPosition(palmCard.position, total, radius)
  const [isRevealed, setIsRevealed] = useState(false)

  if (palmCard.isDrawn && isRevealed) return null

  return (
    <motion.div
      variants={cardVariants}
      className="absolute"
      style={{
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        left: '50%',
        top: '50%',
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <PlayingCard
        card={palmCard.card}
        size="sm"
        isRevealed={palmCard.isDrawn}
        onReveal={() => {
          onDraw(palmCard.position)
          setIsRevealed(true)
        }}
        onFlipComplete={() => {
          if (palmCard.isDrawn) {
            setTimeout(() => setIsRevealed(true), 1500)
          }
        }}
      />
    </motion.div>
  )
}

interface ActionFeedbackProps {
  type: 'drink' | 'give'
  amount: number
  isBonus?: boolean
  card?: Card | null
}

const ActionFeedback = ({ type, amount, isBonus, card }: ActionFeedbackProps) => {
  const isDrink = type === 'drink'
  const symbol = card ? SUIT_SYMBOLS[card.suit] : ''

  return (
    <motion.div
      variants={actionBadgeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'fixed bottom-32 left-1/2 -translate-x-1/2 z-50',
        'px-8 py-4 rounded-2xl',
        'backdrop-blur-xl border-2',
        'shadow-2xl',
        isDrink
          ? 'bg-poker-red/20 border-poker-red/60 glow-red'
          : 'bg-gold/20 border-gold/60 glow-gold'
      )}
    >
      <div className="flex items-center gap-4">
        {isDrink ? (
          <Droplets className="w-8 h-8 text-poker-red-light animate-bounce" />
        ) : (
          <Gift className="w-8 h-8 text-gold animate-bounce" />
        )}
        <div className="text-center">
          <div
            className={cn(
              'text-3xl font-cinzel font-bold',
              isDrink ? 'text-poker-red-light text-glow-red' : 'text-gold text-glow-gold'
            )}
          >
            {isDrink ? 'BOIS' : 'DONNE'}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span
              className={cn(
                'text-4xl font-bold',
                isDrink ? 'text-poker-red-light' : 'text-gold'
              )}
            >
              {amount}
            </span>
            <span className="text-2xl text-ivory/80">gorgée{amount > 1 ? 's' : ''}</span>
            {symbol && <span className="text-2xl">{symbol}</span>}
          </div>
          {isBonus && (
            <div className="flex items-center justify-center gap-1 mt-2 text-gold">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">BONUS TRONC x2</span>
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

export function PalmTreeScreen() {
  const { goToHub } = useAppStore()
  const {
    phase,
    circleCards,
    trunkCard,
    isTrunkRevealed,
    lastAction,
    currentCard,
    initGame,
    drawCircleCard,
    revealTrunk,
    resetGame,
    getRemainingCircleCards,
  } = usePalmTreeStore()

  const [showAction, setShowAction] = useState(false)

  // Initialize game on mount
  useEffect(() => {
    initGame(10)
  }, [initGame])

  // Show action feedback
  useEffect(() => {
    if (lastAction) {
      setShowAction(true)
      const timer = setTimeout(() => setShowAction(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [lastAction])

  const handleDrawCard = (position: number) => {
    drawCircleCard(position)
  }

  const handleRevealTrunk = () => {
    revealTrunk()
  }

  const handlePlayAgain = () => {
    resetGame()
    initGame(10)
  }

  const remaining = getRemainingCircleCards()
  const total = circleCards.length
  const radius = useResponsiveRadius()

  return (
    <div className="min-h-screen bg-velvet-deep flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 px-4 lg:px-6 py-3 backdrop-blur-xl bg-velvet/80 border-b border-gold/20"
      >
        <div className="flex items-center justify-between max-w-lg lg:max-w-4xl mx-auto">
          <button
            onClick={goToHub}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-montserrat text-sm">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <TreePalm className="w-6 h-6 text-casino-green-light" />
            <h1 className="font-cinzel text-xl text-gold text-glow-gold">Le Palmier</h1>
          </div>

          <div className="text-sm text-ivory/60 font-montserrat">
            {remaining}/{total}
          </div>
        </div>
      </motion.header>

      {/* Rules Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mt-4 p-3 rounded-xl bg-black/40 border border-gold/20"
      >
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-poker-red-light text-lg">♥️ ♦️</span>
            <span className="text-poker-red-light font-semibold">Rouge = Tu bois</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">♠️ ♣️</span>
            <span className="text-gold font-semibold">Noir = Tu donnes</span>
          </div>
        </div>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
          style={{
            width: radius * 2 + 120,
            height: radius * 2 + 120,
          }}
        >
          {/* Circle Cards */}
          <AnimatePresence mode="popLayout">
            {circleCards.map((palmCard) => (
              <CircleCard
                key={`circle-${palmCard.position}`}
                palmCard={palmCard}
                radius={radius}
                total={total}
                onDraw={handleDrawCard}
              />
            ))}
          </AnimatePresence>

          {/* Trunk Card (Center) */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            variants={cardVariants}
          >
            {trunkCard && (
              <motion.div
                animate={phase === 'trunk' ? 'pulse' : undefined}
                variants={trunkPulseVariants}
                className="relative rounded-xl"
              >
                <PlayingCard
                  card={trunkCard}
                  size="md"
                  isRevealed={isTrunkRevealed}
                  onReveal={phase === 'trunk' ? handleRevealTrunk : undefined}
                  isHighlighted={isTrunkRevealed}
                />

                {/* Trunk Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-cinzel text-gold/80 tracking-wider">
                    LE TRONC
                  </span>
                </div>

                {/* Tap to Reveal (when trunk phase) */}
                {phase === 'trunk' && !isTrunkRevealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className="text-sm font-semibold text-gold animate-pulse">
                      Touche pour révéler !
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Decorative Circle */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/20 pointer-events-none"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        </motion.div>
      </div>

      {/* Action Feedback */}
      <AnimatePresence>
        {showAction && lastAction && (
          <ActionFeedback
            type={lastAction.type}
            amount={lastAction.amount}
            isBonus={lastAction.isBonus}
            card={currentCard?.card}
          />
        )}
      </AnimatePresence>

      {/* Game Over */}
      <AnimatePresence>
        {phase === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-8"
            >
              <TreePalm className="w-16 h-16 text-casino-green-light mx-auto mb-4" />
              <h2 className="text-3xl font-cinzel text-gold text-glow-gold mb-2">
                Partie Terminée !
              </h2>
              <p className="text-ivory/60 mb-8">
                Le palmier a été défeuillé 🌴
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

      {/* Instructions Footer */}
      {phase === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 text-center"
        >
          <p className="text-sm text-ivory/50">
            Touche une carte du cercle pour la révéler
          </p>
        </motion.div>
      )}
    </div>
  )
}
