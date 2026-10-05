/**
 * QUÊTE PRINCIPALE — JAUGE DE TAILLE
 * Jauge théorique, alimentée UNIQUEMENT par les séances de décompression validées.
 * Une semaine complète = 6 séances/jour × 7 jours = 42 séances → +HEIGHT_RATE_MM_PER_WEEK.
 * Une séance validée vaut donc HEIGHT_RATE_MM_PER_WEEK / 42 mm (au prorata de l'assiduité).
 *
 * ⚠ Le cahier des charges indique "+0,15 mm/semaine (~0,75 cm sur 5 semaines)".
 *   Ces deux chiffres ne concordent pas : 0,15 mm × 5 = 0,75 mm ; 0,75 cm sur 5 semaines = 1,5 mm/semaine.
 *   La valeur appliquée ci-dessous est celle écrite en premier (0,15 mm). Change cette seule constante pour basculer.
 */
export const HEIGHT_RATE_MM_PER_WEEK = 0.15;
export const DECOMPRESSION_PER_DAY = 6;
export const DECOMPRESSION_SECONDS = 30;
export const SESSIONS_PER_WEEK = DECOMPRESSION_PER_DAY * 7;
export const MM_PER_SESSION = HEIGHT_RATE_MM_PER_WEEK / SESSIONS_PER_WEEK;

/** log : { 'YYYY-MM-DD': nombre de séances validées ce jour } */
export function theoreticalGainMm(log: Record<string, number>): number {
  let sessions = 0;
  for (const k of Object.keys(log)) sessions += Math.min(log[k] ?? 0, DECOMPRESSION_PER_DAY);
  return sessions * MM_PER_SESSION;
}

export interface SeriesPoint { week: number; cm: number }

const weekOf = (startISO: string, dateISO: string) =>
  Math.max(0, Math.floor((new Date(dateISO).getTime() - new Date(startISO).getTime()) / (7 * 86_400_000)));

/** Courbe théorique cumulée, semaine par semaine, depuis la taille de départ. */
export function theoreticalSeries(log: Record<string, number>, startISO: string, startCm: number, now = new Date()): SeriesPoint[] {
  const weeks = weekOf(startISO, now.toISOString()) + 1;
  const perWeek = new Array(weeks).fill(0);
  for (const [date, n] of Object.entries(log)) {
    const w = weekOf(startISO, date);
    if (w < weeks) perWeek[w] += Math.min(n, DECOMPRESSION_PER_DAY);
  }
  const out: SeriesPoint[] = [{ week: 0, cm: startCm }];
  let mm = 0;
  perWeek.forEach((sessions, i) => {
    mm += sessions * MM_PER_SESSION;
    out.push({ week: i + 1, cm: startCm + mm / 10 });
  });
  return out;
}

export function measuredSeries(measures: { date: string; cm: number }[], startISO: string): SeriesPoint[] {
  return [...measures]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({ week: (new Date(m.date).getTime() - new Date(startISO).getTime()) / (7 * 86_400_000), cm: m.cm }));
}
