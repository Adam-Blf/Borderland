import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import type { Card, Suit } from '@/types'
import { SUIT_SYMBOLS } from '@/types'
import { cn } from '@/utils'

export interface PlayingCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  card: Card
  isRevealed?: boolean
  onReveal?: () => void
  size?: 'sm' | 'md' | 'lg'
  isHighlighted?: boolean
  onFlipComplete?: () => void
}

const suitColorMap: Record<Suit, { text: string; glow: string; glowClass: string }> = {
  hearts: { text: 'text-neon-red', glow: 'text-glow-red', glowClass: 'glow-red' },
  diamonds: { text: 'text-neon-red', glow: 'text-glow-red', glowClass: 'glow-red' },
  clubs: { text: 'text-neon-purple', glow: 'text-glow-purple', glowClass: 'glow-purple' },
  spades: { text: 'text-neon-green', glow: 'text-glow-green', glowClass: 'glow-green' },
}

const sizeStyles = {
  sm: { container: 'w-20 h-28', rank: 'text-lg', symbol: 'text-3xl', corner: 'text-xs', logo: 'w-8 h-8 text-sm' },
  md: { container: 'w-28 h-40', rank: 'text-2xl', symbol: 'text-5xl', corner: 'text-sm', logo: 'w-10 h-10 text-base' },
  lg: { container: 'w-36 h-52', rank: 'text-4xl', symbol: 'text-7xl', corner: 'text-base', logo: 'w-14 h-14 text-xl' },
}

const flipTransition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
}

export const PlayingCard = forwardRef<HTMLDivElement, PlayingCardProps>(
  ({ card, isRevealed = true, onReveal, size = 'md', isHighlighted, onFlipComplete, className, ...props }, ref) => {
    const { suit, rank } = card
    const symbol = SUIT_SYMBOLS[suit]
    const colors = suitColorMap[suit]
    const sizeStyle = sizeStyles[size]

    const handleClick = () => {
      if (!isRevealed && onReveal) {
        onReveal()
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'perspective-1000 cursor-pointer select-none',
          sizeStyle.container,
          className
        )}
        onClick={handleClick}
        whileTap={!isRevealed ? { scale: 0.98 } : undefined}
        {...props}
      >
        {/* Card Inner - handles the 3D rotation */}
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isRevealed ? 0 : 180 }}
          transition={flipTransition}
          onAnimationComplete={onFlipComplete}
        >
          {/* Front Face */}
          <div
            className={cn(
              'absolute inset-0 backface-hidden rounded-xl',
              'bg-surface border-2 border-text-muted/30',
              'flex flex-col justify-between p-2',
              colors.text,
              isHighlighted && colors.glowClass
            )}
          >
            {/* Top Left Corner */}
            <div className="flex flex-col items-start leading-none">
              <span className={cn('font-bold', sizeStyle.corner, colors.glow)}>
                {rank}
              </span>
              <span className={sizeStyle.corner}>{symbol}</span>
            </div>

            {/* Center Symbol */}
            <div className="flex-1 flex items-center justify-center">
              <span className={cn(sizeStyle.symbol, colors.glow)}>
                {symbol}
              </span>
            </div>

            {/* Bottom Right Corner (rotated) */}
            <div className="flex flex-col items-end leading-none rotate-180">
              <span className={cn('font-bold', sizeStyle.corner, colors.glow)}>
                {rank}
              </span>
              <span className={sizeStyle.corner}>{symbol}</span>
            </div>
          </div>

          {/* Back Face - Obsidian & Gold Design */}
          <div
            className={cn(
              'absolute inset-0 backface-hidden rounded-xl rotate-y-180',
              'card-back-obsidian',
              'border-2 border-gold glow-gold',
              'overflow-hidden'
            )}
          >
            {/* Gold Geometric Pattern Overlay */}
            <div className="absolute inset-0 obsidian-pattern" />

            {/* Inner Border Frame */}
            <div className="absolute inset-2 rounded-lg border border-gold/30" />

            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-gold/60" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-gold/60" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-gold/60" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-gold/60" />

            {/* Center Logo - "B" in Gold Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  'rounded-full border-2 border-gold',
                  'flex items-center justify-center',
                  'bg-black/50 backdrop-blur-sm',
                  'glow-gold',
                  sizeStyle.logo
                )}
              >
                <span className="text-gold font-bold text-glow-gold">B</span>
              </div>
            </div>

            {/* Subtle Shine Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%, transparent 100%)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    )
  }
)

PlayingCard.displayName = 'PlayingCard'
