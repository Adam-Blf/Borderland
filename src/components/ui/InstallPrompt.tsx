import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share, X, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils'

// Check if running on iOS Safari (not in standalone mode)
function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua)
  const webkit = /WebKit/.test(ua)
  const notChrome = !/CriOS/.test(ua)
  const notFirefox = !/FxiOS/.test(ua)

  return iOS && webkit && notChrome && notFirefox
}

// Check if app is already installed (standalone mode)
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false

  return (
    ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  )
}

const DISMISS_KEY = 'blackout-install-prompt-dismissed'

export function InstallPrompt() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on iOS Safari, not in standalone mode, and not dismissed
    const dismissed = localStorage.getItem(DISMISS_KEY)
    const shouldShow = isIOSSafari() && !isStandalone() && !dismissed

    // Small delay for better UX
    if (shouldShow) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(DISMISS_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'safe-area-bottom'
          )}
        >
          {/* Backdrop blur background */}
          <div className="mx-4 mb-4 p-4 rounded-2xl bg-velvet/95 backdrop-blur-xl border border-gold/30 shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-gold/70" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 pr-8">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center">
                <Share className="w-6 h-6 text-gold" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-cinzel text-lg text-ivory mb-1">
                  Installer Black Out
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t('common.installPrompt')}
                </p>

                {/* Visual instruction */}
                <div className="flex items-center gap-2 mt-3 text-xs text-gold/80">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-gold/10 border border-gold/20">
                    <Share className="w-3.5 h-3.5" />
                    <span>Partager</span>
                  </div>
                  <span className="text-gold/50">→</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-gold/10 border border-gold/20">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sur l'écran d'accueil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
