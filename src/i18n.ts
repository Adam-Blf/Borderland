import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Supported languages
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'de', 'it', 'pt'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Language display names
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  fr: 'Francais',
  en: 'English',
  es: 'Espanol',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Portugues',
}

// French translations (embedded for instant load - default language)
const frTranslation = {
  common: {
    players: 'joueurs',
    player: 'joueur',
    modify: 'Modifier',
    back: 'Retour',
    play: 'JOUER',
    rules: 'REGLES DU JEU',
    enterCasino: 'ENTRER AU CASINO',
    addPlayer: 'Ajouter un joueur',
    playerPlaceholder: 'Joueur {{number}}',
    minMaxPlayers: 'Minimum 2 joueurs, maximum 8',
    namesUsedForAllGames: 'Ces noms seront utilises pour tous les jeux',
    drinkResponsibly: 'A consommer avec moderation',
    moreGamesSoon: 'Plus de jeux bientot...',
    installPrompt: 'Appuyez sur Partager puis "Sur l\'ecran d\'accueil" pour installer',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Casino de Luxe',
    guestList: 'Guest List',
    highRoller: 'High Roller',
    highRollers: 'High Rollers',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Collection de jeux a boire',
  },
  borderland: {
    title: 'Le Borderland',
    subtitle: '52 cartes - 4 regles - 0 pitie',
    description: 'Tire une carte, decouvre son pouvoir. Distribue des gorgees, ou bois-les. Conteste si tu oses. Survie si tu peux.',
    cardType: 'Jeu de Cartes',
  },
  rules: {
    title: 'Regles du Borderland',
    intro: 'Chaque couleur de carte a sa propre regle.',
    aceRule: 'Les As valent un SHOT.',
    contest: {
      title: 'Le Contest',
      description: 'Tu peux contester une carte pour doubler la mise ! Le joueur suivant peut accepter ou escalader (x2, puis x4). Celui qui accepte boit tout. Courage ou folie ?',
    },
    suits: {
      clubs: {
        title: 'Le Guess',
        description: 'La carte est FACE CACHEE. Demande a un joueur de deviner sa valeur exacte (ex: Roi). Clique pour reveler. S\'il a juste, tu distribues. Sinon, il boit.',
      },
      diamonds: {
        title: 'L\'Action',
        description: 'Donne une action au joueur de ton choix.',
      },
      hearts: {
        title: 'La Question',
        description: 'Pose une question au joueur de ton choix.',
      },
      spades: {
        title: 'La Contrainte',
        description: 'Donne une contrainte a accomplir au joueur de ton choix.',
      },
    },
  },
  game: {
    gorgees: 'gorgees',
    shot: 'SHOT',
    sips: 'sips',
    draw: 'TIRER',
    distribute: 'Distribue',
    drink: 'Bois',
    contest: 'CONTESTER',
    accept: 'ACCEPTER',
    escalate: 'ESCALADER',
    reveal: 'Touche pour reveler',
    correct: 'Correct !',
    wrong: 'Rate !',
    youDistribute: 'Tu distribues',
    youDrink: 'Tu bois',
    nextPlayer: 'Joueur suivant',
    gameOver: 'Partie terminee !',
    playAgain: 'Rejouer',
    backToHub: 'Retour au Hub',
  },
}

// English translations
const enTranslation = {
  common: {
    players: 'players',
    player: 'player',
    modify: 'Edit',
    back: 'Back',
    play: 'PLAY',
    rules: 'GAME RULES',
    enterCasino: 'ENTER THE CASINO',
    addPlayer: 'Add a player',
    playerPlaceholder: 'Player {{number}}',
    minMaxPlayers: 'Minimum 2 players, maximum 8',
    namesUsedForAllGames: 'These names will be used for all games',
    drinkResponsibly: 'Drink responsibly',
    moreGamesSoon: 'More games coming soon...',
    installPrompt: 'Tap Share then "Add to Home Screen" to install',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Luxury Casino',
    guestList: 'Guest List',
    highRoller: 'High Roller',
    highRollers: 'High Rollers',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Drinking games collection',
  },
  borderland: {
    title: 'The Borderland',
    subtitle: '52 cards - 4 rules - 0 mercy',
    description: 'Draw a card, discover its power. Give sips or drink them. Contest if you dare. Survive if you can.',
    cardType: 'Card Game',
  },
  rules: {
    title: 'Borderland Rules',
    intro: 'Each card suit has its own rule.',
    aceRule: 'Aces are worth a SHOT.',
    contest: {
      title: 'The Contest',
      description: 'You can contest a card to double the stakes! The next player can accept or escalate (x2, then x4). Whoever accepts drinks everything. Courage or madness?',
    },
    suits: {
      clubs: {
        title: 'The Guess',
        description: 'The card is FACE DOWN. Ask a player to guess its exact value (e.g., King). Tap to reveal. If correct, you give sips. Otherwise, they drink.',
      },
      diamonds: {
        title: 'The Action',
        description: 'Give an action to the player of your choice.',
      },
      hearts: {
        title: 'The Question',
        description: 'Ask a question to the player of your choice.',
      },
      spades: {
        title: 'The Challenge',
        description: 'Give a challenge to accomplish to the player of your choice.',
      },
    },
  },
  game: {
    gorgees: 'sips',
    shot: 'SHOT',
    sips: 'sips',
    draw: 'DRAW',
    distribute: 'Give',
    drink: 'Drink',
    contest: 'CONTEST',
    accept: 'ACCEPT',
    escalate: 'ESCALATE',
    reveal: 'Tap to reveal',
    correct: 'Correct!',
    wrong: 'Wrong!',
    youDistribute: 'You give',
    youDrink: 'You drink',
    nextPlayer: 'Next player',
    gameOver: 'Game over!',
    playAgain: 'Play again',
    backToHub: 'Back to Hub',
  },
}

