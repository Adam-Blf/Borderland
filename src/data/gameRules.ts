import type { CardGameType } from '@/types'

/**
 * Game rules data for all card games
 * Rules scraped and adapted for BlackOut casino theme
 */

export interface GameRule {
  title: string
  description: string
  items?: string[]
}

export interface GameRulesData {
  id: CardGameType
  title: string
  subtitle: string
  intro: string
  sections: GameRule[]
  tips?: string[]
}

export const GAME_RULES: Record<CardGameType, GameRulesData> = {
  // Le Borderland - Original game
  game: {
    id: 'game',
    title: 'Le Borderland',
    subtitle: '52 cartes, 4 règles, 0 pitié',
    intro: 'Tire une carte, découvre son pouvoir. Distribue des gorgées, ou bois-les. Conteste si tu oses. Survie si tu peux.',
    sections: [
      {
        title: 'Trèfle ♣ - Le Guess',
        description: 'La carte est FACE CACHÉE. Demande à un joueur de deviner sa valeur exacte (ex: Roi). Clique pour révéler.',
        items: [
          'S\'il a juste → Tu distribues la valeur de la carte',
          'S\'il a faux → Il boit la valeur de la carte',
        ],
      },
      {
        title: 'Carreau ♦ - L\'Action',
        description: 'Donne une action au joueur de ton choix.',
        items: [
          'S\'il refuse ou échoue → Il boit la valeur de la carte',
          'S\'il réussit → Tu distribues la valeur de la carte',
        ],
      },
      {
        title: 'Coeur ♥ - La Question',
        description: 'Pose une question au joueur de ton choix.',
        items: [
          'S\'il refuse de répondre → Il boit la valeur de la carte',
          'S\'il répond → Tu distribues la valeur de la carte',
        ],
      },
      {
        title: 'Pique ♠ - La Contrainte',
        description: 'Donne une contrainte à accomplir au joueur de ton choix.',
        items: [
          'S\'il refuse ou échoue → Il boit la valeur de la carte',
          'S\'il réussit → Tu distribues la valeur de la carte',
        ],
      },
      {
        title: 'Système de Contest',
        description: 'Tu peux contester la décision et doubler la mise !',
        items: [
          'Niveau 1 : x1 (mise de base)',
          'Niveau 2 : x2 (premier contest)',
          'Niveau 3 : x4 (contest ultime)',
        ],
      },
    ],
    tips: [
      'As = SHOT obligatoire',
      'Figures (V, D, R) = 10 gorgées',
      'Cartes numériques = leur valeur en gorgées',
    ],
  },

  // Le Palmier
  palmTree: {
    id: 'palmTree',
    title: 'Le Palmier',
    subtitle: 'Rouge tu bois, Noir tu donnes',
    intro: 'Un classique indémodable. Les cartes sont disposées en cercle avec une carte centrale. Chaque carte tirée déclenche une action selon sa couleur.',
    sections: [
      {
        title: 'Mise en place',
        description: 'Dispose les cartes en cercle autour d\'une carte centrale face cachée (le tronc).',
        items: [
          '8 à 12 cartes en cercle selon le nombre de joueurs',
          '1 carte centrale = le tronc du palmier',
        ],
      },
      {
        title: 'Carte Rouge (♥ ♦)',
        description: 'Tu bois la valeur de la carte !',
        items: [
          'As = 1 gorgée (ou shot selon les règles)',
          'Figures = 10 gorgées',
          'Numériques = leur valeur',
        ],
      },
      {
        title: 'Carte Noire (♠ ♣)',
        description: 'Tu distribues la valeur de la carte !',
        items: [
          'Tu peux répartir entre plusieurs joueurs',
          'Ou tout donner à une seule personne',
        ],
      },
      {
        title: 'Le Tronc',
        description: 'Quand toutes les cartes du cercle sont tirées, on révèle le tronc.',
        items: [
          'Rouge = Tout le monde boit la valeur',
          'Noir = Le dernier joueur à avoir tiré distribue le double',
        ],
      },
    ],
    tips: [
      'Plus de cartes = partie plus longue',
      'Commencez par désigner un sens de rotation',
    ],
  },

  // Le PMU (Horse Race)
  horseRace: {
    id: 'horseRace',
    title: 'Le PMU',
    subtitle: 'Mise sur ton As favori',
    intro: 'Une course de chevaux épique ! Les 4 As s\'affrontent sur la piste. Mise des gorgées sur ton favori et regarde-le galoper vers la victoire... ou pas.',
    sections: [
      {
        title: 'Mise en place',
        description: 'Les 4 As sont alignés sur la ligne de départ.',
        items: [
          'Pique ♠ - Le cheval noir',
          'Coeur ♥ - Le cheval rouge',
          'Carreau ♦ - Le cheval orange',
          'Trèfle ♣ - Le cheval vert',
        ],
      },
      {
        title: 'Phase de Paris',
        description: 'Chaque joueur mise un nombre de gorgées sur un As.',
        items: [
          'Minimum 1 gorgée',
          'Maximum selon votre courage',
          'Note ta mise !',
        ],
      },
      {
        title: 'La Course',
        description: 'On tire les cartes du paquet une par une.',
        items: [
          'La couleur de la carte fait avancer l\'As correspondant',
          'Premier As à franchir la ligne d\'arrivée gagne',
        ],
      },
      {
        title: 'Résultats',
        description: 'La course est terminée !',
        items: [
          'Gagnants : Vous distribuez le double de votre mise',
          'Perdants : Vous buvez votre mise',
        ],
      },
    ],
    tips: [
      'Les statistiques ne mentent jamais... sauf ici',
      'Le favori n\'est pas toujours celui qu\'on croit',
    ],
  },

  // Le 99
  ninetyNine: {
    id: 'ninetyNine',
    title: 'Le 99',
    subtitle: 'Ne dépasse pas la limite',
    intro: 'Un jeu de stratégie où chaque carte compte ! Joue tes cartes intelligemment pour ne pas faire exploser le compteur au-delà de 99.',
    sections: [
      {
        title: 'Mise en place',
        description: 'Chaque joueur reçoit 3 cartes. Le compteur commence à 0.',
        items: [
          'Distribution de 3 cartes par joueur',
          'Le reste forme la pioche',
          'On joue dans le sens des aiguilles d\'une montre',
        ],
      },
      {
        title: 'Tour de jeu',
        description: 'À ton tour, joue une carte et pioche.',
        items: [
          'Ajoute la valeur de ta carte au total',
          'Pioche une nouvelle carte',
          'Passe au joueur suivant',
        ],
      },
      {
        title: 'Cartes Spéciales',
        description: 'Certaines cartes ont des pouvoirs uniques !',
        items: [
          '4 = Inverse le sens du jeu',
          '9 = Valeur 0 (passe le tour)',
          '10 = Retire 10 au total',
          'Roi = Place le total à 99',
          'As = +1 ou +11 au choix',
        ],
      },
      {
        title: 'Élimination',
        description: 'Si tu dépasses 99, tu perds une vie !',
        items: [
          'Chaque joueur a 3 vies',
          'Dépasser 99 = perdre une vie + boire un shot',
          'Plus de vies = éliminé',
        ],
      },
    ],
    tips: [
      'Garde tes 4 et 10 pour les urgences',
      'Le Roi est ton meilleur ami à 88+',
    ],
  },

  // Blackjack
  blackjack: {
    id: 'blackjack',
    title: 'Blackjack',
    subtitle: 'Bats le croupier',
    intro: 'Le classique des casinos version à boire ! Approche-toi le plus possible de 21 sans dépasser. Mise des gorgées et tente ta chance contre la maison.',
    sections: [
      {
        title: 'Valeurs des cartes',
        description: 'Connais la valeur de tes cartes.',
        items: [
          'As = 1 ou 11 (au choix)',
          'Figures (V, D, R) = 10',
          'Cartes numériques = leur valeur',
        ],
      },
      {
        title: 'Phase de Paris',
        description: 'Mise un nombre de gorgées avant de recevoir tes cartes.',
        items: [
          'Minimum 1 gorgée',
          'Maximum 10 gorgées',
        ],
      },
      {
        title: 'Tour de jeu',
        description: 'Deux options s\'offrent à toi.',
        items: [
          'Tirer (Hit) = Prendre une carte supplémentaire',
          'Rester (Stand) = Garder ta main actuelle',
          'Doubler = Doubler ta mise et tirer une seule carte',
        ],
      },
      {
        title: 'Résultats',
        description: 'Compare ta main à celle du croupier.',
        items: [
          'Blackjack (21 en 2 cartes) = Tu distribues le triple de ta mise',
          'Gagner = Tu distribues le double de ta mise',
          'Égalité (Push) = Rien ne se passe',
          'Perdre ou Bust = Tu bois ta mise',
        ],
      },
    ],
    tips: [
      'Le croupier tire toujours jusqu\'à 17',
      'Avec 11, double si le croupier a 2-10',
      'Ne jamais split les 10 !',
    ],
  },
}

/**
 * Get rules for a specific game
 */
export function getGameRules(gameId: CardGameType): GameRulesData | undefined {
  return GAME_RULES[gameId]
}
