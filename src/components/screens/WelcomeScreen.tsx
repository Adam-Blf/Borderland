import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, X, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAppStore, useGameStore } from '@/stores'
import { cn } from '@/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 200 },
  },
}

export function WelcomeScreen() {
  const { navigateTo } = useAppStore()
  const { players, setPlayers } = useGameStore()

  // Initialize with existing players or 2 empty slots
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
      className="min-h-screen bg-blackout flex flex-col items-center justify-center p-6"
    >
      {/* Header with logo */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h1 className="font-playfair text-5xl sm:text-6xl font-bold mb-2">
          <span className="text-ivory">BLACK</span>
          <span className="text-gold text-glow-gold">OUT</span>
        </h1>
        <p className="text-text-muted">Check-in des joueurs</p>
      </motion.div>

      {/* Card container */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'w-full max-w-md',
          'relative overflow-hidden rounded-2xl',
          'bg-obsidian-light border border-gold/40',
          'p-6 sm:p-8'
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 pointer-events-none" />
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/20 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/20 rounded-br-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Users className="w-3 h-3 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-wider">
              {validNames.length} joueur{validNames.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Player inputs */}
          <div className="space-y-3 mb-6">
            <AnimatePresence mode="popLayout">
              {names.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="flex gap-2"
                >
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
                      'flex-1 px-4 py-3 rounded-lg',
                      'bg-blackout border border-gold/30',
                      'text-ivory placeholder:text-text-muted',
                      'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50',
                      'transition-all duration-200'
                    )}
                  />
                  {names.length > 2 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeName(index)}
                      className="px-3 text-gold/60 hover:text-gold transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add player button */}
          {names.length < 8 && (
            <Button
              variant="ghost"
              color="gold"
              onClick={addName}
              className="w-full mb-6"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un joueur
            </Button>
          )}

          {/* Enter button */}
          <Button
            color="gold"
            size="lg"
            onClick={handleEnter}
            disabled={!canEnter}
            className={cn(
              'w-full py-5 text-xl',
              !canEnter && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ENTRER DANS LE CASINO
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-text-muted text-sm text-center mt-4">
            Minimum 2 joueurs, maximum 8
          </p>
        </div>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        variants={itemVariants}
        className="text-text-muted/50 text-xs mt-8 text-center"
      >
        Ces noms seront utilisés pour tous les jeux
      </motion.p>
    </motion.div>
  )
}