// Spanish translations
const esTranslation = {
  common: {
    players: 'jugadores',
    player: 'jugador',
    modify: 'Modificar',
    back: 'Volver',
    play: 'JUGAR',
    rules: 'REGLAS DEL JUEGO',
    enterCasino: 'ENTRAR AL CASINO',
    addPlayer: 'Anadir jugador',
    playerPlaceholder: 'Jugador {{number}}',
    minMaxPlayers: 'Minimo 2 jugadores, maximo 8',
    namesUsedForAllGames: 'Estos nombres se usaran en todos los juegos',
    drinkResponsibly: 'Bebe con moderacion',
    moreGamesSoon: 'Mas juegos pronto...',
    installPrompt: 'Toca Compartir y luego "Anadir a pantalla de inicio" para instalar',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Casino de Lujo',
    guestList: 'Lista de Invitados',
    highRoller: 'Gran Apostador',
    highRollers: 'Grandes Apostadores',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Coleccion de juegos para beber',
  },
  borderland: {
    title: 'El Borderland',
    subtitle: '52 cartas - 4 reglas - 0 piedad',
    description: 'Saca una carta, descubre su poder. Reparte tragos o bebelos. Desafia si te atreves. Sobrevive si puedes.',
    cardType: 'Juego de Cartas',
  },
  rules: {
    title: 'Reglas del Borderland',
    intro: 'Cada palo tiene su propia regla.',
    aceRule: 'Los Ases valen un SHOT.',
    contest: {
      title: 'El Desafio',
      description: 'Puedes desafiar una carta para doblar la apuesta! El siguiente jugador puede aceptar o escalar (x2, luego x4). Quien acepte bebe todo. Valor o locura?',
    },
    suits: {
      clubs: {
        title: 'La Adivinanza',
        description: 'La carta esta BOCA ABAJO. Pide a un jugador que adivine su valor exacto (ej: Rey). Toca para revelar. Si acierta, tu repartes. Si no, el bebe.',
      },
      diamonds: {
        title: 'La Accion',
        description: 'Da una accion al jugador que elijas.',
      },
      hearts: {
        title: 'La Pregunta',
        description: 'Haz una pregunta al jugador que elijas.',
      },
      spades: {
        title: 'El Reto',
        description: 'Da un reto a cumplir al jugador que elijas.',
      },
    },
  },
  game: {
    gorgees: 'tragos',
    shot: 'SHOT',
    sips: 'tragos',
    draw: 'SACAR',
    distribute: 'Reparte',
    drink: 'Bebe',
    contest: 'DESAFIAR',
    accept: 'ACEPTAR',
    escalate: 'ESCALAR',
    reveal: 'Toca para revelar',
    correct: 'Correcto!',
    wrong: 'Fallaste!',
    youDistribute: 'Tu repartes',
    youDrink: 'Tu bebes',
    nextPlayer: 'Siguiente jugador',
    gameOver: 'Fin del juego!',
    playAgain: 'Jugar de nuevo',
    backToHub: 'Volver al Hub',
  },
}

