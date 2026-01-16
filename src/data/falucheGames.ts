import type { FalucheGameType, FalucheGameConfig, FalucheGameCategory } from '@/types'
import type { GameRule } from './gameRules'

/**
 * Faluche Games - Règles extraites de faluche.app/jeux
 * Jeux traditionnels de la communauté étudiante française
 */

// ============================================
// Game Configurations
// ============================================

export const FALUCHE_GAMES: FalucheGameConfig[] = [
  {
    id: 'biskit',
    title: 'Biskit',
    subtitle: 'Le classique des dés',
    description: 'Lancez les dés et suivez les règles des combinaisons. Attention au double 3 !',
    category: 'DICE',
    icon: 'Dices',
    accentColor: 'amber',
  },
  {
    id: 'quatre21',
    title: '421',
    subtitle: 'Le roi des dés',
    description: 'Obtenez la meilleure combinaison possible avec 3 dés. Le 421 est imbattable !',
    category: 'DICE',
    icon: 'Dices',
    accentColor: 'amber',
  },
  {
    id: 'monFoieEstMonGlaive',
    title: 'Mon Foie Est Mon Glaive',
    subtitle: 'Dieu, Héro, Écuyer...',
    description: 'Jeu de dés complexe avec rôles. Devenez Dieu et distribuez, ou restez héro !',
    category: 'DICE',
    icon: 'Swords',
    accentColor: 'violet',
  },
  {
    id: 'purple',
    title: 'Purple',
    subtitle: 'Rouge, Noir ou Purple ?',
    description: 'Devinez la couleur de la carte. Purple = double mise, double risque !',
    category: 'CARD',
    icon: 'Layers',
    accentColor: 'violet',
  },
  {
    id: 'chevre',
    title: 'Chèvre',
    subtitle: 'Beer Pong à la française',
    description: 'Gobelets, balles de ping-pong et rapidité. Flip ton verre avant ton adversaire !',
    category: 'ORAL',
    icon: 'Target',
    accentColor: 'rose',
  },
  {
    id: 'flipCup',
    title: 'Flip Cup',
    subtitle: 'Le relai ultime',
    description: 'Course par équipe. Bois, pose, flip ! La première équipe complète gagne.',
    category: 'ORAL',
    icon: 'Trophy',
    accentColor: 'cyan',
  },
]

// ============================================
// Game Rules Data
// ============================================

export interface FalucheGameRules {
  id: FalucheGameType
  title: string
  subtitle: string
  intro: string
  sections: GameRule[]
  tips?: string[]
}

