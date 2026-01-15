import { motion } from 'framer-motion'
import { Play, Book, Crown, Users, Sparkles, Dices, Star } from 'lucide-react'
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

      {/* Animated light sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -skew-x-12"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />

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
      <main className="flex-1 px-4 sm:px-6 pb-8 max-w-lg mx-auto w-full relative z-10">
        <GameCard
          title="Le Borderland"
          subtitle="52 cartes • 4 règles • 0 pitié"
          description="Tire une carte, découvre son pouvoir. Distribue des gorgées, ou bois-les. Conteste si tu oses. Survie si tu peux."
          onPlay={handlePlay}
          onRules={() => navigateTo('rules')}
        />

        {/* Coming soon teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-text-muted/50 text-xs font-montserrat uppercase tracking-wider">
            Plus de jeux bientôt...
          </p>
          <div className="flex justify-center gap-2 mt-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: 'spring', damping: 15 }}
                className="w-2 h-2 rounded-full bg-gold/20 border border-gold/30"
              />
            ))}
          </div>
        </motion.div>
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
