import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { GameBoard } from '@/components/game'
import { HubScreen, PromptGameScreen, RulesScreen, GameRulesScreen, FalucheRulesScreen, WelcomeScreen, PalmTreeScreen, HorseRaceScreen, NinetyNineScreen, BlackjackScreen } from '@/components/screens'
import { InstallPrompt } from '@/components/ui'
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
  const { currentScreen, navigateTo, goToHub, currentRulesGame, currentClassicRulesGame } = useAppStore()

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
            {currentClassicRulesGame ? (
              <FalucheRulesScreen gameId={currentClassicRulesGame} />
            ) : currentRulesGame ? (
              <GameRulesScreen gameId={currentRulesGame} />
            ) : (
              <RulesScreen />
            )}
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

      case 'promptGame':
        return (
          <motion.div
            key="promptGame"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <PromptGameScreen />
          </motion.div>
        )

      case 'palmTree':
        return (
          <motion.div
            key="palmTree"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <PalmTreeScreen />
          </motion.div>
        )

      case 'horseRace':
        return (
          <motion.div
            key="horseRace"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <HorseRaceScreen />
          </motion.div>
        )

      case 'ninetyNine':
        return (
          <motion.div
            key="ninetyNine"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <NinetyNineScreen />
          </motion.div>
        )

      case 'blackjack':
        return (
          <motion.div
            key="blackjack"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25 }}
          >
            <BlackjackScreen />
          </motion.div>
        )
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      {/* iOS Safari install prompt */}
      <InstallPrompt />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  )
}

export default App
