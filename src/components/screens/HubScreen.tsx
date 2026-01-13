import { motion } from 'framer-motion'
import { Play, Book, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore, useGameStore } from '@/stores'
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
      transition={{ delay: 0.3, type: 'spring', damping: 25, stiffness: 200 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-obsidian-light border border-gold/40',
        'p-6 sm:p-8',
        'transition-shadow duration-300',
        'hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]',
        'hover:border-gold/60'
      )}
    >
      {/* Decorative gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 pointer-events-none" />

      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/20 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/20 rounded-br-2xl pointer-events-none" />

      {/* Card content */}
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 mb-4">
          <Sparkles className="w-3 h-3 text-gold" />
          <span className="text-xs font-medium text-gold uppercase tracking-wider">
            Jeu de cartes
          </span>
        </div>

        {/* Title with Playfair Display */}
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-ivory mb-1">
          {title}
        </h2>
        <p className="text-gold/80 font-medium mb-3">{subtitle}</p>

        {/* Description */}
        <p className="text-text-secondary mb-6 leading-relaxed">{description}</p>

        {/* Buttons - Gold theme */}
        <div className="flex gap-3">
          <Button
            color="gold"
            size="lg"
            onClick={onPlay}
            className="flex-1 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            JOUER
          </Button>
          <Button
            variant="outline"
            color="gold"
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

interface HubScreenProps {
  onPlayGame?: () => void
}

export function HubScreen({ onPlayGame }: HubScreenProps) {
  const { navigateTo } = useAppStore()
  const { players } = useGameStore()

  const handlePlay = () => {
    if (onPlayGame) {
      onPlayGame()
    } else {
      navigateTo('game')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="min-h-screen bg-blackout flex flex-col"
    >
      {/* Header */}
      <header className="pt-12 sm:pt-16 pb-6 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-5xl sm:text-6xl font-bold mb-2"
        >
          <span className="text-ivory">BLACK</span>
          <span className="text-gold text-glow-gold">OUT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted"
        >
          Collection de jeux à boire
        </motion.p>

        {/* Edit players button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Button
            variant="ghost"
            color="gold"
            onClick={() => navigateTo('welcome')}
            className="text-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            {players.length} joueur{players.length !== 1 ? 's' : ''} • Modifier
          </Button>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 pb-8 max-w-lg mx-auto w-full">
        <GameCard
          title="Le Borderland"
          subtitle="52 cartes, 4 règles, 0 pitié"
          description="Tire une carte, découvre son pouvoir. Distribue des gorgées, ou bois-les. Conteste si tu oses. Survie si tu peux."
          onPlay={handlePlay}
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
