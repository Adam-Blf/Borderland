import { motion } from 'framer-motion'
import {
  Play,
  Book,
  Crown,
  Users,
  Sparkles,
  Dices,
  Star,
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
  TreePalm,
  Trophy,
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

interface GameCardProps {
  title: string
  subtitle: string
  description: string
  onPlay: () => void
  onRules: () => void
}

// Slot machine style game card
function GameCard({ title, subtitle, description, onPlay, onRules }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.3, type: 'spring', damping: 20, stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -8 }}
      className={cn(
        'relative overflow-hidden rounded-3xl',
        'bg-gradient-to-b from-velvet via-velvet-deep to-black',
        'border-4 border-gold/60',
        'p-1',
        'shadow-card-luxe',
        'transition-shadow duration-500',
        'hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(212,175,55,0.2)]'
      )}
    >
      {/* Gold inner frame */}
      <div className="absolute inset-1 border-2 border-gold/30 rounded-2xl pointer-events-none z-10" />

      {/* Light sweep effect - CSS only for GPU perf, hidden on mobile */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -skew-x-12 animate-sweep hidden sm:block" />

      {/* Card inner content */}
      <div className="relative bg-gradient-to-b from-velvet-deep/90 to-black/95 rounded-2xl p-6 sm:p-8">
        {/* Top decorative border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Corner stars */}
        <div className="absolute top-4 left-4">
          <Star className="w-4 h-4 text-gold/40 fill-gold/20" />
        </div>
        <div className="absolute top-4 right-4">
          <Star className="w-4 h-4 text-gold/40 fill-gold/20" />
        </div>

        {/* Game badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 border border-gold/50 mb-5"
        >
          <Dices className="w-4 h-4 text-gold" />
          <span className="text-xs font-cinzel font-bold text-gold uppercase tracking-widest">
            Jeu de Cartes
          </span>
        </motion.div>

        {/* Title area - vintage slot machine style */}
        <div className="relative mb-6">
          {/* Decorative lines */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <Sparkles className="w-5 h-5 text-gold" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl font-black text-ivory text-center tracking-wider">
            {title.split(' ')[0]}
            <span className="block text-gold text-glow-gold-subtle mt-1">
              {title.split(' ').slice(1).join(' ') || 'BORDERLAND'}
            </span>
          </h2>

          {/* Subtitle in vintage banner style */}
          <div className="relative mt-4 py-2 px-6 bg-gradient-to-r from-transparent via-gold/10 to-transparent">
            <p className="text-gold/90 font-montserrat font-medium text-center text-sm uppercase tracking-[0.15em]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary font-montserrat text-center mb-8 leading-relaxed px-2">
          {description}
        </p>

        {/* Action buttons - Chip style */}
        <div className="flex flex-col gap-4">
          {/* Play button - Main CTA */}
          <Button
            variant="chip"
            color="gold"
            size="xl"
            onClick={onPlay}
            className="w-full animate-glow-pulse"
          >
            <Play className="w-6 h-6 mr-3 fill-current" />
            <span className="text-xl tracking-wide">JOUER</span>
          </Button>

          {/* Rules button */}
          <Button
            variant="outline"
            color="gold"
            size="lg"
            onClick={onRules}
            className="w-full"
          >
            <Book className="w-5 h-5 mr-2" />
            RÈGLES DU JEU
          </Button>
        </div>

        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      {/* Bottom corner stars */}
      <div className="absolute bottom-3 left-4">
        <Star className="w-4 h-4 text-gold/40 fill-gold/20" />
      </div>
      <div className="absolute bottom-3 right-4">
        <Star className="w-4 h-4 text-gold/40 fill-gold/20" />
      </div>
    </motion.div>
  )
}

// Card for Card-based Games (Palmier, PMU)
interface CardGameCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  accentColor: 'gold' | 'red' | 'green'
  onPlay: () => void
  delay?: number
}

function CardGameCard({
  title,
  subtitle,
  description,
  icon,
  accentColor,
  onPlay,
  delay = 0,
}: CardGameCardProps) {
  const IconComponent = CARD_GAME_ICONS[icon] || Dices

  const colorStyles = {
    gold: {
      bg: 'from-gold/10 to-gold/5',
      border: 'border-gold/40 hover:border-gold/60',
      iconBg: 'bg-gold/10 border-gold/30',
      text: 'text-gold',
    },
    red: {
      bg: 'from-poker-red/10 to-poker-red/5',
      border: 'border-poker-red/40 hover:border-poker-red/60',
      iconBg: 'bg-poker-red/10 border-poker-red/30',
      text: 'text-poker-red-light',
    },
    green: {
      bg: 'from-casino-green/20 to-casino-green/10',
      border: 'border-casino-green/40 hover:border-casino-green-light/60',
      iconBg: 'bg-casino-green/20 border-casino-green-light/30',
      text: 'text-casino-green-light',
    },
  }

  const colors = colorStyles[accentColor]

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

      <div className="relative flex items-center gap-4">
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

        {/* Play arrow */}
        <div className="flex-shrink-0">
          <div className={cn(
            'w-12 h-12 rounded-full border flex items-center justify-center transition-colors',
            colors.iconBg,
            'hover:bg-gold/20'
          )}>
            <Play className={cn('w-5 h-5 fill-current', colors.text)} />
          </div>
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
  const { navigateTo, startPromptGame } = useAppStore()
  const { players } = useGameStore()

  const handlePlay = () => {
    if (onPlayGame) {
      onPlayGame()
    } else {
      navigateTo('game')
    }
  }

  const handleCardGamePlay = (gameId: CardGameType) => {
    if (gameId === 'palmTree') {
      navigateTo('palmTree')
    } else if (gameId === 'horseRace') {
      navigateTo('horseRace')
    }
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
        <GameCard
          title="Le Borderland"
          subtitle="52 cartes • 4 règles • 0 pitié"
          description="Tire une carte, découvre son pouvoir. Distribue des gorgées, ou bois-les. Conteste si tu oses. Survie si tu peux."
          onPlay={handlePlay}
          onRules={() => navigateTo('rules')}
        />

        {/* Card Games Section divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5 }}
          className="my-8"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {CARD_GAMES.map((game, index) => (
            <CardGameCard
              key={game.id}
              title={game.title}
              subtitle={game.subtitle}
              description={game.description}
              icon={game.icon}
              accentColor={game.accentColor}
              onPlay={() => handleCardGamePlay(game.id)}
              delay={0.55 + index * 0.08}
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
