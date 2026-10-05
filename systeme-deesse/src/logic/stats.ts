/**
 * STATS — tout ce qui transforme des actions en points.
 * Les 6 stats affichées : Force, Agilité, Intelligence, Vitalité, Mental, Beauté.
 * Beauté = moyenne(Beauté Visage, Beauté Corps) ; Beauté Corps = (Vitalité + Force) / 2.
 */
import { computeForceBase, detrainingPenalty, Lifts } from './force';
import { rankFromPoints, Rank } from './ranks';

export type StatKey = 'force' | 'agilite' | 'intelligence' | 'vitalite' | 'mental' | 'beaute';
export type StoredStat = 'agilite' | 'intelligence' | 'vitalite' | 'mental' | 'beauteVisage';

export const STAT_ORDER: StatKey[] = ['force', 'agilite', 'intelligence', 'vitalite', 'mental', 'beaute'];

export const STAT_LABELS: Record<StatKey, string> = {
  force: 'Force',
  agilite: 'Agilité',
  intelligence: 'Intelligence',
  vitalite: 'Vitalité',
  mental: 'Mental',
  beaute: 'Beauté',
};

export const STAT_ABBR: Record<StatKey, string> = {
  force: 'FOR', agilite: 'AGI', intelligence: 'INT', vitalite: 'VIT', mental: 'MEN', beaute: 'BEA',
};

/** Gains en points de stat. Un échec en Bibliothèque vaut 0 (jamais de pénalité). */
export const REWARDS = {
  skincare: 0.5,        // Beauté Visage, matin ET soir
  meditation10: 1,      // Mental, par session de 10 min
  stretch: 1,           // Agilité, routine du jour
  steps5k: 1,           // Vitalité, ≥ 5 000 pas
  steps10kBonus: 0.5,   // Vitalité, bonus ≥ 10 000 pas
  water: 0.5,           // Vitalité, objectif d'eau atteint
  sleepIdeal: 1,        // Vitalité, coucher 23h30–00h30
  sleepEarly: 0.5,      // Vitalité, coucher avant 23h30
  sleepLate: -0.5,      // Vitalité, léger malus après 00h30
  quiz: 1,              // Intelligence, bonne réponse
  cours: 0.5,           // Intelligence, mini-cours terminé
  scenario: 2,          // Intelligence, scénario réussi
} as const;

/** Points de départ (avant tests initiaux). Beauté Visage démarre au rang A, proche de A+. */
export const START_POINTS: Record<StoredStat, number> = {
  agilite: 10,
  intelligence: 10,
  vitalite: 20,
  mental: 10,
  beauteVisage: 150,
};

export interface StatInputs {
  lifts: Lifts;
  forceAdjust: number;
  lastSessionAt: string | null;
  graceDays: number;
  points: Record<StoredStat, number>;
}

export interface ComputedStats {
  values: Record<StatKey, number>;
  beauteVisage: number;
  beauteCorps: number;
  forceBase: number;
  detraining: number;
  overall: number;
  overallRank: Rank;
}

export function computeStats(i: StatInputs, now: Date = new Date()): ComputedStats {
  const forceBase = computeForceBase(i.lifts);
  const detraining = detrainingPenalty(i.lastSessionAt, i.graceDays, now);
  const force = Math.max(0, forceBase + i.forceAdjust - detraining);
  const vitalite = Math.max(0, i.points.vitalite);
  const beauteVisage = Math.max(0, i.points.beauteVisage);
  const beauteCorps = (vitalite + force) / 2;
  const values: Record<StatKey, number> = {
    force,
    agilite: Math.max(0, i.points.agilite),
    intelligence: Math.max(0, i.points.intelligence),
    vitalite,
    mental: Math.max(0, i.points.mental),
    beaute: (beauteVisage + beauteCorps) / 2,
  };
  const overall = STAT_ORDER.reduce((s, k) => s + values[k], 0) / STAT_ORDER.length;
  return { values, beauteVisage, beauteCorps, forceBase, detraining, overall, overallRank: rankFromPoints(overall) };
}

/**
 * Heure de coucher → gain/malus de Vitalité.
 * minutes = minutes depuis minuit (0–1439). Avant midi = nuit suivante (on ajoute 24 h).
 */
export const SLEEP_WINDOW = { start: 23 * 60 + 30, end: 24 * 60 + 30 };

export function evaluateBedtime(minutes: number): { delta: number; verdict: 'early' | 'ideal' | 'late' } {
  const m = minutes < 12 * 60 ? minutes + 1440 : minutes;
  if (m < SLEEP_WINDOW.start) return { delta: REWARDS.sleepEarly, verdict: 'early' };
  if (m <= SLEEP_WINDOW.end) return { delta: REWARDS.sleepIdeal, verdict: 'ideal' };
  return { delta: REWARDS.sleepLate, verdict: 'late' };
}

/** Test initial d'Agilité : 6 items notés 0–3 → 0 à 81 pts (plafond B-, le reste se gagne). */
export function agilityInitialPoints(scores: number[]): number {
  const max = scores.length * 3 || 1;
  const sum = scores.reduce((a, b) => a + Math.min(3, Math.max(0, b)), 0);
  return Math.round((sum / max) * 81 * 10) / 10;
}
