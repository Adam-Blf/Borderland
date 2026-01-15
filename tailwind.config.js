/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Casino de Luxe Theme
        'casino-green': '#0a3622',
        'casino-green-light': '#0d4a2d',
        'casino-green-dark': '#072718',
        'felt': '#0a3622',
        'felt-light': '#0d4a2d',

        // Velvet Black (alternative luxe)
        'velvet': '#1a1a1a',
        'velvet-deep': '#0f0f0f',

        // Gold Leaf - Luxe accents
        gold: '#d4af37',
        'gold-light': '#e8c84a',
        'gold-pale': '#f5e6b3',
        'gold-dim': 'rgba(212, 175, 55, 0.2)',
        'gold-muted': 'rgba(212, 175, 55, 0.4)',
        'gold-glow': 'rgba(212, 175, 55, 0.6)',

        // Poker Red - Danger/Contest
        'poker-red': '#b91c1c',
        'poker-red-light': '#dc2626',
        'poker-red-dim': 'rgba(185, 28, 28, 0.3)',

        // Ivory & Cream
        ivory: '#f5f5f0',
        cream: '#faf8f0',

        // Legacy support
        blackout: '#0a3622',
        obsidian: '#0a0a0a',
        'obsidian-light': '#141414',
        'neon-green': '#39ff14',
        'neon-purple': '#bc13fe',
        'neon-red': '#ff073a',
        'neon-green-dim': '#39ff1440',
        'neon-purple-dim': '#bc13fe40',
        'neon-red-dim': '#ff073a40',

        // Surfaces - Casino Style
        surface: '#072718',
        'surface-elevated': '#0d4a2d',
        'surface-card': 'rgba(10, 54, 34, 0.8)',

        // Text
        'text-primary': '#f5f5f0',
        'text-secondary': '#c9b896',
        'text-muted': '#6b7b70',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        // Felt texture gradient
        'felt-texture': 'radial-gradient(ellipse at 50% 50%, #0d4a2d 0%, #0a3622 50%, #072718 100%)',
        // Gold shimmer
        'gold-shimmer': 'linear-gradient(135deg, #d4af37 0%, #f5e6b3 50%, #d4af37 100%)',
        // Chip pattern
        'chip-pattern': 'repeating-conic-gradient(from 0deg, #d4af37 0deg 15deg, transparent 15deg 30deg)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)',
        'gold-inner': 'inset 0 2px 4px rgba(212, 175, 55, 0.3)',
        'chip': '0 4px 0 #8b7a2c, 0 6px 10px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
        'chip-pressed': '0 2px 0 #8b7a2c, 0 3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
        'card-luxe': '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.1)',
        'red-glow': '0 0 20px rgba(185, 28, 28, 0.4), 0 0 40px rgba(185, 28, 28, 0.2)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shuffle': 'shuffle 0.6s ease-out',
        'deal': 'deal 0.4s ease-out',
        'chip-stack': 'chipStack 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slot-spin': 'slotSpin 0.1s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shuffle: {
          '0%': { transform: 'translateX(-100%) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'translateX(10%) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'translateX(0) rotate(0)', opacity: '1' },
        },
        deal: {
          '0%': { transform: 'translateY(-50px) rotate(-180deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0) scale(1)', opacity: '1' },
        },
        chipStack: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '60%': { transform: 'translateY(5px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)' },
        },
        slotSpin: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
