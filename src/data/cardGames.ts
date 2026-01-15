import type { CardGameConfig, CardGameType } from '@/types'

/**
 * Configuration for card-based drinking games
 * These are different from prompt-based games and use a deck of cards
 */
export const CARD_GAMES: CardGameConfig[] = [
  {
    id: 'palmTree',
    title: 'Le Palmier',
    subtitle: 'Vue du dessus',
    description: 'Rouge tu bois, Noir tu donnes. Le tronc décide du final !',
    icon: 'TreePalm',
    accentColor: 'green',
  },
  {
    id: 'horseRace',
    title: 'Le PMU',
    subtitle: 'Course de chevaux',
    description: 'Mise sur ton As favori. Les perdants boivent leur mise !',
    icon: 'Trophy',
    accentColor: 'gold',
  },
  {
    id: 'ninetyNine',
    title: 'Le 99',
    subtitle: 'Ne dépasse pas !',
    description: 'Joue tes cartes sans dépasser 99. Celui qui bust boit un shot !',
    icon: 'Hash',
    accentColor: 'purple',
  },
  {
    id: 'blackjack',
    title: 'Blackjack',
    subtitle: 'Approche 21',
    description: 'Bats le croupier sans dépasser 21. Perds et tu bois ta mise !',
    icon: 'Spade',
    accentColor: 'red',
  },
]

/**
 * Get a card game config by its ID
 */
export function getCardGameConfig(id: CardGameType): CardGameConfig | undefined {
  return CARD_GAMES.find((game) => game.id === id)
}
