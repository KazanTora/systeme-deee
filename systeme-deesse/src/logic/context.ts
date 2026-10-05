import { SystemState, statsOf, dayKey, emptyDay, decompressionLog } from '../store/useSystem';
import { STAT_ORDER, STAT_LABELS } from './stats';
import { rankFromPoints } from './ranks';
import { levelFromExp } from './exp';
import { theoreticalGainMm } from './height';
import { titleById } from '../data/titles';

/** Résumé chiffré envoyé à l'IA pour que la Déesse réagisse avec précision. */
export function buildContext(s: SystemState): string {
  const st = statsOf(s);
  const d = s.days[dayKey()] ?? emptyDay();
  const lvl = levelFromExp(s.exp).level;
  const stats = STAT_ORDER.map((k) => `${STAT_LABELS[k]} ${rankFromPoints(st.values[k])} (${st.values[k].toFixed(1)})`).join(', ');
  const now = new Date();
  return [
    `Prénom : ${s.name || 'inconnu'}. Heure : ${now.getHours()}h${String(now.getMinutes()).padStart(2, '0')}.`,
    `Niveau ${lvl}, rang global ${st.overallRank}, titre « ${titleById(s.titles.equipped).name} ».`,
    `Stats : ${stats}. Beauté visage ${rankFromPoints(st.beauteVisage)}, corps ${rankFromPoints(st.beauteCorps)}.`,
    `Aujourd’hui : skincare matin ${d.skincareAM ? 'faite' : 'à faire'}, soir ${d.skincarePM ? 'faite' : 'à faire'} ; méditations ${d.meditations} ; décompression ${d.decompression}/6 ; eau ${d.water}/${s.settings.waterGoal} ; étirements ${d.stretch ? 'faits' : 'à faire'} ; pas ${d.steps} ; séance de sport ${d.workout ? 'oui' : 'non'}.`,
    st.detraining > 0 ? `Désentraînement en cours : -${st.detraining.toFixed(1)} pts de Force.` : '',
    `Quête taille : départ ${s.height.startCm} cm, objectif ${s.height.targetCm} cm, jauge théorique +${theoreticalGainMm(decompressionLog(s)).toFixed(2)} mm.`,
  ].filter(Boolean).join('\n');
}
