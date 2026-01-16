import { motion } from 'framer-motion'
import {
  Play,
  Book,
  Crown,
  Users,
  Dices,
  Sparkles,
  Wine,
  Flame,
  Scale,
  Heart,
  Timer,
  TreePalm,
  Trophy,
  Hash,
  Spade,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore, useGameStore } from '@/stores'
import { PROMPT_GAMES } from '@/data/prompts'
import { CARD_GAMES } from '@/data/cardGames'
import type { CardGameType } from '@/types'
import { cn } from '@/utils'

// Icon mapping for card games
const CARD_GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown,
  TreePalm,
  Trophy,
  Hash,
  Spade,
}

// Icon mapping for prompt games
const PROMPT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine,
  Flame,
  Scale,
  Users,
  Heart,
  Timer,
}


// Card for Card-based Games
interface CardGameCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  accentColor: 'gold' | 'red' | 'green' | 'purple'
  onPlay: () => void
  onRules: () => void
  delay?: number
}

function CardGameCard({
  title,
  subtitle,
  description,
  icon,
  accentColor,
  onPlay,
  onRules,
  delay = 0,
}: CardGameCardProps) {
  const IconComponent = CARD_GAME_ICONS[icon] || Dices

  const colorStyles = {
    gold: {
      bg: 'from-gold/10 to-gold/5',
      border: 'border-gold/40 hover:border-gold/60',
      iconBg: 'bg-gold/10 border-gold/30',
      text: 'text-gold',
      button: 'gold' as const,
    },
    red: {
      bg: 'from-poker-red/10 to-poker-red/5',
      border: 'border-poker-red/40 hover:border-poker-red/60',
      iconBg: 'bg-poker-red/10 border-poker-red/30',
      text: 'text-poker-red-light',
      button: 'red' as const,
    },
    green: {
      bg: 'from-casino-green/20 to-casino-green/10',
      border: 'border-casino-green/40 hover:border-casino-green-light/60',
      iconBg: 'bg-casino-green/20 border-casino-green-light/30',
      text: 'text-casino-green-light',
      button: 'green' as const,
    },
    purple: {
      bg: 'from-neon-purple/10 to-neon-purple/5',
      border: 'border-neon-purple/40 hover:border-neon-purple/60',
      iconBg: 'bg-neon-purple/10 border-neon-purple/30',
      text: 'text-neon-purple',
      button: 'purple' as const,
    },
  }

  const colors = colorStyles[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br',
        colors.bg,
        'border-2',
        colors.border,
        'p-5',
        'shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
        'transition-all duration-300',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.15)]'
      )}
    >
      {/* Gold inner frame */}
      <div className="absolute inset-2 border border-gold/10 rounded-xl pointer-events-none" />

      {/* Light sweep - CSS animation, hidden on mobile for perf */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -skew-x-12 animate-sweep-slow hidden sm:block" />

      <div className="relative">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center',
            colors.iconBg
          )}>
            <IconComponent className={cn('w-7 h-7', colors.text)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-cinzel text-xl font-bold text-ivory">
              {title}
            </h3>
            <p className={cn('text-xs font-montserrat uppercase tracking-wider mt-0.5', colors.text)}>
              {subtitle}
            </p>
            <p className="text-text-muted text-sm font-montserrat mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="chip"
            color={colors.button}
            size="sm"
            onClick={onPlay}
            className="flex-1 gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Jouer
          </Button>
          <Button
            variant="outline"
            color={colors.button}
            size="sm"
            onClick={onRules}
            className="gap-2"
          >
            <Book className="w-4 h-4" />
            Règles
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Compact card for Prompt Games
interface PromptGameCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  onPlay: () => void
  delay?: number
}

