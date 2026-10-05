/**
 * RETOURS SYSTÈME : bruitages + vibrations, façon "System" de manhwa.
 * Bruitages dans assets/audio/sfx/ — remplace un fichier par le tien en gardant le même nom.
 *
 *  feedback.tap()      clic de bouton           bip court + vibration légère
 *  feedback.select()   sélection discrète       vibration de sélection, sans son
 *  feedback.set()      série validée            impact + bip montant, vibration moyenne
 *  feedback.quest()    quête accomplie          arpège montant, vibration "succès"
 *  feedback.levelUp()  niveau / rang / titre    fanfare, triple vibration
 *  feedback.notify()   fin de minuteur          carillon, vibration "succès"
 *  feedback.error()    échec / malus            double bip grave, vibration "alerte"
 */
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { useSystem } from '../store/useSystem';

export type Sfx = 'click' | 'set' | 'quest' | 'levelup' | 'notify' | 'error';

const SOURCES: Record<Sfx, number> = {
  click: require('../../assets/audio/sfx/ui_click.wav'),
  set: require('../../assets/audio/sfx/set_done.wav'),
  quest: require('../../assets/audio/sfx/quest_complete.wav'),
  levelup: require('../../assets/audio/sfx/level_up.wav'),
  notify: require('../../assets/audio/sfx/notify.wav'),
  error: require('../../assets/audio/sfx/error.wav'),
};

const players: Partial<Record<Sfx, AudioPlayer>> = {};
let initPromise: Promise<void> | null = null;

/** Configure la session audio (joue en mode silencieux, se mélange à ta musique) et précharge les bruitages. */
export function initAudio(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
      (Object.keys(SOURCES) as Sfx[]).forEach((k) => { players[k] = createAudioPlayer(SOURCES[k]); });
    })();
  }
  return initPromise;
}

export function playSfx(k: Sfx) {
  const { sfx } = useSystem.getState().settings;
  if (!sfx.enabled) return;
  const p = players[k] ?? (players[k] = createAudioPlayer(SOURCES[k]));
  try {
    p.volume = sfx.volume;
    p.seekTo(0).then(() => p.play()).catch(() => p.play());
  } catch {
    // un bruitage raté ne doit jamais bloquer l'interface
  }
}

const vibrate = (fn: () => Promise<void>) => {
  if (useSystem.getState().settings.haptics) fn().catch(() => {});
};
const { ImpactFeedbackStyle: I, NotificationFeedbackType: N } = Haptics;

export const feedback = {
  tap: () => { playSfx('click'); vibrate(() => Haptics.impactAsync(I.Light)); },
  select: () => vibrate(() => Haptics.selectionAsync()),
  set: () => { playSfx('set'); vibrate(() => Haptics.impactAsync(I.Medium)); },
  quest: () => { playSfx('quest'); vibrate(() => Haptics.notificationAsync(N.Success)); },
  levelUp: () => {
    playSfx('levelup');
    vibrate(() => Haptics.impactAsync(I.Heavy));
    setTimeout(() => vibrate(() => Haptics.impactAsync(I.Medium)), 180);
    setTimeout(() => vibrate(() => Haptics.notificationAsync(N.Success)), 420);
  },
  notify: () => { playSfx('notify'); vibrate(() => Haptics.notificationAsync(N.Success)); },
  error: () => { playSfx('error'); vibrate(() => Haptics.notificationAsync(N.Warning)); },
};
