/**
 * Barème centralisé : TOUTES les stats utilisent la même échelle de points.
 * Le seuil indique le minimum de points pour atteindre le rang.
 * Les écarts s'élargissent en montant : les hauts rangs coûtent plus cher.
 */
export const RANKS = [
  'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+',
  'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'SS', 'SSS', 'SSS+',
] as const;

export type Rank = (typeof RANKS)[number];

export const RANK_THRESHOLDS: Record<Rank, number> = {
  'E-': 0, E: 5, 'E+': 10,
  'D-': 18, D: 26, 'D+': 35,
  'C-': 45, C: 56, 'C+': 68,
  'B-': 81, B: 95, 'B+': 110,
  'A-': 126, A: 143, 'A+': 161,
  S: 180, SS: 205, SSS: 235, 'SSS+': 270,
};

export function rankFromPoints(points: number): Rank {
  let current: Rank = 'E-';
  for (const r of RANKS) {
    if (points >= RANK_THRESHOLDS[r]) current = r;
    else break;
  }
  return current;
}

export function rankIndex(rank: Rank): number {
  return RANKS.indexOf(rank);
}

export interface RankProgress {
  rank: Rank;
  next: Rank | null;
  /** 0 → 1 entre le seuil du rang actuel et celui du suivant */
  ratio: number;
  toNext: number;
}

export function rankProgress(points: number): RankProgress {
  const rank = rankFromPoints(points);
  const i = rankIndex(rank);
  const next = i < RANKS.length - 1 ? RANKS[i + 1] : null;
  if (!next) return { rank, next, ratio: 1, toNext: 0 };
  const floor = RANK_THRESHOLDS[rank];
  const ceil = RANK_THRESHOLDS[next];
  return { rank, next, ratio: (points - floor) / (ceil - floor), toNext: ceil - points };
}

export type Tier = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export function tierOf(rank: Rank): Tier {
  return (rank.startsWith('S') ? 'S' : rank[0]) as Tier;
}

export const TIER_COLORS: Record<Tier, string> = {
  E: '#8A97AD',
  D: '#5CF2B0',
  C: '#3DB8FF',
  B: '#B57BFF',
  A: '#FFB547',
  S: '#FF4D8D',
};

export const rankColor = (rank: Rank) => TIER_COLORS[tierOf(rank)];
