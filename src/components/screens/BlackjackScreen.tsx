import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Spade, RotateCcw, Plus, Hand, ChevronsUp } from 'lucide-react'
import { useBlackjackStore } from '@/stores/blackjackStore'
import { useAppStore } from '@/stores/appStore'
import { useGameStore } from '@/stores/gameStore'
import { PlayingCard } from '@/components/game/PlayingCard'
import { Button } from '@/components/ui/Button'
import type { BlackjackPlayer, BlackjackHand } from '@/types'
import { cn } from '@/utils'

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: -50, rotateY: 180 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 200 },
  },
}

const resultVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, damping: 15, stiffness: 300 },
  },
}

// ============================================
// Helper Functions
// ============================================

const getHandDisplay = (hand: BlackjackHand): string => {
  if (hand.isBlackjack) return 'BLACKJACK!'
  if (hand.isBusted) return 'BUST!'
  if (hand.isSoft) return `${hand.value} (soft)`
  return `${hand.value}`
}

const getResultColor = (result?: string): string => {
  switch (result) {
    case 'blackjack':
    case 'win':
      return 'text-casino-green-light'
    case 'lose':
      return 'text-poker-red'
    case 'push':
      return 'text-gold'
    default:
      return 'text-ivory'
  }
}

const getResultText = (result?: string): string => {
  switch (result) {
    case 'blackjack':
      return '🎰 BLACKJACK! Tu donnes 3 gorgées!'
    case 'win':
      return '✅ Gagné! Tu donnes tes gorgées!'
    case 'lose':
      return '❌ Perdu! Tu bois tes gorgées!'
    case 'push':
      return '🤝 Égalité! Personne ne boit!'
    default:
      return ''
  }
}

// ============================================
// Sub-Components
// ============================================

interface HandDisplayProps {
  hand: BlackjackHand
  label: string
  isDealer?: boolean
  isRevealed?: boolean
  result?: string
}

const HandDisplay = ({ hand, label, isDealer, isRevealed = true, result }: HandDisplayProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'p-4 rounded-2xl',
        isDealer ? 'bg-poker-red/10 border border-poker-red/30' : 'bg-gold/10 border border-gold/30'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'font-cinzel font-bold',
          isDealer ? 'text-poker-red-light' : 'text-gold'
        )}>
          {label}
        </span>
        <span className={cn(
          'text-2xl font-bold font-cinzel',
          hand.isBlackjack && 'text-gold text-glow-gold',
          hand.isBusted && 'text-poker-red',
          !hand.isBlackjack && !hand.isBusted && (isDealer ? 'text-poker-red-light' : 'text-gold')
        )}>
          {isRevealed ? getHandDisplay(hand) : '?'}
        </span>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {hand.cards.map((card, index) => (
          <motion.div key={card.id} variants={cardVariants}>
            <PlayingCard
              card={card}
              size="sm"
              isRevealed={isRevealed || index === 0}
            />
          </motion.div>
        ))}
      </div>

      {result && (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          className={cn('mt-3 text-center font-semibold', getResultColor(result))}
        >
          {getResultText(result)}
        </motion.div>
      )}
    </motion.div>
  )
}

interface BettingPhaseProps {
  players: BlackjackPlayer[]
  onPlaceBet: (playerId: string, amount: number) => void
  onStartGame: () => void
}

