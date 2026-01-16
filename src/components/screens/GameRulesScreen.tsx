import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Lightbulb } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { getGameRules } from '@/data/gameRules'
import type { CardGameType } from '@/types'
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 100 },
  },
}

// ============================================
// Sub-Components
// ============================================

interface RuleSectionProps {
  title: string
  description: string
  items?: string[]
  index: number
}

function RuleSection({ title, description, items, index }: RuleSectionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'relative p-5 rounded-2xl',
        'bg-gradient-to-br from-velvet/80 to-black/40',
        'border border-gold/20',
        'shadow-lg'
      )}
    >
      {/* Section number badge */}
      <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
        <span className="text-gold font-cinzel font-bold text-sm">{index + 1}</span>
      </div>

      <h3 className="font-cinzel text-lg font-bold text-gold mb-2 ml-4">
        {title}
      </h3>

      <p className="text-ivory/80 font-montserrat text-sm leading-relaxed mb-3">
        {description}
      </p>

      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-ivory/70 font-montserrat"
            >
              <span className="text-gold mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

interface TipsSectionProps {
  tips: string[]
}

function TipsSection({ tips }: TipsSectionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'p-5 rounded-2xl',
        'bg-gradient-to-br from-gold/10 to-gold/5',
        'border border-gold/30'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-gold" />
        <h3 className="font-cinzel text-lg font-bold text-gold">
          Conseils de Pro
        </h3>
      </div>

      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-ivory/80 font-montserrat"
          >
            <Sparkles className="w-4 h-4 text-gold/60 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

interface GameRulesScreenProps {
  gameId: CardGameType
}

export function GameRulesScreen({ gameId }: GameRulesScreenProps) {
  const { goToHub } = useAppStore()
  const rules = getGameRules(gameId)

  if (!rules) {
    return (
      <div className="min-h-screen bg-velvet-deep flex items-center justify-center">
        <p className="text-ivory/60 font-montserrat">Règles non disponibles</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-velvet-deep">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 px-4 py-4 backdrop-blur-xl bg-velvet/80 border-b border-gold/20"
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={goToHub}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-montserrat text-sm">Retour</span>
          </button>

          <h1 className="font-cinzel text-xl text-gold text-glow-gold">
            Règles
          </h1>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 max-w-2xl mx-auto space-y-6"
      >
        {/* Game Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="font-cinzel text-3xl font-bold text-ivory mb-2">
            {rules.title}
          </h2>
          <p className="text-gold/70 font-montserrat text-sm uppercase tracking-wider">
            {rules.subtitle}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl bg-black/40 border border-gold/20 text-center"
        >
          <p className="text-ivory/80 font-montserrat text-sm leading-relaxed italic">
            "{rules.intro}"
          </p>
        </motion.div>

        {/* Rules Sections */}
        <div className="space-y-4">
          {rules.sections.map((section, index) => (
            <RuleSection
              key={index}
              title={section.title}
              description={section.description}
              items={section.items}
              index={index}
            />
          ))}
        </div>

        {/* Tips */}
        {rules.tips && rules.tips.length > 0 && (
          <TipsSection tips={rules.tips} />
        )}

        {/* Footer spacing */}
        <div className="h-8" />
      </motion.main>
    </div>
  )
}
