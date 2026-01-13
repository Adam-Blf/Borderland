/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blackout: '#0a0a0a',
        'neon-green': '#39ff14',
        'neon-purple': '#bc13fe',
        'neon-red': '#ff073a',
        'neon-green-dim': '#39ff1440',
        'neon-purple-dim': '#bc13fe40',
        'neon-red-dim': '#ff073a40',
        gold: '#d4af37',
        'gold-dim': '#d4af3740',
        surface: '#121212',
        'surface-elevated': '#1a1a1a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-muted': '#666666',
      },
    },
  },
  plugins: [],
}
