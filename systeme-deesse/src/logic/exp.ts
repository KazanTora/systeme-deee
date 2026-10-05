/** EXP globale et niveau. Chaque action validée rapporte de l'EXP en plus de ses points de stat. */
export const EXP = {
  skincare: 10,
  meditation: 20,
  decompression: 5,
  water: 10,
  stretch: 15,
  steps: 20,
  sleep: 15,
  workout: 50,
  quiz: 10,
  cours: 10,
  scenario: 30,
  measure: 10,
} as const;

/** EXP cumulée nécessaire pour atteindre le niveau n (niveau 1 = 0). */
export const expForLevel = (n: number) => Math.round(60 * Math.pow(n - 1, 1.6));

export function levelFromExp(exp: number) {
  let level = 1;
  while (exp >= expForLevel(level + 1)) level++;
  const floor = expForLevel(level);
  const ceil = expForLevel(level + 1);
  return { level, ratio: (exp - floor) / (ceil - floor), current: exp - floor, needed: ceil - floor };
}
