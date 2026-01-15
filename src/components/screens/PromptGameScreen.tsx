import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Wine,
  Flame,
  Scale,
  Users,
  Heart,
  Timer,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore } from '@/stores'
import { getPromptsByType, getGameConfig, shuffleArray } from '@/data/prompts'
import { cn } from '@/utils'

// Icon mapping for dynamic rendering
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine,
  Flame,
  Scale,
  Users,
  Heart,
  Timer,
}

// Animation variants for prompt cards
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -15 : 15,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  }),
}

// Container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 20 },
  },
}

export function PromptGameScreen() {
  const { currentPromptGame, goToHub } = useAppStore()
  const [prompts, setPrompts] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  // Get game configuration
  const gameConfig = currentPromptGame ? getGameConfig(currentPromptGame) : null
  const IconComponent = gameConfig ? ICONS[gameConfig.icon] : Sparkles

  // Shuffle prompts on mount
  useEffect(() => {
    if (currentPromptGame) {
      const data = getPromptsByType(currentPromptGame)
      setPrompts(shuffleArray(data))
      setCurrentIndex(0)
    }
  }, [currentPromptGame])

  // Next prompt handler
  const nextPrompt = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % prompts.length)
  }, [prompts.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        nextPrompt()
      } else if (e.key === 'Escape') {
        goToHub()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPrompt, goToHub])

  if (!gameConfig || prompts.length === 0) {
    return null
  }

  const currentPrompt = prompts[currentIndex]

  return (
    <motion.div
      className="min-h-screen w-full bg-blackout flex flex-col overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Corner flourishes */}
        <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-gold/20 rounded-tl-2xl" />
        <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl" />
        <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl" />
        <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-gold/20 rounded-br-2xl" />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gold/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between p-4 relative z-10"
        variants={itemVariants}
      >
        <Button
          variant="ghost"
          color="gold"
          size="sm"
          onClick={goToHub}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <IconComponent className="w-6 h-6 text-gold" />
          </motion.div>
          <h1 className="font-cinzel text-xl text-gold font-bold tracking-wide">
            {gameConfig.title}
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="text-text-muted text-sm font-montserrat">
          {currentIndex + 1}/{prompts.length}
        </div>
      </motion.header>

      {/* Main Content - Prompt Card */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 cursor-pointer relative z-10"
        onClick={nextPrompt}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={cn(
              'w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4]',
              'rounded-2xl lg:rounded-3xl',
              'flex flex-col items-center justify-center',
              'p-6 sm:p-8 lg:p-12 text-center',
              'relative overflow-hidden',
              // Casino card styling
              'bg-gradient-to-br from-velvet-dark via-velvet to-velvet-dark',
              'border-2 lg:border-3 border-gold/40',
              'shadow-[0_0_40px_rgba(212,175,55,0.15),inset_0_0_60px_rgba(0,0,0,0.5)]'
            )}
          >
            {/* Card inner frame */}
            <div className="absolute inset-3 lg:inset-4 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />

            {/* Decorative corners */}
            <div className="absolute top-5 left-5 lg:top-6 lg:left-6 text-gold/30 text-lg lg:text-xl">◆</div>
            <div className="absolute top-5 right-5 lg:top-6 lg:right-6 text-gold/30 text-lg lg:text-xl">◆</div>
            <div className="absolute bottom-5 left-5 lg:bottom-6 lg:left-6 text-gold/30 text-lg lg:text-xl">◆</div>
            <div className="absolute bottom-5 right-5 lg:bottom-6 lg:right-6 text-gold/30 text-lg lg:text-xl">◆</div>

            {/* Light sweep animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -skew-x-12"
              animate={{ x: ['-200%', '200%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
            />

            {/* Prompt text */}
            <motion.p
              className={cn(
                'relative z-10',
                'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed',
                'text-ivory'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentPrompt}
            </motion.p>

            {/* Bottom decorative diamond */}
            <div className="absolute bottom-10 lg:bottom-14 text-gold/40 text-xl lg:text-2xl">◆</div>
          </motion.div>
        </AnimatePresence>

        {/* Tap hint */}
        <motion.p
          className="mt-8 text-text-muted text-sm font-montserrat tracking-wide"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          ✧ Tap pour la suivante ✧
        </motion.p>
      </main>

      {/* Footer - Action Button */}
      <motion.footer
        className="p-6 pb-safe flex justify-center relative z-10"
        variants={itemVariants}
      >
        <Button
          variant="chip"
          color="gold"
          size="lg"
          onClick={(e) => {
            e.stopPropagation()
            nextPrompt()
          }}
          className="min-w-[200px] animate-glow-pulse"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          SUIVANT
        </Button>
      </motion.footer>
    </motion.div>
  )
}
