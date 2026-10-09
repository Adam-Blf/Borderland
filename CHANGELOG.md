# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [0.1.0] - 2026-10-09

### Modifié

- Migration des icônes vers Reicon (`reicon-react` 1.2.6) : `lucide-react` retiré. Six glyphes sans équivalent chez Reicon (trèfle, carreau, pique, dés, crâne, palmier) et les épées gardent leur tracé en SVG local dans `src/components/icons/CardGlyphs.tsx`. Correspondances à confirmer : Scale vers Judge (confiance basse), Target vers RecordCircle3, Share vers Export.
- Contrastes des boutons : variantes rouges (texte et bordure) éclaircies, boutons d'accueil de partie et de remise à zéro redessinés en or plein avec bordure à 3:1, noms accessibles ajoutés aux boutons à icône seule.
- Aucun libellé marketing à réécrire : les boutons sont des commandes de jeu, voir `docs/boutons.md`.

## [0.0.1] - 2026-10-07

First tagged release. Latest changes:

- docs: add colors to mermaid diagrams (#3)
- chore: star-history retire (#2)
- docs: typography pass, no em dash or middle dot (#1)
- docs: add MIT license
- docs: add star history chart to readme
- docs: add architecture diagram, badges and repo topics
- docs: add commits/visits/last-commit/language/license badges
- chore(topics): update .github/workflows/sync-topics.yml
- chore(topics): update .github/workflows/sync-topics.yml
- chore(topics): add .github/workflows/sync-topics.yml
- chore(topics): add .github/topics.yml
- docs: add tech stack shields badges to README
- docs: add LinkedIn to README footer
- docs: add branded footer linking to adam.beloucif.com
- feat: integrate classic games rules routing