export const FALUCHE_RULES: Record<FalucheGameType, FalucheGameRules> = {
  // Biskit
  biskit: {
    id: 'biskit',
    title: 'Biskit',
    subtitle: 'Le classique des dés',
    intro: 'Les joueurs doivent lancer les dés les uns après les autres. Certaines combinaisons de dés vont entraîner des actions. Le jeu connaît beaucoup de variantes, voici une des versions les plus célèbres.',
    sections: [
      {
        title: 'La somme des dés est 6',
        description: 'Le joueur précédent boit une gorgée et le joueur actuel rejoue.',
      },
      {
        title: 'La somme des dés est 7',
        description: 'Tous les joueurs doivent mettre leur pouce sur leur front et crier « Biskit ».',
        items: [
          'Le dernier à le faire boit une gorgée',
          'Le joueur actuel rejoue',
        ],
      },
      {
        title: 'La somme des dés est 8',
        description: 'Le joueur suivant boit une gorgée et le joueur actuel rejoue.',
      },
      {
        title: 'Le double',
        description: 'Le joueur distribue le nombre de coups équivalent au chiffre qu\'il a fait en double.',
        items: [
          'Double de 5 = distribue 5 gorgées',
          'À répartir comme tu veux entre les joueurs',
          'Ensuite, il rejoue',
          'Exception : le double 3 obéit à une autre règle',
        ],
      },
      {
        title: 'Le double 3 - Devenir le Biskit',
        description: 'Le joueur devient le Biskit et le jeu devient compliqué pour lui (et son foie).',
        items: [
          'Le Biskit boit une gorgée à chaque fois qu\'un autre joueur fait un 3 avec un de ses dés',
          'Le joueur arrête d\'être le Biskit s\'il fait un double 3',
          'Ou si un autre joueur fait un double 3 (le nouveau devient Biskit)',
        ],
      },
    ],
    tips: [
      'Gardez vos réflexes pour le 7 !',
      'Le Biskit est une position dangereuse',
    ],
  },

  // 421
  quatre21: {
    id: 'quatre21',
    title: '421',
    subtitle: 'Le roi des dés',
    intro: 'Matériel : Trois dés à six faces, optionnellement 21 objets pouvant servir de fiches/points.',
    sections: [
      {
        title: 'Combinaisons et valeurs',
        description: 'Tableau des combinaisons par ordre de valeur décroissante :',
        items: [
          '421 = 8 gorgées (la meilleure)',
          'Brelan d\'as = 7 gorgées',
          'Brelan (2 à 6) = valeur du brelan',
          'Paire d\'As + X = valeur du X (2 à 6)',
          'Suite = 2 gorgées',
          'Rien de particulier = 1 gorgée',
          'Nénette (221) = 0 gorgée',
        ],
      },
      {
        title: 'Tour de décharge',
        description: 'Le but est d\'obtenir la combinaison valant le plus de gorgées possible (pour en donner) ou à défaut la moins basse (pour éviter d\'en prendre).',
        items: [
          'Le joueur actif lance les dés, puis choisit ceux qu\'il souhaite conserver',
          'Les dés conservés sont figés, les autres sont relancés',
          'Maximum 3 lancers de dés au total',
          'Les joueurs suivants ne peuvent pas dépasser le nombre de lancers du premier joueur',
        ],
      },
      {
        title: 'Résolution',
        description: 'La personne avec la combinaison la plus haute donne ses gorgées à celle avec la plus basse.',
        items: [
          'En cas d\'égalité entre perdants : main chaude (un seul lancer)',
          'Si égalité pendant la main chaude : on recommence et on double les gorgées',
        ],
      },
      {
        title: 'Variantes',
        description: 'Pour pimenter le jeu :',
        items: [
          '[T\'es mauvais Jack] - Interdit de relancer une nénette',
          '[L\'indécis] - Les dés figés peuvent être relancés',
          '[Highlander] - Une seule personne peut donner ses gorgées (main chaude entre gagnants)',
        ],
      },
    ],
    tips: [
      'La nénette (221) ne vaut rien, évitez-la !',
      'Gardez vos as pour les paires',
    ],
  },

  // Mon Foie Est Mon Glaive
  monFoieEstMonGlaive: {
    id: 'monFoieEstMonGlaive',
    title: 'Mon Foie Est Mon Glaive',
    subtitle: 'Par Yodin - Toulouse',
    intro: 'Jeu de dés élaboré avec système de rôles (Dieu, Héro, Maître du Destin, Écuyer). Chaque combinaison a une signification particulière.',
    sections: [
      {
        title: 'Dieu - Devenir Dieu',
        description: 'En cas de double 4, 5 ou 6, le joueur devient Dieu.',
        items: [
          'Ascension : distribue la valeur de son double (4, 5 ou 6 gorgées)',
          'Duel de dieux : si un Dieu existe déjà (double 4 ou 5), duel - chacun lance un dé',
          'Le plus haut gagne, le perdant boit 2x la différence',
          'Quand le total des 2 dés fait 7, Dieu distribue la valeur du dé le plus fort',
        ],
      },
      {
        title: 'Le Héro - Devenir Héro',
        description: 'En cas de double 1, 2 ou 3, le joueur devient le nouveau héro.',
        items: [
          'Adoubement : distribue la valeur de son double (1, 2 ou 3 gorgées)',
          'Dieu ne peut pas être héro (il désigne quelqu\'un d\'autre)',
          'Le Héro s\'interpose quand Dieu distribue (sur un total de 7)',
        ],
      },
      {
        title: 'Intervention du Héro',
        description: 'Quand Dieu distribue, le Héro lance un dé :',
        items: [
          '1 = Désintégration : Héro boit cul sec et perd son statut',
          '2/3 = Échec : Héro boit le total ET les cibles boivent aussi',
          '4/5 = Sacrifice réussi : Héro boit le total, les cibles sont sauvées',
          '6 = Action héroïque : Dieu boit ses propres gorgées',
        ],
      },
      {
        title: 'Maître du Destin & Écuyer',
        description: 'Autres rôles spéciaux :',
        items: [
          '21 = Devient Maître du Destin (peut faire +1/-1 sur le dé du Héro)',
          '31 = Devient Écuyer (boit toujours la même quantité que le Héro)',
          'Maiar : 3x 21 = peut modifier n\'importe quel dé de la partie',
        ],
      },
      {
        title: 'Règles générales',
        description: 'Combinaisons pour tous les joueurs :',
        items: [
          '6X (où X ≠ 6) = distribue X gorgées',
          '42 = LAN au village, tout le monde boit',
          '51 = Fête au village, tout le monde boit',
          'Score inutile = le lanceur boit 1',
          'Score inutile répété = tournoi/duel entre les joueurs concernés',
        ],
      },
    ],
    tips: [
      'Les rôles se cumulent et créent des situations épiques',
      'Attention aux duels de paysans qui peuvent dégénérer !',
    ],
  },

  // Purple
  purple: {
    id: 'purple',
    title: 'Purple',
    subtitle: 'Rouge, Noir ou Purple ?',
    intro: 'Matériel : Jeu de 52 cartes standard. Seule compte la couleur (rouge ou noir), pas la valeur.',
    sections: [
      {
        title: 'Préparation',
        description: 'Un joueur sert de dealer et conserve le paquet de cartes.',
        items: [
          'Le dealer rappelle aux joueurs distraits que c\'est leur tour',
          'On compte les gorgées en jeu au fur et à mesure',
        ],
      },
      {
        title: 'Déroulé du jeu',
        description: 'Le joueur actif déclare "Rouge", "Noir" ou "Purple" :',
        items: [
          'Rouge/Noir = Une carte de cette couleur (1 gorgée)',
          'Purple = Une rouge ET une noire en même temps (3-5 gorgées selon les règles)',
          'Si correct : passer au suivant ou rejouer pour augmenter la mise',
          'Si faux : boire toutes les gorgées en jeu et rejouer',
        ],
      },
      {
        title: 'Variante Géronimo',
        description: 'Pour les plus téméraires :',
        items: [
          'Deux Purple de suite tirés immédiatement',
          'Attention : rouge-rouge-noir-noir ne compte pas !',
          'Géronimo = 3x la valeur d\'un Purple simple',
        ],
      },
    ],
    tips: [
      'Le Purple est tentant mais risqué',
      'Sachez vous arrêter au bon moment !',
    ],
  },

  // Chèvre
  chevre: {
    id: 'chevre',
    title: 'Chèvre',
    subtitle: 'Beer Pong à la française',
    intro: 'Jeu d\'adresse avec des gobelets et des balles de ping-pong. Table ronde de préférence.',
    sections: [
      {
        title: 'Mise en place',
        description: 'Préparez le terrain de jeu :',
        items: [
          'Dresser des gobelets sur une table (ronde de préférence)',
          'Remplir le gobelet du milieu entièrement (faisable en sec)',
          'Les autres gobelets : 1 à 2 gorgées selon la difficulté souhaitée',
        ],
      },
      {
        title: 'Début de partie',
        description: '2 joueurs se faisant face commencent :',
        items: [
          'Chacun prend un des petits verres et une balle',
          'Trinquez, buvez, reposez le verre vide',
          'Le but : faire entrer la balle dans son verre avec un rebond',
        ],
      },
      {
        title: 'Règles de passage',
        description: 'Trois cas de figure selon votre situation :',
        items: [
          'Joueur à gauche joue encore : empilez votre verre dans le sien, il prend un petit verre et continue',
          'Premier coup réussi (sans joueur à gauche) : donnez votre verre à n\'importe qui sauf l\'autre joueur actif',
          'Au-delà du premier coup : passez à gauche obligatoirement',
        ],
      },
      {
        title: 'Règles spéciales',
        description: 'Cas particuliers :',
        items: [
          'Balle dans gobelet non-vide : vous buvez ce gobelet',
          'Balle dans le gobelet central : buvez un petit gobelet et continuez',
          'Dernier avec la pile complète : boit le verre central !',
          'Petits coups de pute tolérés, mais pas très Bataclan...',
        ],
      },
    ],
    tips: [
      'Visez bien le rebond',
      'Gardez un œil sur votre gauche !',
    ],
  },

  // Flip Cup
  flipCup: {
    id: 'flipCup',
    title: 'Flip Cup',
    subtitle: 'Le relai ultime',
    intro: 'Flip cup est un relai qui oppose deux équipes. Rapidité et dextérité sont de mise !',
    sections: [
      {
        title: 'Matériel',
        description: 'Ce qu\'il vous faut :',
        items: [
          'Une table suffisamment longue pour toutes les personnes d\'une équipe',
          'Des gobelets en plastique',
          'De la bière en quantité non triviale',
        ],
      },
      {
        title: 'Règles du jeu',
        description: 'Déroulement d\'une manche :',
        items: [
          'Deux équipes de taille égale, alignées de chaque côté de la table',
          'Un gobelet devant chaque personne, rempli d\'un fond (ou plus) de bière',
          'Une seule main utilisable, l\'autre dans le dos',
          'Au top départ, un joueur de chaque équipe boit son verre le plus vite possible',
        ],
      },
      {
        title: 'Le Flip',
        description: 'La technique cruciale :',
        items: [
          'Verre terminé = posé sur le bord de la table',
          'Avec un seul doigt, retourner le verre à 180° (flip)',
          'Si le verre tombe ou n\'est pas stable, recommencer',
          'Verre retourné = le suivant peut commencer',
        ],
      },
      {
        title: 'Fin de manche',
        description: 'Résolution :',
        items: [
          'Première équipe à compléter une longueur gagne',
          'L\'équipe perdante doit terminer ses verres',
          'L\'équipe gagnante peut éliminer un adversaire (sauf ceux qui n\'ont pas encore flippé)',
          'Équipe perdante finale = plus personne en jeu',
        ],
      },
      {
        title: 'Bonus & Variantes',
        description: 'Pour pimenter :',
        items: [
          'Plusieurs verres par personne (allers-retours)',
          'Retourner avec la langue',
          'Faire un tour sur soi-même avant de flipper',
          'Ventrigliss comme début de relai',
        ],
      },
    ],
    tips: [
      'Le flip se travaille !',
      'L\'équipe compte plus que l\'individu',
    ],
  },
}

/**
 * Get Faluche game config by ID
 */
export function getFalucheGame(gameId: FalucheGameType): FalucheGameConfig | undefined {
  return FALUCHE_GAMES.find(game => game.id === gameId)
}

/**
 * Get Faluche game rules by ID
 */
export function getFalucheRules(gameId: FalucheGameType): FalucheGameRules | undefined {
  return FALUCHE_RULES[gameId]
}

/**
 * Get all games by category
 */
export function getFalucheGamesByCategory(category: FalucheGameCategory): FalucheGameConfig[] {
  return FALUCHE_GAMES.filter(game => game.category === category)
}
