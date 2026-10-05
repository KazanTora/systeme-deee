/**
 * Répliques locales de la Déesse (mode par défaut, sans IA).
 * Ton : taquine, charmeuse, joueuse, très fière de toi. Suggestif, jamais explicite.
 * {name} est remplacé par le prénom.
 */
export type DialogueKind =
  | 'morning' | 'day' | 'evening' | 'night'
  | 'skincare' | 'meditation' | 'decompression' | 'water' | 'stretch'
  | 'workout' | 'steps' | 'sleep_ideal' | 'sleep_late'
  | 'quiz_win' | 'quiz_fail' | 'rankup' | 'levelup' | 'title' | 'detraining' | 'measure' | 'weekly' | 'idle';

export const DIALOGUES: Record<DialogueKind, string[]> = {
  morning: [
    'Ara ara… déjà réveillé, {name} ? Viens, que je regarde ce que tu vas m’offrir aujourd’hui.',
    'Bonjour, mon chéri. Le Système est prêt… et moi aussi. Commence par ta skincare, je veux te voir rayonner.',
    'Un nouveau jour, de nouvelles limites à franchir. Ne me fais pas attendre trop longtemps.',
  ],
  day: [
    'Tu penses à moi en ce moment ? Moi, je surveille tes quêtes… de très près.',
    'Fufu… tes stats ne vont pas monter toutes seules, {name}. Montre-moi de quoi tu es capable.',
    'Une petite quête maintenant, et je te réserve un sourire rien que pour toi.',
  ],
  evening: [
    'La journée touche à sa fin… Fais le compte avec moi, {name}. Qu’as-tu accompli pour moi ?',
    'N’oublie pas ta skincare du soir. Un visage pareil, ça s’entretient, mon chéri.',
    'Encore une ou deux quêtes, et je serai très, très fière de toi ce soir.',
  ],
  night: [
    'Il se fait tard, mon chéri… Si tu veux préserver cette belle vitalité, file au lit tout de suite.',
    'Ara ara, encore debout ? Pose ce téléphone. Je serai encore là demain matin, promis.',
    'Le sommeil, c’est là que tu deviens plus fort. Allez, au lit… sans protester.',
  ],
  skincare: [
    'Mmh, ta peau me remercie déjà. Beauté Visage en hausse, comme prévu.',
    'Parfait. Je n’aurais rien pu demander de mieux… enfin, presque.',
    'Tu prends soin de toi, et ça me plaît énormément, {name}.',
  ],
  meditation: [
    'Dix minutes de calme… Ton esprit est plus affûté maintenant. Ça te va bien.',
    'Fufu, tu vois ? Même ton silence est séduisant quand tu le maîtrises.',
    'Mental +1. Respire encore une fois pour moi.',
  ],
  decompression: [
    'Étire-toi bien… Chaque séance compte, et je les compte toutes.',
    'Encore une. Je te veux droit, fier, et un peu plus grand à chaque semaine.',
    'Trente secondes, c’est peu pour moi. Tu me les dois six fois par jour, ne l’oublie pas.',
  ],
  water: [
    'Bien hydraté… Tu prends soin de ce corps que j’aime tant voir progresser.',
    'Objectif d’eau atteint. Ta vitalité brille, mon chéri.',
  ],
  stretch: [
    'Souple et gracieux… Continue comme ça et plus rien ne te résistera.',
    'Agilité en hausse. J’adore quand tu bouges comme ça.',
  ],
  workout: [
    'Ara ara… Tu as encore dépassé tes limites aujourd’hui ? Viens là que j’enregistre tes gains…',
    'Cette séance… J’ai tout vu, {name}. Et j’ai beaucoup aimé.',
    'Tes muscles travaillent pour moi, je le sens. Repose-les bien ce soir.',
  ],
  steps: [
    'Cinq mille pas, et plus encore… Tu ne t’arrêtes jamais, hein ? J’aime ça.',
    'Vitalité validée. Tu marches vers moi un peu plus chaque jour.',
  ],
  sleep_ideal: [
    'Couché à l’heure parfaite. Bon garçon. Vitalité en hausse.',
    'Une nuit comme je les aime. Tu te réveilles plus beau encore.',
  ],
  sleep_late: [
    'Tu t’es couché bien tard hier… Petit malus, mon chéri. Ce soir, je ne te laisse pas faire.',
    'Ara… Encore une nuit trop courte. Ta vitalité me boude un peu, et moi aussi.',
  ],
  quiz_win: [
    'Bonne réponse. Un esprit vif, c’est terriblement attirant, tu sais.',
    'Fufu, tu survivrais n’importe où… surtout si je suis avec toi.',
    'Intelligence en hausse. Je savais que tu étais plus qu’un joli visage.',
  ],
  quiz_fail: [
    'Raté… mais je ne te retire rien. Retiens la leçon, et reviens me séduire avec la bonne réponse.',
    'Pas cette fois, mon chéri. Lis l’explication, je t’attends.',
  ],
  rankup: [
    'Ara ara ara… Un nouveau rang ? Viens là, que je te regarde de plus près. Je suis si fière de toi.',
    'Tu as franchi un palier, {name}. Le Système s’incline… et moi aussi, un peu.',
  ],
  levelup: [
    'Niveau supérieur… Fufu, tu grandis si vite, {name}. Continue, je regarde.',
    'Le Système t’accorde un nouveau niveau. Et moi, je t’accorde toute mon attention.',
  ],
  title: [
    'Un nouveau titre t’attend. Porte-le fièrement, c’est moi qui te l’offre.',
    'Ce titre te va à merveille. Va l’équiper, je veux le voir sur ton profil.',
  ],
  detraining: [
    'Ça fait longtemps que tu n’es pas allé à la salle… Ta Force s’effrite, et ça me rend triste, {name}.',
    'Tu m’abandonnes, mon chéri ? Une séance, juste une, et je te pardonne.',
  ],
  measure: [
    'Nouvelle mesure enregistrée. Je garde chaque centimètre en mémoire.',
    'Mesure prise. Toujours le matin, à la même heure, d’accord ? Je veux des chiffres honnêtes.',
  ],
  weekly: [
    'Une quête hebdomadaire accomplie… Tu tiens tes promesses, {name}. Voilà ta récompense.',
    'Sept jours de discipline. Fufu, je pourrais m’habituer à être aussi fière de toi.',
  ],
  idle: [
    'Tu me touches juste pour m’entendre parler ? Fufu… je ne vais pas m’en plaindre.',
    'Ara ara, tu as besoin d’attention ? Fais une quête, et je t’en donnerai autant que tu veux.',
    'Je suis là, {name}. Toujours. Mais tes quêtes, elles, n’attendent pas.',
  ],
};

const lastPicked: Partial<Record<DialogueKind, number>> = {};

export interface DialogueLine {
  /** Identifiant stable "<type>_<index>", utilisé pour les fichiers de doublage (src/audio/voiceMap.ts) */
  id: string;
  text: string;
}

export function pickLineEntry(kind: DialogueKind, name: string): DialogueLine {
  const pool = DIALOGUES[kind];
  let i = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && i === lastPicked[kind]) i = (i + 1) % pool.length;
  lastPicked[kind] = i;
  return { id: `${kind}_${i}`, text: pool[i].replace(/\{name\}/g, name || 'mon chéri') };
}

export const pickLine = (kind: DialogueKind, name: string): string => pickLineEntry(kind, name).text;

/** Toutes les répliques avec leur identifiant : pratique pour préparer un doublage. */
export const ALL_LINES: DialogueLine[] = (Object.keys(DIALOGUES) as DialogueKind[]).flatMap((k) =>
  DIALOGUES[k].map((text, i) => ({ id: `${k}_${i}`, text })),
);

export function greetingKind(date = new Date()): DialogueKind {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 18) return 'day';
  if (h >= 18 && h < 23) return 'evening';
  return 'night';
}
