import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { GameBoard } from '@/components/game'
import { HubScreen, RulesScreen, WelcomeScreen } from '@/components/screens'
import { useGameStore, useAppStore } from '@/stores'
import { cn } from '@/utils'

// Screen transition variants
const screenVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

function App() {
  const { gamePhase, initGame, resetGame, hasPlayers } = useGameStore()
  const { currentScreen, navigateTo, goToHub } = useAppStore()

  // Auto-redirect to welcome if no players configured
  useEffect(() => {
    if (currentScreen !== 'welcome' && !hasPlayers()) {
      navigateTo('welcome')
    }
  }, [currentScreen, hasPlayers, navigateTo])

  const handlePlayGame = () => {
    if (hasPlayers()) {
      initGame()
      navigateTo('game')
    }
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
      case 'welcome':
        return (
          <motion.div
            key="welcome"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <WelcomeScreen />
          </motion.div>
        )

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
            <HubScreen onPlayGame={handlePlayGame} />
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
        // Game phase: 'setup' should no longer happen since players are pre-configured
        // But we handle it just in case by redirecting to welcome
        if (gamePhase === 'setup') {
          navigateTo('welcome')
          return null
        }

        return (
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
