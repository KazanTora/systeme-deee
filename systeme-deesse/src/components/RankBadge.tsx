import React from 'react';
import { Text, View } from 'react-native';
import { Rank, rankColor } from '../logic/ranks';
import { F, glow } from '../theme/tokens';

export function RankBadge({ rank, size = 22 }: { rank: Rank; size?: number }) {
  const color = rankColor(rank);
  return (
    <View style={{ minWidth: size * 1.9, alignItems: 'center' }}>
      <Text style={[{ fontFamily: F.hudBold, fontSize: size, color }, glow(color, 8)]}>{rank}</Text>
    </View>
  );
}
