import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSystem, statsOf } from '../store/useSystem';
import { pickLineEntry, greetingKind, DialogueKind, DialogueLine } from '../data/dialogues';
import { goddessReact } from '../services/ai';
import { buildContext } from '../logic/context';
import { useGoddessVoice } from '../audio/useGoddessVoice';
import { feedback } from '../audio/feedback';
import { C, F, glow } from '../theme/tokens';
import { T } from './Hud';

/**
 * Portrait de la Déesse. Remplace simplement assets/deesse_avatar.png par ton illustration
 * (même nom, format portrait 5:7) : rien d'autre à modifier.
 */
export const DEESSE_AVATAR = require('../../assets/deesse_avatar.png');

const EVENT_LABEL: Partial<Record<DialogueKind, string>> = {
  skincare: 'Il vient de valider une skincare.',
  meditation: 'Il vient de finir 10 minutes de méditation.',
  decompression: 'Il vient de valider une séance de décompression de 30 s.',
  water: 'Il a atteint son objectif d’eau.',
  stretch: 'Il a fait sa routine d’étirements.',
  workout: 'Il vient d’enregistrer une séance de sport.',
  steps: 'Il a dépassé 5 000 pas aujourd’hui.',
  sleep_ideal: 'Il s’est couché dans la plage idéale.',
  sleep_late: 'Il s’est couché après 00h30 (léger malus).',
  quiz_win: 'Il a réussi un exercice de la Bibliothèque.',
  quiz_fail: 'Il a échoué un exercice de la Bibliothèque (aucune pénalité).',
  rankup: 'Son rang global vient de monter !',
  levelup: 'Il vient de passer un niveau.',
  title: 'Il vient de débloquer un nouveau titre.',
  measure: 'Il vient d’enregistrer une mesure de taille.',
  weekly: 'Il vient d’accomplir une quête hebdomadaire.',
  idle: 'Il touche ton portrait pour te parler.',
};

/** Typewriter : le texte s'écrit caractère par caractère, comme une fenêtre de Système. */
function useTypewriter(text: string, speed = 22) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

export function DeesseCard() {
  const name = useSystem((s) => s.name);
  const event = useSystem((s) => s.event);
  const settings = useSystem((s) => s.settings);
  const updateVoice = useSystem((s) => s.updateVoice);
  const { speak, stop } = useGoddessVoice();

  type Shown = DialogueLine & { kind: DialogueKind; delay: number };
  const [line, setLine] = useState<Shown>(() => {
    const kind: DialogueKind = statsOf(useSystem.getState()).detraining > 0 ? 'detraining' : greetingKind();
    return { ...pickLineEntry(kind, name), kind, delay: 600 };
  });
  const [thinking, setThinking] = useState(false);
  const lastEventAt = useRef(event?.at ?? 0);
  const typed = useTypewriter(line.text);

  // Chaque nouvelle réplique déclenche son doublage, après le bruitage Système s'il y en a un.
  useEffect(() => {
    const t = setTimeout(() => speak(line.id || undefined, line.kind), line.delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line]);

  const say = async (kind: DialogueKind, delay = 0) => {
    const fallback: Shown = { ...pickLineEntry(kind, name), kind, delay };
    if (settings.aiProvider === 'none') return setLine(fallback);
    setThinking(true);
    const ai = await goddessReact(
      { provider: settings.aiProvider, model: settings.aiModel },
      buildContext(useSystem.getState()),
      EVENT_LABEL[kind] ?? 'Salue-le selon l’heure.',
    );
    setThinking(false);
    setLine(ai ? { id: '', text: ai, kind, delay: 0 } : fallback);
  };

  useEffect(() => {
    if (event && event.at > lastEventAt.current) {
      lastEventAt.current = event.at;
      say(event.kind, 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.at]);

  const toggleMute = () => {
    feedback.select();
    if (!settings.voice.muted) stop();
    updateVoice({ muted: !settings.voice.muted });
  };

  return (
    <Pressable onPress={() => { feedback.select(); say('idle'); }} style={s.wrap}>
      <View style={[s.niche, glow(C.gold, 12)]}>
        <Image source={DEESSE_AVATAR} style={s.avatar} resizeMode="cover" />
      </View>
      <View style={s.bubble}>
        <View style={s.head}>
          <Text style={s.who}>La Déesse</Text>
          <Pressable onPress={toggleMute} hitSlop={12}>
            <Ionicons name={settings.voice.muted ? 'volume-mute-outline' : 'volume-high-outline'} size={18} color={C.gold} />
          </Pressable>
        </View>
        <Text style={T.voice}>{thinking ? '…' : typed}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 },
  // Niche en arc : un portrait de temple au milieu du HUD.
  niche: {
    width: 116, height: 162, borderTopLeftRadius: 58, borderTopRightRadius: 58,
    borderWidth: 1.5, borderColor: C.gold, overflow: 'hidden', backgroundColor: '#1A1428',
  },
  avatar: { width: '100%', height: '100%' },
  bubble: {
    flex: 1, marginLeft: -8, marginBottom: 10, paddingVertical: 12, paddingHorizontal: 14, paddingLeft: 20,
    borderWidth: 1, borderColor: C.goldDim, backgroundColor: 'rgba(30, 22, 10, 0.55)', minHeight: 96,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  who: { fontFamily: F.voiceTitle, fontSize: 14, color: C.gold, letterSpacing: 1 },
});
