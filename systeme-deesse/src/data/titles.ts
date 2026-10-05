import { Rank, rankIndex } from '../logic/ranks';

export type Rarity = 'Bronze' | 'Argent' | 'Or' | 'Platine';

export const RARITY_COLORS: Record<Rarity, string> = {
  Bronze: '#C98A55',
  Argent: '#C9D3E3',
  Or: '#E9C77B',
  Platine: '#A9F0FF',
};

export interface TitleCtx {
  counters: Counters;
  level: number;
  overallRank: Rank;
  heightGainMm: number;
}

export interface Counters {
  workouts: number;
  meditations: number;
  skincare: number;
  quizCorrect: number;
  scenariosWon: number;
  decompression: number;
  stepsDays: number;
  idealSleeps: number;
  stretches: number;
}

export interface TitleDef {
  id: string;
  name: string;
  rarity: Rarity;
  hint: string;
  check: (c: TitleCtx) => boolean;
}

const atLeast = (r: Rank, min: Rank) => rankIndex(r) >= rankIndex(min);

export const TITLES: TitleDef[] = [
  { id: 'debutant', name: 'Débutant', rarity: 'Bronze', hint: 'Éveille le Système', check: () => true },
  { id: 'peau_de_soie', name: 'Peau de soie', rarity: 'Bronze', hint: '14 skincares validées', check: (c) => c.counters.skincare >= 14 },
  { id: 'marcheur', name: 'Marcheur infatigable', rarity: 'Bronze', hint: '7 jours à 5 000 pas', check: (c) => c.counters.stepsDays >= 7 },
  { id: 'esprit_calme', name: 'Esprit calme', rarity: 'Bronze', hint: '10 méditations', check: (c) => c.counters.meditations >= 10 },
  { id: 'colonne_acier', name: 'Colonne d’acier', rarity: 'Argent', hint: '100 décompressions', check: (c) => c.counters.decompression >= 100 },
  { id: 'eclaireur', name: 'Éclaireur', rarity: 'Argent', hint: '25 bonnes réponses en Bibliothèque', check: (c) => c.counters.quizCorrect >= 25 },
  { id: 'assidu', name: 'Assidu de la fonte', rarity: 'Argent', hint: '20 séances enregistrées', check: (c) => c.counters.workouts >= 20 },
  { id: 'enfant_nuit', name: 'Maître du sommeil', rarity: 'Argent', hint: '14 couchers dans la plage idéale', check: (c) => c.counters.idealSleeps >= 14 },
  { id: 'souple', name: 'Corps de roseau', rarity: 'Argent', hint: '30 routines d’étirement', check: (c) => c.counters.stretches >= 30 },
  { id: 'rang_c', name: 'Chasseur de rang C', rarity: 'Argent', hint: 'Rang global C', check: (c) => atLeast(c.overallRank, 'C') },
  { id: 'tacticien', name: 'Tacticien', rarity: 'Or', hint: '20 scénarios réussis', check: (c) => c.counters.scenariosWon >= 20 },
  { id: 'niveau_20', name: 'Éveillé', rarity: 'Or', hint: 'Niveau 20', check: (c) => c.level >= 20 },
  { id: 'rang_a', name: 'Chasseur de rang A', rarity: 'Or', hint: 'Rang global A', check: (c) => atLeast(c.overallRank, 'A') },
  { id: 'favori', name: 'Favori de la Déesse', rarity: 'Or', hint: '100 méditations et 200 skincares', check: (c) => c.counters.meditations >= 100 && c.counters.skincare >= 200 },
  { id: 'monarque', name: 'Monarque', rarity: 'Platine', hint: 'Rang global S', check: (c) => atLeast(c.overallRank, 'S') },
  { id: 'colosse', name: 'Colosse', rarity: 'Platine', hint: '500 séances de décompression et 100 séances de sport', check: (c) => c.counters.decompression >= 500 && c.counters.workouts >= 100 },
];

export const titleById = (id: string) => TITLES.find((t) => t.id === id) ?? TITLES[0];
