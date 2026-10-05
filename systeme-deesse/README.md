# Système — Déesse du Système (iOS · Expo)

Application personnelle de « Système » façon manhwa : rangs E- → SSS+, 6 stats, quêtes,
Bibliothèque de survie, entraînement, Apple Santé, et une Déesse qui commente ta progression
(répliques locales, ou IA si tu fournis une clé).

## Lancer le projet

Prérequis : un Mac avec Xcode, Node 20+, un iPhone (HealthKit ne tourne pas sur simulateur
pour les vraies données).

```bash
npm install
npx expo install --fix      # aligne les versions des paquets sur ton SDK Expo
npx expo prebuild -p ios    # génère le projet natif (HealthKit, notifications)
npx expo run:ios --device   # build de développement sur ton iPhone
```

⚠ **Expo Go ne suffit pas** : HealthKit exige un build de développement. Sans compte
Apple Developer payant, un build signé avec ton Apple ID gratuit fonctionne 7 jours.

## Structure

```
app/                         Écrans (expo-router)
  _layout.tsx                Polices, hydratation, redirection onboarding, notifications
  onboarding.tsx             Éveil : prénom → charges → test de mobilité → taille
  (tabs)/index.tsx           Statut (HUD, niveau, 6 stats, Déesse, quête principale)
  (tabs)/quetes.tsx          Journalières, principale (6×30 s), hebdomadaires
  (tabs)/bibliotheque.tsx    Quiz, cours, scénarios (+ scénarios IA)
  (tabs)/entrainement.tsx    Séance libre depuis le catalogue, séries, repos (adaptés par IA)
  (tabs)/calendrier.tsx      Calendrier d’assiduité, séances planifiées, notifications
  test-force.tsx             Test de force sur les 5 exercices repères
  (tabs)/succes.tsx          Titres Bronze → Platine, titre équipé
  stat/[key].tsx             Détail d’une stat (Beauté : Face / Body séparés)
  taille.tsx                 Jauge théorique vs mesures réelles (graphique)
  parametres.tsx             Délai de grâce, eau, IA, Santé, réinitialisation
src/
  logic/ranks.ts             Barème centralisé des 19 rangs
  logic/force.ts             Force depuis les charges + pénalité de désentraînement
  logic/height.ts            Jauge de taille (constante HEIGHT_RATE_MM_PER_WEEK)
  logic/stats.ts             Gains, Beauté Corps = (VIT + FOR)/2, évaluation du coucher
  logic/exp.ts               EXP et niveaux
  logic/context.ts           Résumé chiffré envoyé à l’IA
  store/useSystem.ts         État persistant (zustand + AsyncStorage) et toutes les actions
  data/                      Dialogues, titres, Bibliothèque, exercices
  services/                  Santé, notifications, IA
  ai/systemPrompt.ts         Prompt système de la Déesse + générateur de scénarios
assets/deesse_avatar.png     Placeholder à remplacer (voir prompts/)
```

## Règles appliquées (et où les changer)

| Règle | Valeur | Fichier |
|---|---|---|
| Seuils des rangs | E- 0 … A 143, A+ 161, S 180 … SSS+ 270 | `logic/ranks.ts` |
| Force | 5 repères (Pec Press, Shoulder Press, Rowing Pulldown, Machine Crunch, Leg Curl) : 180 × (charge / référence S)^0,85 ; un record en séance met à jour | `logic/force.ts` (`BENCHMARK_IDS`, `refS`) |
| Catalogue | 13 exercices principaux en tête + 45 secondaires par muscle, recherche et filtres dans Training et Planning | `data/exercises.ts` |
| Désentraînement | −0,5 pt/jour après le délai de grâce (14 j par défaut, réglable 14–21) | `logic/force.ts` |
| Beauté Visage | départ 150 pts (rang A, proche de A+), +0,5 matin, +0,5 soir | `logic/stats.ts` |
| Vitalité | ≥ 5 000 pas +1, eau +0,5, coucher 23h30–00h30 +1, après 00h30 −0,5 | `logic/stats.ts` |
| Mental | +1 par méditation de 10 min (minuteur obligatoire) | `logic/stats.ts` |
| Intelligence | quiz +1, cours +0,5, scénario +2, échec 0 | `logic/stats.ts` |
| Jauge de taille | 0,15 mm par semaine complète (42 séances), au prorata | `logic/height.ts` |

Anti-triche intégré : une même question ou un même scénario ne rapporte qu’une fois par jour,
un cours une seule fois ; les méditations et décompressions passent par un minuteur.

## Voix, bruitages et vibrations

- **Voix** : fichiers de doublage dans `assets/audio/goddess/` (`lines/` pour les répliques exactes,
  `reactions/` pour les réactions courtes par événement), déclarés dans `src/audio/voiceMap.ts`.
  La liste des 54 répliques à enregistrer est dans `assets/audio/goddess/SCRIPT.md`.
- **Bruitages** : `assets/audio/sfx/` (clic, série, quête, niveau, notification, alerte).
  Remplace un fichier par le tien en gardant le même nom.
- **Vibrations et sons** : centralisés dans `src/audio/feedback.ts`, déclenchés par les boutons
  et par les événements du Système (`src/components/SystemFeedback.tsx`).
- Tout se règle dans Réglages → Voix & sons.

## Mode IA

Réglages → Déesse IA → choisis Anthropic ou OpenAI, colle ta clé (stockée dans le trousseau
iOS). Les noms de modèles par défaut sont modifiables dans le même écran. Sans clé ou si
l’appel échoue, l’app retombe silencieusement sur les répliques locales.
