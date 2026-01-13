import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { GameBoard } from '@/components/game'
import { HubScreen, RulesScreen } from '@/components/screens'
import { useGameStore, useAppStore } from '@/stores'
import { cn } from '@/utils'

function SetupScreen({ onStart }: { onStart: (names: string[]) => void }) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
  const { activeNeonColor } = useAppStore()

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

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, ''])
    }
  }

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index))
    }
  }

  const updatePlayer = (index: number, name: string) => {
    const updated = [...playerNames]
    updated[index] = name
    setPlayerNames(updated)
  }

  const canStart = playerNames.filter(n => n.trim()).length >= 2

  const sanitizePlayerName = (name: string): string => {
    return name.trim().slice(0, 20).replace(/[<>]/g, '')
  }

  const handleStart = () => {
    const validNames = playerNames
      .map(sanitizePlayerName)
      .filter(n => n.length > 0)
    if (validNames.length >= 2) {
      onStart(validNames)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-blackout flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Title */}
        <h1 className={cn('text-5xl font-bold mb-2 text-center', glowClass)}>
          <span className={textClass}>BLACK</span>
          <span className="text-text-primary">OUT</span>
        </h1>
        <p className="text-text-muted text-center mb-8">Le jeu de cartes qui fait mal</p>

        {/* Player Inputs */}
        <div className="space-y-3 mb-6">
          {playerNames.map((name, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Joueur ${index + 1}`}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg',
                  'bg-surface border border-text-muted/30',
                  'text-text-primary placeholder:text-text-muted',
                  'focus:outline-none focus:border-neon-green',
                  'transition-colors'
                )}
              />
              {playerNames.length > 2 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="px-3 text-neon-red hover:text-neon-red/80 transition-colors"
                >
                  X
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Player Button */}
        {playerNames.length < 8 && (
          <Button
            variant="ghost"
            color="purple"
            onClick={addPlayer}
            className="w-full mb-6"
          >
            <Users className="w-4 h-4 mr-2" />
            Ajouter un joueur
          </Button>
        )}

        {/* Start Button */}
        <Button
          color="green"
          size="lg"
          onClick={handleStart}
          disabled={!canStart}
          className={cn('w-full py-5 text-xl', !canStart && 'opacity-50 cursor-not-allowed')}
        >
          <Play className="w-5 h-5 mr-2" />
          COMMENCER
        </Button>

        <p className="text-text-muted text-sm text-center mt-4">
          Minimum 2 joueurs requis
        </p>
      </motion.div>
    </motion.div>
  )
}

// Screen transition variants
const screenVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

function App() {
  const { gamePhase, initGame, resetGame } = useGameStore()
  const { currentScreen, goToHub } = useAppStore()

  const handleStart = (names: string[]) => {
    initGame(names)
  }

  const handleReset = () => {
    resetGame()
  }

  const handleQuitToHub = () => {
    resetGame()
    goToHub()
  }

  // Render the appropriate screen based on navigation state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'hub':
        return (
          <motion.div
            key="hub"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <HubScreen />
          </motion.div>
        )

      case 'rules':
        return (
          <motion.div
            key="rules"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <RulesScreen />
          </motion.div>
        )

      case 'game':
        // Game screen handles its own internal navigation (setup/playing)
        return (
          <AnimatePresence mode="wait">
            {gamePhase === 'setup' ? (
              <SetupScreen key="setup" onStart={handleStart} />
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GameBoard onQuit={handleQuitToHub} />

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className={cn(
                    'fixed top-4 right-4 z-40',
                    'p-3 rounded-full',
                    'bg-surface-elevated border border-text-muted/30',
                    'text-text-muted hover:text-neon-red',
                    'transition-colors'
                  )}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  )
}

export default App