// German translations
const deTranslation = {
  common: {
    players: 'Spieler',
    player: 'Spieler',
    modify: 'Bearbeiten',
    back: 'Zuruck',
    play: 'SPIELEN',
    rules: 'SPIELREGELN',
    enterCasino: 'CASINO BETRETEN',
    addPlayer: 'Spieler hinzufugen',
    playerPlaceholder: 'Spieler {{number}}',
    minMaxPlayers: 'Mindestens 2 Spieler, maximal 8',
    namesUsedForAllGames: 'Diese Namen werden fur alle Spiele verwendet',
    drinkResponsibly: 'Trinke verantwortungsvoll',
    moreGamesSoon: 'Mehr Spiele bald...',
    installPrompt: 'Tippe auf Teilen und dann "Zum Home-Bildschirm" zum Installieren',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Luxus Casino',
    guestList: 'Gasteliste',
    highRoller: 'High Roller',
    highRollers: 'High Rollers',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Trinkspiele Sammlung',
  },
  borderland: {
    title: 'Das Borderland',
    subtitle: '52 Karten - 4 Regeln - 0 Gnade',
    description: 'Ziehe eine Karte, entdecke ihre Macht. Verteile Schlucke oder trinke sie. Fordere heraus wenn du dich traust. Uberlebe wenn du kannst.',
    cardType: 'Kartenspiel',
  },
  rules: {
    title: 'Borderland Regeln',
    intro: 'Jede Kartenfarbe hat ihre eigene Regel.',
    aceRule: 'Asse sind einen SHOT wert.',
    contest: {
      title: 'Die Herausforderung',
      description: 'Du kannst eine Karte anfechten um den Einsatz zu verdoppeln! Der nachste Spieler kann akzeptieren oder eskalieren (x2, dann x4). Wer akzeptiert trinkt alles. Mut oder Wahnsinn?',
    },
    suits: {
      clubs: {
        title: 'Das Raten',
        description: 'Die Karte liegt VERDECKT. Bitte einen Spieler den genauen Wert zu erraten (z.B. Konig). Tippe zum Aufdecken. Wenn richtig, verteilst du. Sonst trinkt er.',
      },
      diamonds: {
        title: 'Die Aktion',
        description: 'Gib einem Spieler deiner Wahl eine Aufgabe.',
      },
      hearts: {
        title: 'Die Frage',
        description: 'Stelle einem Spieler deiner Wahl eine Frage.',
      },
      spades: {
        title: 'Die Challenge',
        description: 'Gib einem Spieler deiner Wahl eine Challenge.',
      },
    },
  },
  game: {
    gorgees: 'Schlucke',
    shot: 'SHOT',
    sips: 'Schlucke',
    draw: 'ZIEHEN',
    distribute: 'Verteile',
    drink: 'Trinke',
    contest: 'ANFECHTEN',
    accept: 'AKZEPTIEREN',
    escalate: 'ESKALIEREN',
    reveal: 'Tippen zum Aufdecken',
    correct: 'Richtig!',
    wrong: 'Falsch!',
    youDistribute: 'Du verteilst',
    youDrink: 'Du trinkst',
    nextPlayer: 'Nachster Spieler',
    gameOver: 'Spiel vorbei!',
    playAgain: 'Nochmal spielen',
    backToHub: 'Zuruck zum Hub',
  },
}

// Italian translations
const itTranslation = {
  common: {
    players: 'giocatori',
    player: 'giocatore',
    modify: 'Modifica',
    back: 'Indietro',
    play: 'GIOCA',
    rules: 'REGOLE DEL GIOCO',
    enterCasino: 'ENTRA NEL CASINO',
    addPlayer: 'Aggiungi giocatore',
    playerPlaceholder: 'Giocatore {{number}}',
    minMaxPlayers: 'Minimo 2 giocatori, massimo 8',
    namesUsedForAllGames: 'Questi nomi saranno usati per tutti i giochi',
    drinkResponsibly: 'Bevi con moderazione',
    moreGamesSoon: 'Altri giochi in arrivo...',
    installPrompt: 'Tocca Condividi poi "Aggiungi alla schermata Home" per installare',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Casino di Lusso',
    guestList: 'Lista Ospiti',
    highRoller: 'High Roller',
    highRollers: 'High Rollers',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Collezione di giochi alcolici',
  },
  borderland: {
    title: 'Il Borderland',
    subtitle: '52 carte - 4 regole - 0 pieta',
    description: 'Pesca una carta, scopri il suo potere. Distribuisci sorsi o bevili. Sfida se osi. Sopravvivi se puoi.',
    cardType: 'Gioco di Carte',
  },
  rules: {
    title: 'Regole del Borderland',
    intro: 'Ogni seme ha la sua regola.',
    aceRule: 'Gli Assi valgono uno SHOT.',
    contest: {
      title: 'La Sfida',
      description: 'Puoi contestare una carta per raddoppiare la posta! Il giocatore successivo puo accettare o escalare (x2, poi x4). Chi accetta beve tutto. Coraggio o follia?',
    },
    suits: {
      clubs: {
        title: 'L\'Indovinello',
        description: 'La carta e COPERTA. Chiedi a un giocatore di indovinare il valore esatto (es: Re). Tocca per rivelare. Se indovina, distribuisci tu. Altrimenti beve lui.',
      },
      diamonds: {
        title: 'L\'Azione',
        description: 'Dai un\'azione al giocatore che scegli.',
      },
      hearts: {
        title: 'La Domanda',
        description: 'Fai una domanda al giocatore che scegli.',
      },
      spades: {
        title: 'La Sfida',
        description: 'Dai una sfida da compiere al giocatore che scegli.',
      },
    },
  },
  game: {
    gorgees: 'sorsi',
    shot: 'SHOT',
    sips: 'sorsi',
    draw: 'PESCA',
    distribute: 'Distribuisci',
    drink: 'Bevi',
    contest: 'CONTESTARE',
    accept: 'ACCETTARE',
    escalate: 'ESCALARE',
    reveal: 'Tocca per rivelare',
    correct: 'Corretto!',
    wrong: 'Sbagliato!',
    youDistribute: 'Tu distribuisci',
    youDrink: 'Tu bevi',
    nextPlayer: 'Prossimo giocatore',
    gameOver: 'Partita finita!',
    playAgain: 'Gioca ancora',
    backToHub: 'Torna all\'Hub',
  },
}

