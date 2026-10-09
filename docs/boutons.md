# Boutons et appels à l'action

Application de jeu (casino de soirée) : tous les boutons sont des commandes en jeu (Jouer, Règles, Tirer une carte, Rejouer, Retour). La règle d'Adam les laisse en verbes courts, seuls leurs contrastes sont vérifiés. Le seul bouton d'entrée, « ENTRER AU CASINO », dit déjà où le clic mène.

Contrastes mesurés dans Chrome par échantillonnage des pixels rendus (fonds en dégradé et translucides), écrans d'accueil, menu, blackjack, course de chevaux, jeux à consignes.

| Élément | Avant | Après |
|---|---|---|
| Bouton « Règles » rouge (texte sur feutre vert) | 1,93:1 | 6,38:1 (`text-red-300`) |
| Boutons rouges ghost et outline, bordure | `poker-red` à 60 % | `red-400` à 70 % |
| Remise à zéro de la partie (icône) | gris sur gris, environ 1,5:1 | or plein, bordure à 60 % |
| Retour au menu (icône) | or à 70 %, 4,2:1 | or plein, bordure à 60 % |
| Boutons à icône seule | sans nom accessible | « Recommencer la partie », « Retour au menu des jeux » |

Désactivés (exemptés) : « ENTRER AU CASINO » tant qu'il manque un joueur, « Confirmer la mise ».
Les symboles de couleur de carte rouges sont des graphiques, pas du texte.
