import { motion } from 'framer-motion'
import { Play, Book, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore } from '@/stores'
import { cn } from '@/utils'

interface GameCardProps {
  title: string
  subtitle: string
  description: string
  onPlay: () => void
  onRules: () => void
}

function GameCard({ title, subtitle, description, onPlay, onRules }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', damping: 20 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-surface border border-text-muted/20',
        'p-6 sm:p-8',
        'transition-shadow duration-300',
        'hover:shadow-[0_0_40px_rgba(57,255,20,0.15)]'
      )}
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-purple/5 pointer-events-none" />

      {/* Card content */}
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 mb-4">
          <Sparkles className="w-3 h-3 text-neon-green" />
          <span className="text-xs font-medium text-neon-green uppercase tracking-wider">
            Jeu de cartes
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-1 text-glow-green">
          {title}
        </h2>
        <p className="text-neon-green/80 font-medium mb-3">{subtitle}</p>

        {/* Description */}
        <p className="text-text-secondary mb-6">{description}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            color="green"
            size="lg"
            onClick={onPlay}
            className="flex-1 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            JOUER
          </Button>
          <Button
            variant="outline"
            color="purple"
            size="lg"
            onClick={onRules}
            className="py-4 px-6"
          >
            <Book className="w-5 h-5 mr-2" />
            RÈGLES
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export function HubScreen() {
  const { navigateTo, activeNeonColor } = useAppStore()

  const glowClass = {
    green: 'text-glow-green',
    purple: 'text-glow-purple',
    red: 'text-glow-red',
  }[activeNeonColor]

  const textClass = {
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    red: 'text-neon-red',
  }[activeNeonColor]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-blackout flex flex-col"
    >
      {/* Header */}
      <header className="pt-12 sm:pt-16 pb-6 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn('text-5xl sm:text-6xl font-bold mb-2', glowClass)}
        >
          <span className={textClass}>BLACK</span>
          <span className="text-text-primary">OUT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted"
        >
          Collection de jeux à boire
        </motion.p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 pb-8 max-w-lg mx-auto w-full">
        <GameCard
          title="Le Borderland"
          subtitle="52 cartes, 4 règles, 0 pitié"
          description="Tire une carte, découvre son pouvoir. Distribue des gorgées, ou bois-les. Conteste si tu oses. Survie si tu peux."
          onPlay={() => navigateTo('game')}
          onRules={() => navigateTo('rules')}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-text-muted/50 text-xs">
          À consommer avec modération
        </p>
      </footer>
    </motion.div>
  )
}
