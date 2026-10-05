import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F, glow } from '../theme/tokens';
import { feedback } from '../audio/feedback';

/** Fond d'écran : abysse bleu nuit, léger halo en haut. */
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={['#0A1F4A', C.abyss, C.abyss]} locations={[0, 0.35, 1]} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}

/** Fenêtre du Système : cadre fin, coins en équerre lumineux, titre entre crochets. */
export function Panel({ title, right, children, style, accent = C.neon }: {
  title?: string; right?: React.ReactNode; children: React.ReactNode; style?: ViewStyle; accent?: string;
}) {
  return (
    <View style={[s.panel, style]}>
      {(['tl', 'tr', 'bl', 'br'] as const).map((k) => (
        <View key={k} style={[s.corner, s[k], { borderColor: accent }]} />
      ))}
      {title ? (
        <View style={s.head}>
          <Text style={[s.title, { color: accent }, glow(accent, 6)]}>[ {title} ]</Text>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function Bar({ ratio, color = C.neon, height = 6 }: { ratio: number; color?: string; height?: number }) {
  const r = Math.max(0, Math.min(1, ratio));
  return (
    <View style={[s.barTrack, { height }]}>
      <View style={[{ width: `${r * 100}%` as `${number}%`, height, backgroundColor: color }, glow(color, 6)]} />
    </View>
  );
}

export function SysButton({ label, onPress, tone = 'neon', disabled, small, silent, ...rest }: {
  label: string; tone?: 'neon' | 'gold' | 'ghost' | 'danger'; small?: boolean;
  /** true = pas de bip ni de vibration (quand l'action déclenche déjà son propre retour) */
  silent?: boolean;
} & PressableProps) {
  const color = tone === 'gold' ? C.gold : tone === 'danger' ? C.danger : C.neon;
  return (
    <Pressable
      onPress={(e) => { if (!silent) feedback.tap(); onPress?.(e); }}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        small && s.btnSmall,
        { borderColor: color, opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
        tone !== 'ghost' && { backgroundColor: color + '1F' },
      ]}
      {...rest}
    >
      <Text style={[s.btnText, small && { fontSize: 14 }, { color }]}>{label}</Text>
    </Pressable>
  );
}

export const T = StyleSheet.create({
  h1: { fontFamily: F.hudBold, fontSize: 28, color: C.text, letterSpacing: 1 },
  h2: { fontFamily: F.hudBold, fontSize: 20, color: C.text },
  body: { fontFamily: F.hudBody, fontSize: 16, color: C.text, lineHeight: 22 },
  dim: { fontFamily: F.hudBody, fontSize: 14, color: C.dim, lineHeight: 19 },
  num: { fontFamily: F.hudBold, fontSize: 18, color: C.glow },
  voice: { fontFamily: F.voice, fontSize: 19, color: '#F3E6C6', lineHeight: 25 },
});

const s = StyleSheet.create({
  panel: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    padding: 14,
    marginBottom: 14,
  },
  corner: { position: 'absolute', width: 12, height: 12 },
  tl: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontFamily: F.hudBold, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase' },
  barTrack: { backgroundColor: C.faint + '66', overflow: 'hidden' },
  btn: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  btnSmall: { paddingVertical: 7, paddingHorizontal: 12 },
  btnText: { fontFamily: F.hudBold, fontSize: 16, letterSpacing: 1.5 },
});
