/**
 * DOUBLAGE DE LA DÉESSE — fichiers audio (.mp3, .m4a ou .wav)
 *
 * Deux niveaux, du plus précis au plus général :
 *  1. VOICE_LINES     : la réplique exacte doublée (le texte de la bulle = ce qu'elle dit).
 *                       Clé = identifiant "<type>_<index>" (voir assets/audio/goddess/SCRIPT.md).
 *  2. VOICE_REACTIONS : courtes réactions par événement ("Ara ara~", "Fufu…", soupir, "Mmh~"),
 *                       jouées quand la réplique n'a pas de doublage. Pas de phrase complète ici :
 *                       elles ne doivent jamais contredire le texte de la bulle.
 * Sans fichier pour un événement, la Déesse reste silencieuse (la bulle s'affiche quand même).
 *
 * ⚠ require() exige que le fichier existe au moment du build : ajoute la ligne
 *   seulement une fois le fichier déposé dans le dossier.
 */
import { DialogueKind } from '../data/dialogues';

export type VoiceEvent = 'accueil' | 'quete' | 'succes' | 'echec' | 'rang' | 'nuit' | 'toucher';

/** Chaque type de réplique appartient à un événement vocal. */
export const EVENT_OF: Record<DialogueKind, VoiceEvent> = {
  morning: 'accueil', day: 'accueil', evening: 'accueil', night: 'nuit',
  skincare: 'quete', meditation: 'quete', decompression: 'quete', water: 'quete', stretch: 'quete', steps: 'quete', measure: 'quete',
  workout: 'succes', sleep_ideal: 'succes', quiz_win: 'succes', weekly: 'succes',
  quiz_fail: 'echec', sleep_late: 'echec', detraining: 'echec',
  rankup: 'rang', levelup: 'rang', title: 'rang',
  idle: 'toucher',
};

/** 1. Répliques exactes — dossier assets/audio/goddess/lines/ */
export const VOICE_LINES: Record<string, number> = {
  // 'workout_0': require('../../assets/audio/goddess/lines/workout_0.mp3'),
  // 'morning_1': require('../../assets/audio/goddess/lines/morning_1.mp3'),
};

/** 2. Réactions courtes par événement — dossier assets/audio/goddess/reactions/ (une est tirée au hasard) */
export const VOICE_REACTIONS: Record<VoiceEvent, number[]> = {
  accueil: [
    // require('../../assets/audio/goddess/reactions/accueil_1.mp3'),
  ],
  quete: [],
  succes: [],
  echec: [],
  rang: [],
  nuit: [],
  toucher: [],
};
