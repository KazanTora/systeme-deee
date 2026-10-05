import { useEffect, useRef } from 'react';
import { useSystem } from '../store/useSystem';
import { DialogueKind } from '../data/dialogues';
import { feedback, initAudio } from '../audio/feedback';

/** Quel retour (son + vibration) pour chaque événement du Système. */
const EVENT_FEEDBACK: Partial<Record<DialogueKind, keyof typeof feedback>> = {
  skincare: 'quest', meditation: 'quest', decompression: 'quest', water: 'quest', stretch: 'quest',
  steps: 'quest', measure: 'quest', sleep_ideal: 'quest', quiz_win: 'quest', workout: 'quest',
  rankup: 'levelUp', levelup: 'levelUp', title: 'levelUp', weekly: 'levelUp',
  quiz_fail: 'error', sleep_late: 'error',
};

/** Composant invisible monté à la racine : écoute les événements du store et déclenche les retours. */
export function SystemFeedback() {
  const event = useSystem((s) => s.event);
  const last = useRef(event?.at ?? 0);

  useEffect(() => { initAudio(); }, []);

  useEffect(() => {
    if (!event || event.at <= last.current) return;
    last.current = event.at;
    const f = EVENT_FEEDBACK[event.kind];
    if (f) feedback[f]();
  }, [event?.at]);

  return null;
}
