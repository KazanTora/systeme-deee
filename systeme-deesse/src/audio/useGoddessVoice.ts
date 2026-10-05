/**
 * Voix de la Déesse : lecture de fichiers de doublage via expo-audio.
 * Priorité : réplique exacte (VOICE_LINES) → réaction courte de l'événement (VOICE_REACTIONS) → silence.
 */
import { useCallback, useEffect, useRef } from 'react';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { useSystem } from '../store/useSystem';
import { DialogueKind } from '../data/dialogues';
import { VOICE_LINES, VOICE_REACTIONS, EVENT_OF } from './voiceMap';
import { initAudio } from './feedback';

const lastReaction: Record<string, number> = {};

function pickReaction(kind: DialogueKind): number | undefined {
  const pool = VOICE_REACTIONS[EVENT_OF[kind]];
  if (!pool.length) return undefined;
  let i = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && i === lastReaction[kind]) i = (i + 1) % pool.length;
  lastReaction[kind] = i;
  return pool[i];
}

export function useGoddessVoice() {
  const voice = useSystem((s) => s.settings.voice);
  const playerRef = useRef<AudioPlayer | null>(null);

  const stop = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
      playerRef.current = null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  /** id = identifiant de la réplique (vide pour une réplique IA), kind = type d'événement. */
  const speak = useCallback(
    async (id: string | undefined, kind: DialogueKind, force = false) => {
      if (voice.muted && !force) return;
      const source = (id && VOICE_LINES[id]) || pickReaction(kind);
      if (!source) return;
      await initAudio();
      stop();
      const p = createAudioPlayer(source);
      p.volume = voice.volume;
      playerRef.current = p;
      p.play();
    },
    [voice.muted, voice.volume, stop],
  );

  return { speak, stop };
}
