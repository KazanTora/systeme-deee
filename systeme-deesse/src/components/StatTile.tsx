import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { rankProgress } from '../logic/ranks';
import { C, F } from '../theme/tokens';
import { Bar } from './Hud';
import { RankBadge } from './RankBadge';
import { rankColor } from '../logic/ranks';

export function StatTile({ label, abbr, points, onPress }: { label: string; abbr: string; points: number; onPress?: () => void }) {
  const p = rankProgress(points);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.tile, pressed && { borderColor: C.neon }]}>
      <View style={s.row}>
        <View>
          <Text style={s.abbr}>{abbr}</Text>
          <Text style={s.label}>{label}</Text>
        </View>
        <RankBadge rank={p.rank} />
      </View>
      <Text style={s.points}>{points.toFixed(1)} pts</Text>
      <Bar ratio={p.ratio} color={rankColor(p.rank)} height={4} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  tile: { width: '48.5%', borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(4,14,36,0.7)', padding: 10, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  abbr: { fontFamily: F.hudBold, fontSize: 13, color: C.neon, letterSpacing: 2 },
  label: { fontFamily: F.hudBody, fontSize: 15, color: C.text },
  points: { fontFamily: F.hudBody, fontSize: 12, color: C.dim, marginVertical: 4 },
});
