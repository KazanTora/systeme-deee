import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { LIFTS, Lifts, computeForceBase } from '@/logic/force';
import { rankFromPoints } from '@/logic/ranks';
import { exerciseById } from '@/data/exercises';
import { C, F } from '@/theme/tokens';

/** Test de force : uniquement les exercices repères. Remplace les valeurs actuelles. */
export default function ForceTestScreen() {
  const router = useRouter();
  const lifts = useSystem((s) => s.lifts);
  const complete = useSystem((s) => s.completeForceTest);
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(LIFTS.map((d) => [d.id, lifts[d.id] ? String(lifts[d.id]) : ''])),
  );

  const parsed = (): Lifts => {
    const out: Lifts = {};
    for (const d of LIFTS) { const v = parseFloat((vals[d.id] ?? '').replace(',', '.')); if (!isNaN(v) && v > 0) out[d.id] = v; }
    return out;
  };
  const filled = Object.keys(parsed()).length;

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <SysButton tone="ghost" small label="‹ Retour" onPress={() => router.back()} />
            <Text style={[T.h1, { marginVertical: 12 }]}>Test de force</Text>
            <Panel title="Exercices repères">
              <Text style={[T.dim, { marginBottom: 10 }]}>Charge de travail propre sur 8–10 répétitions. Remplis au moins un exercice.</Text>
              {LIFTS.map((def) => (
                <View key={def.id} style={s.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={T.body}>{def.label}</Text>
                    <Text style={[T.dim, { fontSize: 12 }]}>{exerciseById(def.id).cue}</Text>
                  </View>
                  <TextInput keyboardType="decimal-pad" value={vals[def.id]} placeholder="—" placeholderTextColor={C.faint}
                    onChangeText={(v) => setVals((x) => ({ ...x, [def.id]: v }))} style={s.input} />
                  <Text style={[T.dim, { width: 24 }]}>kg</Text>
                </View>
              ))}
              <Text style={[T.num, { marginTop: 8 }]}>Force estimée : {rankFromPoints(computeForceBase(parsed()))}</Text>
              <View style={{ marginTop: 14 }}>
                <SysButton label="Enregistrer le test" disabled={filled === 0} onPress={() => { complete(parsed()); router.back(); }} />
              </View>
            </Panel>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  input: { width: 70, borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 8, paddingVertical: 4, textAlign: 'right' },
});
