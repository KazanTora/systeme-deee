import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg';
import { SeriesPoint } from '../logic/height';
import { C, F } from '../theme/tokens';

/** Théorique (pointillé néon) vs mesures réelles (points or). */
export function HeightChart({ theory, measured, width = 320, height = 200 }: {
  theory: SeriesPoint[]; measured: SeriesPoint[]; width?: number; height?: number;
}) {
  const pad = 34;
  const all = [...theory, ...measured];
  if (!all.length) return null;
  const maxW = Math.max(4, ...all.map((p) => p.week));
  let minCm = Math.min(...all.map((p) => p.cm));
  let maxCm = Math.max(...all.map((p) => p.cm));
  if (maxCm - minCm < 1) { minCm -= 0.5; maxCm += 0.5; }
  const x = (w: number) => pad + (w / maxW) * (width - pad - 10);
  const y = (cm: number) => height - pad + 10 - ((cm - minCm) / (maxCm - minCm)) * (height - pad - 10);
  const pts = (ps: SeriesPoint[]) => ps.map((p) => `${x(p.week)},${y(p.cm)}`).join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        <Line x1={pad} y1={height - pad + 10} x2={width - 10} y2={height - pad + 10} stroke={C.faint} />
        <Line x1={pad} y1={10} x2={pad} y2={height - pad + 10} stroke={C.faint} />
        {[minCm, (minCm + maxCm) / 2, maxCm].map((v) => (
          <SvgText key={v} x={2} y={y(v) + 4} fill={C.dim} fontSize={10} fontFamily={F.hudBody}>{v.toFixed(1)}</SvgText>
        ))}
        <SvgText x={width - 60} y={height - 4} fill={C.dim} fontSize={10}>semaines</SvgText>
        <Polyline points={pts(theory)} fill="none" stroke={C.neon} strokeWidth={2} strokeDasharray="5,4" />
        {measured.length > 1 && <Polyline points={pts(measured)} fill="none" stroke={C.gold} strokeWidth={1.5} />}
        {measured.map((p, i) => <Circle key={i} cx={x(p.week)} cy={y(p.cm)} r={4} fill={C.gold} />)}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
        <Text style={{ color: C.neon, fontFamily: F.hudBody }}>- - Estimation théorique</Text>
        <Text style={{ color: C.gold, fontFamily: F.hudBody }}>● Mesures réelles</Text>
      </View>
    </View>
  );
}
