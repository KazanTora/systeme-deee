/**
 * FORCE
 * 1) Base : calculée sur 5 exercices repères (test de force), tous en kg sur machine.
 *    points = 180 × (charge / refS)^0.85, plafonné à 1.6 × refS.
 *    La base = moyenne pondérée des repères renseignés.
 * 2) Les repères montent automatiquement quand tu bats ton record sur l'un d'eux en séance.
 *    Un nouveau record (ou un nouveau test) remet l'ajustement à zéro.
 * 3) Pénalité de désentraînement : -0.5 pt/jour au-delà du délai de grâce (14–21 j, 14 par défaut),
 *    encaissée dans forceAdjust au retour en salle.
 */
import { S_POINTS } from './constants';
import { exerciseById } from '../data/exercises';

/** Les exercices repères du test de force. Retire-en un ici si tu veux passer à 4. */
export const BENCHMARK_IDS = ['pec_press', 'shoulder_press', 'rowing_pulldown', 'machine_crunch', 'leg_curl'] as const;
export type LiftId = (typeof BENCHMARK_IDS)[number];

export interface LiftDef {
  id: LiftId;
  label: string;
  unit: 'kg';
  /** Charge qui vaut exactement le rang S (180 pts). Les piles de machines varient : ajuste à ta salle. */
  refS: number;
  weight: number;
}

const REF: Record<LiftId, { refS: number; weight: number }> = {
  pec_press: { refS: 100, weight: 1.2 },
  shoulder_press: { refS: 80, weight: 1 },
  rowing_pulldown: { refS: 110, weight: 1.2 },
  machine_crunch: { refS: 80, weight: 0.7 },
  leg_curl: { refS: 90, weight: 0.9 },
};

export const LIFTS: LiftDef[] = BENCHMARK_IDS.map((id) => ({
  id,
  label: exerciseById(id).name,
  unit: 'kg',
  ...REF[id],
}));

export const isBenchmark = (id: string): id is LiftId => (BENCHMARK_IDS as readonly string[]).includes(id);

const CURVE = 0.85;
const CAP_RATIO = 1.6;

export type Lifts = Partial<Record<LiftId, number>>;

export function liftPoints(def: LiftDef, value: number | undefined): number {
  if (!value || value <= 0) return 0;
  const ratio = Math.min(value / def.refS, CAP_RATIO);
  return S_POINTS * Math.pow(ratio, CURVE);
}

export function computeForceBase(lifts: Lifts): number {
  let sum = 0;
  let weights = 0;
  for (const def of LIFTS) {
    const v = lifts[def.id];
    if (v && v > 0) {
      sum += liftPoints(def, v) * def.weight;
      weights += def.weight;
    }
  }
  return weights === 0 ? 0 : sum / weights;
}

export const DETRAINING_RATE = 0.5;
export const GRACE_MIN = 14;
export const GRACE_MAX = 21;

export function daysSince(iso: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
}

export function detrainingPenalty(lastSessionISO: string | null, graceDays: number, now: Date = new Date()): number {
  if (!lastSessionISO) return 0;
  const grace = Math.min(GRACE_MAX, Math.max(GRACE_MIN, graceDays));
  const d = daysSince(lastSessionISO, now);
  return d > grace ? (d - grace) * DETRAINING_RATE : 0;
}