const BettingPhase = ({ players, onPlaceBet, onStartGame }: BettingPhaseProps) => {
  const [bets, setBets] = useState<Record<string, number>>({})

  const handleBetChange = (playerId: string, delta: number) => {
    const currentBet = bets[playerId] || 1
    const newBet = Math.max(1, Math.min(10, currentBet + delta))
    setBets({ ...bets, [playerId]: newBet })
    onPlaceBet(playerId, newBet)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      <h2 className="text-2xl font-cinzel text-gold text-center mb-6">
        Placez vos paris !
      </h2>
      <p className="text-center text-ivory/60 text-sm mb-4">
        Pariez des gorgées (1-10). Si vous perdez, vous buvez !
      </p>

      {players.map(player => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gold/20"
        >
          <span className="font-cinzel text-gold">{player.name}</span>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              color="gold"
              onClick={() => handleBetChange(player.id, -1)}
            >
              -
            </Button>
            <span className="text-2xl font-bold text-gold w-12 text-center">
              {bets[player.id] || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              color="gold"
              onClick={() => handleBetChange(player.id, 1)}
            >
              +
            </Button>
            <span className="text-ivory/60 text-sm">gorgées</span>
          </div>
        </div>
      ))}

      <Button
        variant="chip"
        color="gold"
        size="lg"
        className="w-full mt-6"
        onClick={() => {
          // Set default bets
          players.forEach(p => {
            if (!bets[p.id]) onPlaceBet(p.id, 1)
          })
          onStartGame()
        }}
      >
        Distribuer les cartes
      </Button>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

export function BlackjackScreen() {
  const { goToHub } = useAppStore()
  const { players: gamePlayers } = useGameStore()
  const {
    phase,
    players,
    dealer,
    currentPlayerIndex,
    initGame,
    placeBet,
    startDealing,
    hit,
    stand,
    doubleDown,
    newRound,
    getCurrentPlayer,
    canHit,
    canDoubleDown,
  } = useBlackjackStore()

  // Initialize game with existing players
  useEffect(() => {
    if (players.length === 0) {
      const playerNames = gamePlayers.length > 0
        ? gamePlayers.map(p => p.name)
        : ['Joueur 1', 'Joueur 2']
      initGame(playerNames)
    }
  }, [gamePlayers, initGame, players.length])

  const handlePlayAgain = () => {
    newRound()
  }

  const currentPlayer = getCurrentPlayer()

  return (
    <div className="min-h-screen bg-velvet-deep flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 px-4 py-3 backdrop-blur-xl bg-velvet/80 border-b border-gold/20"
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={goToHub}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-montserrat text-sm">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <Spade className="w-6 h-6 text-poker-red" />
            <h1 className="font-cinzel text-xl text-gold text-glow-gold">Blackjack</h1>
          </div>

          <div className="text-sm text-ivory/60">
            {phase === 'betting' && '💰 Paris'}
            {phase === 'playerTurn' && '🎯 À toi'}
            {phase === 'dealerTurn' && '🎰 Dealer'}
            {phase === 'result' && '📊 Résultats'}
          </div>
        </div>
      </motion.header>

      {/* Rules Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mt-4 p-3 rounded-xl bg-black/40 border border-gold/20"
      >
        <div className="flex flex-wrap justify-center gap-4 text-xs text-ivory/60">
          <span>🎯 But: Se rapprocher de 21 sans dépasser</span>
          <span>👑 Figures = 10</span>
          <span>🅰️ As = 1 ou 11</span>
        </div>
      </motion.div>

      {/* Game Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Betting Phase */}
          {phase === 'betting' && (
            <BettingPhase
              players={players}
              onPlaceBet={placeBet}
              onStartGame={startDealing}
            />
          )}

          {/* Game Phase */}
          {(phase === 'playerTurn' || phase === 'dealerTurn' || phase === 'result') && (
            <>
              {/* Dealer Hand */}
              <HandDisplay
                hand={dealer.hand}
                label="Croupier"
                isDealer
                isRevealed={dealer.isRevealed || phase === 'result'}
              />

              {/* Players */}
              {players.map((player, index) => (
                <div key={player.id}>
                  <HandDisplay
                    hand={player.hand}
                    label={`${player.name} (${player.bet} gorgées)`}
                    result={phase === 'result' ? player.result : undefined}
                  />

                  {/* Action Buttons for Current Player */}
                  {phase === 'playerTurn' && index === currentPlayerIndex && !player.isStanding && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center gap-3 mt-4"
                    >
                      <Button
                        variant="chip"
                        color="gold"
                        onClick={hit}
                        disabled={!canHit()}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Carte
                      </Button>
                      <Button
                        variant="chip"
                        color="red"
                        onClick={stand}
                        className="gap-2"
                      >
                        <Hand className="w-4 h-4" />
                        Rester
                      </Button>
                      {canDoubleDown() && (
                        <Button
                          variant="chip"
                          color="purple"
                          onClick={doubleDown}
                          className="gap-2"
                        >
                          <ChevronsUp className="w-4 h-4" />
                          Doubler
                        </Button>
                      )}
                    </motion.div>
                  )}

                  {/* Waiting indicator */}
                  {phase === 'playerTurn' && index !== currentPlayerIndex && !player.isStanding && (
                    <p className="text-center text-ivory/40 text-sm mt-2">En attente...</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Current Player Indicator */}
      {phase === 'playerTurn' && currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-velvet/90 backdrop-blur-xl border-t border-gold/20"
        >
          <p className="text-center text-gold font-cinzel">
            C'est au tour de <span className="font-bold">{currentPlayer.name}</span>
          </p>
        </motion.div>
      )}

      {/* Dealer Turn Indicator */}
      {phase === 'dealerTurn' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-velvet/90 backdrop-blur-xl border-t border-poker-red/20"
        >
          <p className="text-center text-poker-red font-cinzel animate-pulse">
            Le croupier joue...
          </p>
        </motion.div>
      )}

      {/* Result Actions */}
      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-velvet/90 backdrop-blur-xl border-t border-gold/20"
        >
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              color="gold"
              onClick={goToHub}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              variant="chip"
              color="gold"
              onClick={handlePlayAgain}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Nouvelle manche
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
