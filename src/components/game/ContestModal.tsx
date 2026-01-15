import { motion, AnimatePresence } from 'framer-motion'
import type { ContestState, Player, PenaltyResult, ContestLevel } from '@/types'
import { CONTEST_MULTIPLIERS } from '@/types'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

export interface ContestModalProps {
  isOpen: boolean
  contestState: ContestState
  challengedPlayer: Player | null
  penalty: PenaltyResult | null
  onEscalate?: () => void
  onAccept?: () => void
  onClose?: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
}

const pulseVariants = {
  pulse: {
    // Use opacity instead of scale for better GPU performance
    opacity: [1, 0.85, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
}

const levelVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0, transition: { type: 'spring' as const, damping: 15 } },
}

interface PlayerBadgeProps {
  player: Player | null
  label: string
  color?: 'green' | 'red'
}

function PlayerBadge({ player, label, color = 'green' }: PlayerBadgeProps) {
  const colorClasses = color === 'red'
    ? 'border-neon-red/50 text-neon-red'
    : 'border-neon-green/50 text-neon-green'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
      <div className={cn('px-4 py-2 rounded-lg border bg-surface-elevated', colorClasses)}>
        <span className="font-bold">{player?.name ?? '???'}</span>
      </div>
    </div>
  )
}

export function ContestModal({
  isOpen,
  contestState,
  challengedPlayer,
  penalty,
  onEscalate,
  onAccept,
  onClose,
}: ContestModalProps) {
  const { level, challenger } = contestState
  const canEscalate = level < 3
  const nextMultiplier = canEscalate ? CONTEST_MULTIPLIERS[(level + 1) as ContestLevel] : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contest-overlay"
          className={cn(
            'fixed inset-0 z-50',
            // Mobile: solid bg (perf), Desktop: blur effect
            'bg-blackout/95 sm:bg-blackout/80 sm:backdrop-blur-md',
            'flex items-center justify-center',
            'p-4'
          )}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            key="contest-modal"
            className={cn(
              'relative w-full max-w-sm',
              'bg-surface rounded-2xl',
              'border-2 border-neon-red',
              'p-6',
              'glow-red'
            )}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Contest Level Badge */}
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2"
              variants={levelVariants}
              initial="initial"
              animate="animate"
            >
              <div className={cn(
                'px-4 py-1 rounded-full',
                'bg-neon-red text-blackout',
                'text-sm font-bold uppercase tracking-wider'
              )}>
                Level {level}/3
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-center text-2xl font-bold text-neon-red text-glow-red mt-4 mb-6">
              CONTEST!
            </h2>

            {/* Player VS Player */}
            <div className="flex justify-between items-center mb-8">
              <PlayerBadge player={challenger} label="Challenger" color="green" />
              <span className="text-text-muted text-2xl font-black">VS</span>
              <PlayerBadge player={challengedPlayer} label="Challenged" color="red" />
            </div>

            {/* Giant Penalty Display */}
            {penalty && (
              <motion.div
                className={cn(
                  'text-6xl sm:text-7xl font-black',
                  'text-neon-red text-glow-red',
                  'text-center py-4'
                )}
                variants={pulseVariants}
                animate="pulse"
              >
                {penalty.displayText}
              </motion.div>
            )}

            {/* Multiplier Info */}
            <p className="text-center text-text-secondary text-sm mb-6">
              Multiplicateur actuel: <span className="text-neon-purple font-bold">x{CONTEST_MULTIPLIERS[level]}</span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {canEscalate && onEscalate && (
                <Button
                  color="purple"
                  size="lg"
                  onClick={onEscalate}
                  className="w-full py-4 text-lg"
                >
                  ESCALATE (x{nextMultiplier})
                </Button>
              )}
              {onAccept && (
                <Button
                  color="red"
                  size="lg"
                  onClick={onAccept}
                  className="w-full py-4 text-lg"
                >
                  ACCEPT PENALTY
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