// Portuguese translations
const ptTranslation = {
  common: {
    players: 'jogadores',
    player: 'jogador',
    modify: 'Modificar',
    back: 'Voltar',
    play: 'JOGAR',
    rules: 'REGRAS DO JOGO',
    enterCasino: 'ENTRAR NO CASINO',
    addPlayer: 'Adicionar jogador',
    playerPlaceholder: 'Jogador {{number}}',
    minMaxPlayers: 'Minimo 2 jogadores, maximo 8',
    namesUsedForAllGames: 'Estes nomes serao usados em todos os jogos',
    drinkResponsibly: 'Beba com moderacao',
    moreGamesSoon: 'Mais jogos em breve...',
    installPrompt: 'Toque em Compartilhar e depois "Adicionar a Tela de Inicio" para instalar',
  },
  welcome: {
    title: 'BLACK OUT',
    subtitle: 'Casino de Luxo',
    guestList: 'Lista de Convidados',
    highRoller: 'Grande Apostador',
    highRollers: 'Grandes Apostadores',
  },
  hub: {
    title: 'BLACK OUT',
    subtitle: 'Colecao de jogos para beber',
  },
  borderland: {
    title: 'O Borderland',
    subtitle: '52 cartas - 4 regras - 0 piedade',
    description: 'Tire uma carta, descubra seu poder. Distribua goles ou beba-os. Desafie se ousar. Sobreviva se puder.',
    cardType: 'Jogo de Cartas',
  },
  rules: {
    title: 'Regras do Borderland',
    intro: 'Cada naipe tem sua propria regra.',
    aceRule: 'Os Ases valem um SHOT.',
    contest: {
      title: 'O Desafio',
      description: 'Voce pode contestar uma carta para dobrar a aposta! O proximo jogador pode aceitar ou escalar (x2, depois x4). Quem aceitar bebe tudo. Coragem ou loucura?',
    },
    suits: {
      clubs: {
        title: 'A Adivinhacao',
        description: 'A carta esta VIRADA. Peca a um jogador para adivinhar o valor exato (ex: Rei). Toque para revelar. Se acertar, voce distribui. Senao, ele bebe.',
      },
      diamonds: {
        title: 'A Acao',
        description: 'De uma acao ao jogador de sua escolha.',
      },
      hearts: {
        title: 'A Pergunta',
        description: 'Faca uma pergunta ao jogador de sua escolha.',
      },
      spades: {
        title: 'O Desafio',
        description: 'De um desafio a cumprir ao jogador de sua escolha.',
      },
    },
  },
  game: {
    gorgees: 'goles',
    shot: 'SHOT',
    sips: 'goles',
    draw: 'TIRAR',
    distribute: 'Distribui',
    drink: 'Bebe',
    contest: 'CONTESTAR',
    accept: 'ACEITAR',
    escalate: 'ESCALAR',
    reveal: 'Toque para revelar',
    correct: 'Correto!',
    wrong: 'Errado!',
    youDistribute: 'Voce distribui',
    youDrink: 'Voce bebe',
    nextPlayer: 'Proximo jogador',
    gameOver: 'Fim de jogo!',
    playAgain: 'Jogar novamente',
    backToHub: 'Voltar ao Hub',
  },
}

// Initialize i18next with all translations
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      de: { translation: deTranslation },
      it: { translation: itTranslation },
      pt: { translation: ptTranslation },
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: false,

    // If detected language is not supported, use French
    load: 'languageOnly',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'blackout-lang',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: false, // Disable suspense for instant render
    },

    debug: import.meta.env.DEV,
  })

// Force French if detected language is not supported
const detectedLang = i18n.language?.split('-')[0] as SupportedLanguage
if (!SUPPORTED_LANGUAGES.includes(detectedLang)) {
  i18n.changeLanguage('fr')
}

export default i18n
