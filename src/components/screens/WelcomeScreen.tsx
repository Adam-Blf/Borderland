import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, X, ArrowRight, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore, useGameStore } from '@/stores'
import { cn } from '@/utils'

// Shuffle card animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
}

const shuffleInVariants = {
  hidden: {
    opacity: 0,
    x: -60,
    rotateY: -15,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 150,
    },
  },
}

const floatVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
}

const playerInputVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 200 },
  },
  exit: {
    opacity: 0,
    x: 60,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
}

export function WelcomeScreen() {
  const { navigateTo } = useAppStore()
  const { players, setPlayers } = useGameStore()

  const [names, setNames] = useState<string[]>(() =>
    players.length > 0 ? players.map((p) => p.name) : ['', '']
  )

  const addName = () => {
    if (names.length < 8) {
      setNames([...names, ''])
    }
  }

  const removeName = (index: number) => {
    if (names.length > 2) {
      setNames(names.filter((_, i) => i !== index))
    }
  }

  const updateName = (index: number, value: string) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const validNames = names.filter((n) => n.trim().length > 0)
  const canEnter = validNames.length >= 2

  const handleEnter = () => {
    if (canEnter) {
      setPlayers(names)
      navigateTo('hub')
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Decorative casino elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold corner flourishes */}
        <div className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-3xl" />
        <div className="absolute top-4 right-4 w-24 h-24 border-t-2 border-r-2 border-gold/30 rounded-tr-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 border-b-2 border-l-2 border-gold/30 rounded-bl-3xl" />
        <div className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-3xl" />

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header with logo */}
      <motion.div variants={shuffleInVariants} className="text-center mb-8 relative z-10">
        {/* Crown icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.5, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-4"
        >
          <Crown className="w-8 h-8 text-gold" />
        </motion.div>

        <h1 className="font-cinzel text-5xl sm:text-6xl font-bold mb-3 tracking-wide">
          <span className="text-ivory">BLACK</span>
          <span className="text-gold text-glow-gold">OUT</span>
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <Sparkles className="w-4 h-4 text-gold/60" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        <p className="text-text-secondary font-montserrat text-sm uppercase tracking-[0.2em]">
          Casino de Luxe
        </p>
      </motion.div>

      {/* VIP Card container */}
      <motion.div
        variants={floatVariants}
        className={cn(
          'w-full max-w-md lg:max-w-lg xl:max-w-xl relative z-10',
          'casino-card',
          'p-6 sm:p-8 lg:p-10'
        )}
      >
        {/* Inner gold frame */}
        <div className="absolute inset-4 border border-gold/20 rounded-xl pointer-events-none" />

        <div className="relative z-10">
          {/* VIP Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.6, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/40 mb-6"
          >
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm font-cinzel font-semibold text-gold uppercase tracking-wider">
              {validNames.length} High Roller{validNames.length !== 1 ? 's' : ''}
            </span>
          </motion.div>

          {/* Section title */}
          <h2 className="font-cinzel text-lg text-ivory/80 mb-4 tracking-wide">
            Guest List
          </h2>

          {/* Player inputs - VIP style */}
          <div className="space-y-3 mb-6">
            <AnimatePresence mode="popLayout">
              {names.map((name, index) => (
                <motion.div
                  key={index}
                  variants={playerInputVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex gap-3 items-center"
                >
                  {/* Player number badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-cinzel text-sm font-bold">{index + 1}</span>
                  </div>

                  {/* VIP Input */}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canEnter) {
                        handleEnter()
                      }
                    }}
                    placeholder={`Joueur ${index + 1}`}
                    maxLength={20}
                    className={cn(
                      'flex-1 vip-input',
                      'font-montserrat'
                    )}
                  />

                  {/* Remove button */}
                  {names.length > 2 && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeName(index)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-poker-red/10 border border-poker-red/30 flex items-center justify-center text-poker-red/60 hover:text-poker-red hover:border-poker-red/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add player button */}
          {names.length < 8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                color="gold"
                onClick={addName}
                className="w-full mb-6 border border-dashed border-gold/30 hover:border-gold/50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un joueur
              </Button>
            </motion.div>
          )}

          {/* Gold divider */}
          <div className="gold-divider mb-6" />

          {/* Enter button - Chip style */}
          <motion.div
            whileHover={{ scale: canEnter ? 1.02 : 1 }}
            whileTap={{ scale: canEnter ? 0.98 : 1 }}
          >
            <Button
              variant="chip"
              color="gold"
              size="xl"
              onClick={handleEnter}
              disabled={!canEnter}
              className={cn(
                'w-full',
                !canEnter && 'opacity-50'
              )}
            >
              <Crown className="w-5 h-5 mr-2" />
              ENTRER AU CASINO
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <p className="text-text-muted text-sm text-center mt-4 font-montserrat">
            Minimum 2 joueurs, maximum 8
          </p>
        </div>
      </motion.div>

      {/* Footer hint */}
      <motion.div
        variants={floatVariants}
        className="mt-8 text-center relative z-10"
      >
        <p className="text-text-muted/50 text-xs font-montserrat">
          Ces noms seront utilisés pour tous les jeux
        </p>

        {/* Decorative chips */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8 + i * 0.1, type: 'spring', damping: 15 }}
              className="w-3 h-3 rounded-full bg-gold/30 border border-gold/50"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
