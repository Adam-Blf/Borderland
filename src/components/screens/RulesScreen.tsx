import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore } from '@/stores'
import { SUIT_RULES, SUIT_SYMBOLS, type Suit } from '@/types'
import { cn } from '@/utils'

interface RuleCardProps {
  suit: Suit
  index: number
}

function RuleCard({ suit, index }: RuleCardProps) {
  const rule = SUIT_RULES[suit]
  const symbol = SUIT_SYMBOLS[suit]

  // Harmonized gold/ivory color mapping
  const colors = {
    clubs: {
      text: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/30',
      glow: 'text-glow-gold',
    },
    diamonds: {
      text: 'text-gold-light',
      bg: 'bg-gold-light/10',
      border: 'border-gold-light/30',
      glow: '',
    },
    hearts: {
      text: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/30',
      glow: 'text-glow-gold',
    },
    spades: {
      text: 'text-ivory',
      bg: 'bg-ivory/10',
      border: 'border-ivory/20',
      glow: '',
    },
  }[suit]

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.1, type: 'spring', damping: 20 }}
      className={cn(
        'rounded-xl p-5',
        'bg-obsidian-light border',
        colors.border,
        'relative overflow-hidden'
      )}
    >
      {/* Decorative background symbol */}
      <div
        className={cn(
          'absolute -right-4 -bottom-4 text-8xl opacity-5',
          colors.text
        )}
      >
        {symbol}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with symbol and title */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              colors.bg,
              'border',
              colors.border
            )}
          >
            <span className={cn('text-2xl', colors.text, colors.glow)}>
              {symbol}
            </span>
          </div>
          <h3 className={cn('font-playfair text-xl font-bold', colors.text)}>
            {rule.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-text-secondary leading-relaxed">
          {rule.description}
        </p>
      </div>
    </motion.div>
  )
}

export function RulesScreen() {
  const { goToHub } = useAppStore()
  const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="min-h-screen bg-blackout"
    >
      {/* Header with back button */}
      <header className="sticky top-0 z-30 bg-blackout/90 backdrop-blur-lg border-b border-gold/10">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-6 py-4 flex items-center">
          <Button
            variant="ghost"
            color="gold"
            onClick={goToHub}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-playfair text-xl lg:text-2xl font-bold text-ivory">
            Règles du Borderland
          </h1>
        </div>
      </header>

      {/* Rules content */}
      <main className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-6 py-6 pb-safe">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6 lg:mb-8"
        >
          <p className="text-text-muted lg:text-lg">
            Chaque couleur de carte a sa propre règle.
            <br />
            <span className="text-gold font-medium">Les As valent un SHOT.</span>
          </p>
        </motion.div>

        {/* Rule cards - Grid on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suits.map((suit, index) => (
            <RuleCard key={suit} suit={suit} index={index} />
          ))}
        </div>

        {/* Contest rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            'rounded-xl p-5 lg:p-6 mt-6 md:col-span-2',
            'bg-surface-elevated border border-gold/40',
            'relative overflow-hidden'
          )}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/30 rounded-tr-xl pointer-events-none" />

          <h3 className="font-playfair text-lg font-bold text-gold mb-2">
            ⚔️ Le Contest
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Tu peux contester une carte pour doubler la mise ! Le joueur suivant
            peut accepter ou escalader (×2, puis ×4). Celui qui accepte boit
            tout. Courage ou folie ?
          </p>
        </motion.div>
      </main>
    </motion.div>
  )
}
