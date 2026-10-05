import React, { useCallback } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSystem, statsOf, decompressionLog } from '@/store/useSystem';
import { Screen, Panel, Bar, SysButton, T } from '@/components/Hud';
import { StatTile } from '@/components/StatTile';
import { RankBadge } from '@/components/RankBadge';
import { DeesseCard } from '@/components/DeesseCard';
import { STAT_ORDER, STAT_LABELS, STAT_ABBR } from '@/logic/stats';
import { levelFromExp } from '@/logic/exp';
import { theoreticalGainMm } from '@/logic/height';
import { titleById, RARITY_COLORS } from '@/data/titles';
import { initHealth, getTodaySteps, getLastBedtime } from '@/services/health';
import { C, F, glow } from '@/theme/tokens';

export default function StatusScreen() {
  const router = useRouter();
  const state = useSystem();
  const stats = statsOf(state);
  const lvl = levelFromExp(state.exp);
  const title = titleById(state.titles.equipped);
  const gainMm = theoreticalGainMm(decompressionLog(state));
  const currentCm = state.height.startCm + gainMm / 10;
  const toGo = Math.max(0, state.height.targetCm - currentCm);

  // Synchronisation Apple Santé à chaque retour sur l'écran.
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!(await initHealth())) return;
        const steps = await getTodaySteps();
        if (steps !== null) useSystem.getState().applySteps(steps);
        const bed = await getLastBedtime();
        if (bed !== null) useSystem.getState().applyBedtime(bed);
      })();
    }, []),
  );

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={T.h1}>{state.name}</Text>
              <Text style={[s.title, { color: RARITY_COLORS[title.rarity] }]}>
                {title.name} · {title.rarity}
              </Text>
            </View>
            <Pressable onPress={() => router.push('/parametres')} hitSlop={12}>
              <Ionicons name="settings-outline" size={22} color={C.dim} />
            </Pressable>
          </View>

          {state.forceRetest && (
            <Panel title="Mise à jour du Système" accent={C.gold}>
              <Text style={[T.body, { marginBottom: 10 }]}>Les exercices repères de la Force ont changé. Refais ton test pour recalculer ton rang.</Text>
              <SysButton tone="gold" label="Passer le test de force" onPress={() => router.push('/test-force')} />
            </Panel>
          )}

          <Panel title="Statut" right={<RankBadge rank={stats.overallRank} size={30} />}>
            <View style={s.levelRow}>
              <Text style={[s.level, glow(C.neon, 8)]}>Niv. {lvl.level}</Text>
              <Text style={T.dim}>{lvl.current} / {lvl.needed} EXP</Text>
            </View>
            <Bar ratio={lvl.ratio} />
            <View style={s.grid}>
              {STAT_ORDER.map((k) => (
                <StatTile key={k} label={STAT_LABELS[k]} abbr={STAT_ABBR[k]} points={stats.values[k]}
                  onPress={() => router.push({ pathname: '/stat/[key]', params: { key: k } })} />
              ))}
            </View>
            {stats.detraining > 0 && (
              <Text style={[T.dim, { color: C.danger }]}>Désentraînement : −{stats.detraining.toFixed(1)} pts de Force. Une séance stoppe la chute.</Text>
            )}
          </Panel>

          <DeesseCard />

          <Pressable onPress={() => router.push('/taille')}>
            <Panel title="Quête principale" accent={C.gold}>
              <Text style={T.h2}>Décompression & taille</Text>
              <Text style={[T.dim, { marginVertical: 6 }]}>
                Estimation théorique : {currentCm.toFixed(2)} cm · objectif {state.height.targetCm} cm (reste {toGo.toFixed(2)} cm)
              </Text>
              <Bar ratio={state.height.targetCm > state.height.startCm ? (currentCm - state.height.startCm) / (state.height.targetCm - state.height.startCm) : 1} color={C.gold} />
            </Panel>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  title: { fontFamily: F.hud, fontSize: 15, marginTop: 2 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  level: { fontFamily: F.hudBold, fontSize: 22, color: C.glow },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 },
});
