import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSystem } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { LIFTS, Lifts, computeForceBase } from '@/logic/force';
import { agilityInitialPoints } from '@/logic/stats';
import { rankFromPoints } from '@/logic/ranks';
import { AGILITY_TEST } from '@/data/exercises';
import { initHealth } from '@/services/health';
import { ensurePermission } from '@/services/notifications';
import { C, F, glow } from '@/theme/tokens';

/** Éveil du Système : prénom → charges réelles → test de mobilité → taille de départ. */
export default function Onboarding() {
  const complete = useSystem((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [lifts, setLifts] = useState<Record<string, string>>({});
  const [agi, setAgi] = useState<number[]>(AGILITY_TEST.map(() => -1));
  const [height, setHeight] = useState('');

  const parsedLifts = (): Lifts => {
    const out: Lifts = {};
    for (const d of LIFTS) { const v = parseFloat((lifts[d.id] ?? '').replace(',', '.')); if (!isNaN(v) && v > 0) out[d.id] = v; }
    return out;
  };
  const heightCm = parseFloat(height.replace(',', '.'));

  const finish = async () => {
    complete({ name, lifts: parsedLifts(), agilityScores: agi.map((a) => Math.max(0, a)), heightCm });
    await initHealth();
    await ensurePermission();
  };

  const steps = [
    {
      title: 'Éveil',
      valid: name.trim().length > 0,
      body: (
        <>
          <Text style={[T.voice, { marginBottom: 14 }]}>« Ara ara… Un nouvel Éveillé. Dis-moi ton nom, que je sache qui je vais surveiller de si près. »</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Prénom" placeholderTextColor={C.faint} style={s.input} autoFocus />
        </>
      ),
    },
    {
      title: 'Test de force',
      valid: Object.keys(parsedLifts()).length > 0,
      body: (
        <>
          <Text style={[T.dim, { marginBottom: 10 }]}>Les 5 exercices repères. Charge de travail propre sur 8–10 répétitions. Renseigne au moins un exercice.</Text>
          {LIFTS.map((d) => (
            <View key={d.id} style={s.liftRow}>
              <View style={{ flex: 1 }}>
                <Text style={T.body}>{d.label}</Text>
              </View>
              <TextInput keyboardType="decimal-pad" value={lifts[d.id] ?? ''} onChangeText={(v) => setLifts((l) => ({ ...l, [d.id]: v }))}
                style={s.small} placeholder="—" placeholderTextColor={C.faint} />
              <Text style={[T.dim, { width: 34 }]}>{d.unit}</Text>
            </View>
          ))}
          <Text style={[T.num, { marginTop: 8 }]}>Force estimée : {rankFromPoints(computeForceBase(parsedLifts()))}</Text>
        </>
      ),
    },
    {
      title: 'Test de mobilité',
      valid: agi.every((a) => a >= 0),
      body: (
        <>
          <Text style={[T.dim, { marginBottom: 10 }]}>Fais chaque mouvement, puis choisis ce qui correspond à ton ressenti.</Text>
          {AGILITY_TEST.map((item, i) => (
            <View key={item.id} style={{ marginBottom: 14 }}>
              <Text style={[T.body, { marginBottom: 6 }]}>{item.name}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {item.levels.map((lv, score) => (
                  <Pressable key={lv} onPress={() => setAgi((a) => a.map((x, j) => (j === i ? score : x)))}
                    style={[s.opt, agi[i] === score && { borderColor: C.neon, backgroundColor: C.neon + '22' }]}>
                    <Text style={[s.optText, agi[i] === score && { color: C.neon }]}>{lv}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
          {agi.every((a) => a >= 0) && <Text style={T.num}>Agilité initiale : {rankFromPoints(agilityInitialPoints(agi))}</Text>}
        </>
      ),
    },
    {
      title: 'Quête principale',
      valid: heightCm > 100 && heightCm < 250,
      body: (
        <>
          <Text style={[T.dim, { marginBottom: 10 }]}>Ta taille actuelle, mesurée le matin. Objectif : 180 cm.</Text>
          <TextInput value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholder="ex. 176,5" placeholderTextColor={C.faint} style={s.input} />
        </>
      ),
    },
  ];
  const cur = steps[step];

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40 }}>
            <Text style={[s.sys, glow(C.neon, 10)]}>Le Système s’éveille</Text>
            <Text style={[T.dim, { textAlign: 'center', marginBottom: 20 }]}>Étape {step + 1} / {steps.length}</Text>
            <Panel title={cur.title}>
              {cur.body}
              <View style={{ gap: 8, marginTop: 18 }}>
                <SysButton label={step === steps.length - 1 ? 'Accepter le Système' : 'Continuer'} disabled={!cur.valid}
                  onPress={() => (step === steps.length - 1 ? finish() : setStep(step + 1))} />
                {step > 0 && <SysButton tone="ghost" label="Retour" onPress={() => setStep(step - 1)} />}
              </View>
            </Panel>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  sys: { fontFamily: F.hudBold, fontSize: 30, color: C.glow, textAlign: 'center', letterSpacing: 2 },
  input: { borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 18, paddingHorizontal: 12, paddingVertical: 10 },
  liftRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  small: { width: 70, borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 8, paddingVertical: 4, textAlign: 'right' },
  opt: { borderWidth: 1, borderColor: C.line, paddingVertical: 6, paddingHorizontal: 10 },
  optText: { fontFamily: F.hudBody, fontSize: 13, color: C.dim },
});
