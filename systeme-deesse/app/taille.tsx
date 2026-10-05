import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem, decompressionLog } from '@/store/useSystem';
import { Screen, Panel, Bar, SysButton, T } from '@/components/Hud';
import { HeightChart } from '@/components/HeightChart';
import { theoreticalGainMm, theoreticalSeries, measuredSeries, HEIGHT_RATE_MM_PER_WEEK } from '@/logic/height';
import { C, F } from '@/theme/tokens';

export default function HeightScreen() {
  const router = useRouter();
  const st = useSystem();
  const { width } = useWindowDimensions();
  const [input, setInput] = useState('');
  const log = decompressionLog(st);
  const gainMm = theoreticalGainMm(log);
  const theoCm = st.height.startCm + gainMm / 10;
  const last = [...st.height.measures].sort((a, b) => a.date.localeCompare(b.date)).pop();
  const span = st.height.targetCm - st.height.startCm;

  const save = () => {
    const v = parseFloat(input.replace(',', '.'));
    if (!isNaN(v) && v > 100 && v < 250) { st.addHeightMeasure(v); setInput(''); }
  };

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <SysButton tone="ghost" small label="‹ Retour" onPress={() => router.back()} />
          <Text style={[T.h1, { marginVertical: 12 }]}>Objectif {st.height.targetCm} cm</Text>

          <Panel title="Jauge théorique" accent={C.gold}>
            <View style={s.kpis}>
              <View><Text style={T.dim}>Départ</Text><Text style={s.kpi}>{st.height.startCm.toFixed(1)} cm</Text></View>
              <View><Text style={T.dim}>Estimation</Text><Text style={[s.kpi, { color: C.gold }]}>{theoCm.toFixed(2)} cm</Text></View>
              <View><Text style={T.dim}>Dernière mesure</Text><Text style={s.kpi}>{last ? `${last.cm.toFixed(1)} cm` : '—'}</Text></View>
            </View>
            <Bar ratio={span > 0 ? (theoCm - st.height.startCm) / span : 1} color={C.gold} />
            <Text style={[T.dim, { marginTop: 8 }]}>
              +{gainMm.toFixed(2)} mm théoriques · base {HEIGHT_RATE_MM_PER_WEEK} mm par semaine complète (42 séances), au prorata des séances validées.
            </Text>
          </Panel>

          <Panel title="Évolution">
            <HeightChart width={width - 64}
              theory={theoreticalSeries(log, st.height.startDate, st.height.startCm)}
              measured={measuredSeries(st.height.measures, st.height.startDate)} />
          </Panel>

          <Panel title="Mesure officielle">
            <Text style={[T.dim, { marginBottom: 8 }]}>Mesure-toi toujours le matin, au réveil, pieds nus, dos au mur : la colonne se tasse d’environ 1 cm au fil de la journée, ce qui fausserait la comparaison.</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput value={input} onChangeText={setInput} keyboardType="decimal-pad" placeholder="ex. 176,4"
                placeholderTextColor={C.faint} style={s.input} onSubmitEditing={save} />
              <SysButton label="Enregistrer" onPress={save} />
            </View>
          </Panel>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  kpis: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  kpi: { fontFamily: F.hudBold, fontSize: 20, color: C.text },
  input: { flex: 1, borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 10 },
});