function PromptGameCard({
  title,
  subtitle,
  description,
  icon,
  onPlay,
  delay = 0,
}: PromptGameCardProps) {
  const IconComponent = PROMPT_ICONS[icon] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 100 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPlay}
      className={cn(
        'relative overflow-hidden rounded-2xl cursor-pointer',
        'bg-gradient-to-br from-velvet via-velvet-deep to-black',
        'border-2 border-gold/40',
        'p-4 sm:p-5',
        'shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
        'transition-all duration-300',
        'hover:border-gold/60',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.15)]'
      )}
    >
      {/* Gold inner frame */}
      <div className="absolute inset-2 border border-gold/20 rounded-xl pointer-events-none" />

      {/* Light sweep - CSS animation, hidden on mobile for perf */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -skew-x-12 animate-sweep-slow hidden sm:block" />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-gold" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-cinzel text-lg font-bold text-ivory truncate">
            {title}
          </h3>
          <p className="text-gold/70 text-xs font-montserrat uppercase tracking-wider mt-0.5">
            {subtitle}
          </p>
          <p className="text-text-muted text-sm font-montserrat mt-1 line-clamp-1">
            {description}
          </p>
        </div>

        {/* Play arrow */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Play className="w-4 h-4 text-gold fill-gold" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface HubScreenProps {
  onPlayGame?: () => void
}

export function HubScreen({ onPlayGame }: HubScreenProps) {
  const { navigateTo, startPromptGame, showRulesFor } = useAppStore()
  const { players } = useGameStore()

  const handleCardGamePlay = (gameId: CardGameType) => {
    if (onPlayGame && gameId === 'game') {
      onPlayGame()
    } else if (gameId === 'game') {
      navigateTo('game')
    } else if (gameId === 'palmTree') {
      navigateTo('palmTree')
    } else if (gameId === 'horseRace') {
      navigateTo('horseRace')
    } else if (gameId === 'ninetyNine') {
      navigateTo('ninetyNine')
    } else if (gameId === 'blackjack') {
      navigateTo('blackjack')
    }
  }

  const handleRules = (gameId: CardGameType) => {
    showRulesFor(gameId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      {/* Decorative casino background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold corner flourishes */}
        <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-gold/20 rounded-tl-3xl" />
        <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-gold/20 rounded-tr-3xl" />
        <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-gold/20 rounded-bl-3xl" />
        <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-gold/20 rounded-br-3xl" />

        {/* Central glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="pt-12 sm:pt-16 pb-6 text-center px-6 relative z-10">
        {/* Crown icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2, damping: 15 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-4"
        >
          <Crown className="w-7 h-7 text-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-cinzel text-5xl sm:text-6xl font-bold mb-2 tracking-wide"
        >
          <span className="text-ivory">BLACK</span>
          <span className="text-gold text-glow-gold">OUT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary font-montserrat text-sm uppercase tracking-[0.2em]"
        >
          Collection de jeux à boire
        </motion.p>

        {/* Edit players button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
          <Button
            variant="ghost"
            color="gold"
            onClick={() => navigateTo('welcome')}
            className="text-sm border border-gold/20 hover:border-gold/40"
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="font-cinzel">
              {players.length} joueur{players.length !== 1 ? 's' : ''}
            </span>
            <span className="mx-2 text-gold/40">•</span>
            <span className="text-gold/70">Modifier</span>
          </Button>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 max-w-lg lg:max-w-4xl xl:max-w-5xl mx-auto w-full relative z-10">
        {/* Card Games Section divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/50 text-xs font-montserrat uppercase tracking-widest">
              Jeux de Cartes
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </motion.div>

        {/* Card Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {CARD_GAMES.map((game, index) => (
            <CardGameCard
              key={game.id}
              title={game.title}
              subtitle={game.subtitle}
              description={game.description}
              icon={game.icon}
              accentColor={game.accentColor}
              onPlay={() => handleCardGamePlay(game.id)}
              onRules={() => handleRules(game.id)}
              delay={0.35 + index * 0.08}
            />
          ))}
        </div>

        {/* Prompt Games Section divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="my-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/50 text-xs font-montserrat uppercase tracking-widest">
              Mini-Jeux
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </motion.div>

        {/* Prompt Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROMPT_GAMES.map((game, index) => (
            <PromptGameCard
              key={game.id}
              title={game.title}
              subtitle={game.subtitle}
              description={game.description}
              icon={game.icon}
              onPlay={() => startPromptGame(game.id)}
              delay={0.6 + index * 0.08}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-text-muted/40 text-xs font-montserrat">
          À consommer avec modération
        </p>
      </footer>
    </motion.div>
  )
}
