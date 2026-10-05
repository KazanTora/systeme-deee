import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSystem, statsOf, dayKey, emptyDay } from '@/store/useSystem';
import { Screen, Panel, Bar, SysButton, T } from '@/components/Hud';
import { RankBadge } from '@/components/RankBadge';
import { StatKey, STAT_LABELS, REWARDS } from '@/logic/stats';
import { rankProgress, rankColor } from '@/logic/ranks';
import { LIFTS, liftPoints, isBenchmark } from '@/logic/force';
import { EXERCISES, UNIT_LABEL } from '@/data/exercises';
import { C, F } from '@/theme/tokens';

const HOW: Record<StatKey, string[]> = {
  force: ['Calculée sur 5 exercices repères (test de force).', 'Un record sur un repère en séance la met à jour automatiquement.', '−0,5 pt/jour au-delà du délai de grâce sans séance.'],
  agilite: ['Point de départ : test de mobilité initial.', `+${REWARDS.stretch} par routine d’étirements quotidienne.`],
  intelligence: [`Quiz réussi +${REWARDS.quiz}, cours terminé +${REWARDS.cours}, scénario réussi +${REWARDS.scenario}.`, 'Un échec ne retire rien.'],
  vitalite: [`≥ 5 000 pas +${REWARDS.steps5k} (bonus +${REWARDS.steps10kBonus} à 10 000), objectif d’eau +${REWARDS.water}.`, `Coucher 23h30–00h30 +${REWARDS.sleepIdeal}, avant +${REWARDS.sleepEarly}, après 00h30 ${REWARDS.sleepLate}.`],
  mental: [`+${REWARDS.meditation10} par session de méditation de 10 min.`],
  beaute: [`Visage : +${REWARDS.skincare} skincare matin, +${REWARDS.skincare} soir.`, 'Corps : (Vitalité + Force) / 2, automatique.', 'Beauté affichée = moyenne Visage / Corps.'],
};

function Big({ label, points }: { label: string; points: number }) {
  const p = rankProgress(points);
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={s.bigRow}>
        <Text style={T.h2}>{label}</Text>
        <RankBadge rank={p.rank} size={34} />
      </View>
      <Text style={[T.dim, { marginBottom: 6 }]}>
        {points.toFixed(1)} pts{p.next ? ` · ${p.toNext.toFixed(1)} pts avant ${p.next}` : ' · rang maximal'}
      </Text>
      <Bar ratio={p.ratio} color={rankColor(p.rank)} />
    </View>
  );
}

export default function StatDetail() {
  const { key } = useLocalSearchParams<{ key: StatKey }>();
  const router = useRouter();
  const st = useSystem();
  const stats = statsOf(st);
  const k = (key ?? 'force') as StatKey;
  const day = st.days[dayKey()] ?? emptyDay();

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Panel title={STAT_LABELS[k]}>
            {k === 'beaute' ? (
              <>
                <Big label="Beauté globale" points={stats.values.beaute} />
                <Big label="Visage (Face)" points={stats.beauteVisage} />
                <Big label="Corps (Body)" points={stats.beauteCorps} />
              </>
            ) : (
              <Big label={STAT_LABELS[k]} points={stats.values[k]} />
            )}
            {HOW[k].map((h) => <Text key={h} style={[T.dim, { marginBottom: 4 }]}>· {h}</Text>)}
          </Panel>

          {k === 'force' && (
            <>
              <Panel title="Exercices repères">
                {LIFTS.map((def) => {
                  const v = st.lifts[def.id];
                  return (
                    <View key={def.id} style={s.line}>
                      <Text style={[T.body, { flex: 1 }]}>{def.label}</Text>
                      <Text style={T.dim}>{v ? `${v} kg` : '—'}</Text>
                      <Text style={[T.num, { width: 56, textAlign: 'right' }]}>{v ? liftPoints(def, v).toFixed(0) : ''}</Text>
                    </View>
                  );
                })}
                <Text style={[T.dim, { marginTop: 8 }]}>Référence rang S modifiable dans src/logic/force.ts (refS).</Text>
                {stats.detraining > 0 && <Text style={[T.dim, { color: C.danger, marginTop: 6 }]}>Pénalité en cours : −{stats.detraining.toFixed(1)} pts</Text>}
                <View style={{ marginTop: 10 }}>
                  <SysButton small label="Refaire le test de force" onPress={() => router.push('/test-force')} />
                </View>
              </Panel>
              <Panel title="Records du catalogue">
                {!EXERCISES.some((e) => !isBenchmark(e.id) && st.records[e.id]) && <Text style={T.dim}>Aucun record pour l’instant.</Text>}
                {EXERCISES.filter((e) => !isBenchmark(e.id) && st.records[e.id]).map((e) => (
                  <View key={e.id} style={s.line}>
                    <Text style={[T.body, { flex: 1 }]}>{e.name}</Text>
                    <Text style={T.dim}>{st.records[e.id] ? `${st.records[e.id]} ${UNIT_LABEL[e.unit]}` : '—'}</Text>
                  </View>
                ))}
              </Panel>
            </>
          )}

          {k === 'vitalite' && (
            <Panel title="Aujourd’hui">
              <Text style={T.body}>Pas : {day.steps.toLocaleString('fr-FR')}</Text>
              <Text style={T.body}>Eau : {day.water} / {st.settings.waterGoal}</Text>
            </Panel>
          )}

          <SysButton tone="ghost" label="Fermer" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  bigRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.line + '44' },
});
