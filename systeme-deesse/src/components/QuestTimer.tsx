import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { feedback } from '../audio/feedback';
import { C, F, glow } from '../theme/tokens';
import { SysButton, T } from './Hud';

/** Minuteur de quête : la validation n'est possible qu'une fois le temps écoulé. */
export function QuestTimer({ visible, title, seconds, tips, onComplete, onClose, confirmLabel = 'Valider la quête' }: {
  visible: boolean; title: string; seconds: number; tips?: string[]; onComplete: () => void; onClose: () => void; confirmLabel?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => { if (visible) { setLeft(seconds); setRunning(false); } }, [visible, seconds]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { clearInterval(id); setRunning(false); feedback.notify(); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);

  const R = 70;
  const circ = 2 * Math.PI * R;
  const ratio = 1 - left / seconds;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.box}>
          <Text style={[s.title, glow(C.neon, 6)]}>[ {title} ]</Text>
          <View style={{ alignItems: 'center', marginVertical: 18 }}>
            <Svg width={170} height={170}>
              <Circle cx={85} cy={85} r={R} stroke={C.faint} strokeWidth={4} fill="none" />
              <Circle cx={85} cy={85} r={R} stroke={C.neon} strokeWidth={4} fill="none"
                strokeDasharray={`${circ}`} strokeDashoffset={circ * (1 - ratio)} strokeLinecap="square"
                transform="rotate(-90 85 85)" />
            </Svg>
            <Text style={s.time}>{mm}:{ss}</Text>
          </View>
          {tips?.map((t) => <Text key={t} style={[T.dim, { marginBottom: 4 }]}>· {t}</Text>)}
          <View style={{ gap: 8, marginTop: 14 }}>
            {left === 0 ? (
              <SysButton label={confirmLabel} onPress={() => { onComplete(); onClose(); }} />
            ) : (
              <SysButton label={running ? 'Pause' : left === seconds ? 'Démarrer' : 'Reprendre'} onPress={() => setRunning((r) => !r)} />
            )}
            <SysButton label="Fermer" tone="ghost" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(1,4,12,0.88)', justifyContent: 'center', padding: 24 },
  box: { borderWidth: 1, borderColor: C.neon, backgroundColor: C.panelSolid, padding: 20 },
  title: { fontFamily: F.hudBold, fontSize: 16, color: C.neon, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' },
  time: { position: 'absolute', top: 62, fontFamily: F.hudBold, fontSize: 40, color: C.text },
});
