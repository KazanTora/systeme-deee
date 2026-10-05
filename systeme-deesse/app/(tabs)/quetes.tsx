import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem, dayKey, emptyDay, DayLog } from '@/store/useSystem';
import { Screen, Panel, Bar, SysButton, T } from '@/components/Hud';
import { QuestTimer } from '@/components/QuestTimer';
import { DECOMPRESSION_PER_DAY, DECOMPRESSION_SECONDS } from '@/logic/height';
import { evaluateBedtime } from '@/logic/stats';
import { STRETCH_ROUTINE, DECOMPRESSION_TIPS } from '@/data/exercises';
import { C, F } from '@/theme/tokens';

function QuestRow({ label, detail, done, progress, onPress, cta }: {
  label: string; detail: string; done: boolean; progress?: number; onPress?: () => void; cta?: string;
}) {
  return (
    <View style={s.row}>
      <View style={[s.check, done && { backgroundColor: C.neon, borderColor: C.neon }]} />
      <View style={{ flex: 1 }}>
        <Text style={[T.body, done && { color: C.dim }]}>{label}</Text>
        <Text style={T.dim}>{detail}</Text>
        {progress !== undefined && <View style={{ marginTop: 6 }}><Bar ratio={progress} height={3} /></View>}
      </View>
      {onPress && !done && <SysButton small label={cta ?? 'Valider'} onPress={onPress} />}
    </View>
  );
}

const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Lundi de la semaine courante, sert de clé pour les quêtes hebdo. */
function weekStart(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export default function QuestsScreen() {
  const router = useRouter();
  const s0 = useSystem();
  const day: DayLog = s0.days[dayKey()] ?? emptyDay();
  const [timer, setTimer] = useState<null | 'meditation' | 'decompression'>(null);
  const [stretchOpen, setStretchOpen] = useState(false);
  const [bedInput, setBedInput] = useState('');

  // Semaine en cours (lundi → aujourd'hui)
  const ws = weekStart();
  const weekKeys: string[] = [];
  for (let d = new Date(ws); d <= new Date(); d.setDate(d.getDate() + 1)) weekKeys.push(dayKey(d));
  const week = weekKeys.map((k) => s0.days[k] ?? emptyDay());
  const wk = dayKey(ws);
  const weekly = [
    { id: 'w_sport', label: '3 séances de sport', value: week.filter((d) => d.workout).length, goal: 3, exp: 120 },
    { id: 'w_steps', label: '5 jours à 5 000 pas', value: week.filter((d) => d.stepsRewarded).length, goal: 5, exp: 100 },
    { id: 'w_skin', label: '14 skincares', value: week.reduce((a, d) => a + (d.skincareAM ? 1 : 0) + (d.skincarePM ? 1 : 0), 0), goal: 14, exp: 100 },
    { id: 'w_decomp', label: '42 décompressions', value: week.reduce((a, d) => a + d.decompression, 0), goal: 42, exp: 150 },
    { id: 'w_med', label: '5 méditations', value: week.reduce((a, d) => a + d.meditations, 0), goal: 5, exp: 100 },
  ];

  const tap = (fn: () => unknown) => () => { fn(); };

  const submitBedtime = () => {
    const m = bedInput.match(/^(\d{1,2})[:h](\d{2})$/);
    if (!m) return;
    s0.applyBedtime(parseInt(m[1], 10) * 60 + parseInt(m[2], 10));
    setBedInput('');
  };

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={[T.h1, { marginBottom: 14 }]}>Quêtes</Text>

          <Panel title="Quêtes journalières">
            <QuestRow label="Skincare du matin" detail="+0,5 Beauté Visage" done={day.skincareAM} onPress={tap(() => s0.logSkincare('AM'))} />
            <QuestRow label="Skincare du soir" detail="+0,5 Beauté Visage" done={day.skincarePM} onPress={tap(() => s0.logSkincare('PM'))} />
            <QuestRow label={`Méditation 10 min (${day.meditations} aujourd’hui)`} detail="+1 Mental par session" done={false} onPress={() => setTimer('meditation')} cta="Lancer" />
            <QuestRow label={`Eau : ${day.water} / ${s0.settings.waterGoal} verres`} detail="+0,5 Vitalité à l’objectif" done={day.waterRewarded}
              progress={day.water / s0.settings.waterGoal} onPress={tap(() => s0.logWater())} cta="+1 verre" />
            <QuestRow label="Étirements légers" detail="+1 Agilité" done={day.stretch} onPress={() => setStretchOpen(true)} cta="Ouvrir" />
            <QuestRow label={`Pas : ${day.steps.toLocaleString('fr-FR')} / 5 000`} detail="Synchronisé avec Apple Santé · +1 Vitalité, +0,5 dès 10 000"
              done={day.stepsRewarded} progress={day.steps / 5000} />
            <QuestRow label="Séance de sport" detail="Réinitialise le compteur de désentraînement" done={day.workout}
              onPress={() => router.push('/entrainement')} cta="Training" />
            <View style={s.row}>
              <View style={[s.check, day.bedtime !== null && { backgroundColor: C.neon, borderColor: C.neon }]} />
              <View style={{ flex: 1 }}>
                <Text style={T.body}>Coucher (plage idéale 23h30–00h30)</Text>
                {day.bedtime !== null ? (
                  <Text style={T.dim}>Couché à {fmt(day.bedtime)} · {evaluateBedtime(day.bedtime).delta > 0 ? '+' : ''}{evaluateBedtime(day.bedtime).delta} Vitalité</Text>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    <TextInput value={bedInput} onChangeText={setBedInput} placeholder="Auto via Santé, ou 23:45" placeholderTextColor={C.faint}
                      style={s.input} onSubmitEditing={submitBedtime} />
                    <SysButton small label="OK" onPress={submitBedtime} />
                  </View>
                )}
              </View>
            </View>
          </Panel>

          <Panel title="Quête principale" accent={C.gold}>
            <QuestRow label={`Décompression : ${day.decompression} / ${DECOMPRESSION_PER_DAY}`} detail="6 × 30 s · alimente la jauge de taille"
              done={day.decompression >= DECOMPRESSION_PER_DAY} progress={day.decompression / DECOMPRESSION_PER_DAY}
              onPress={() => setTimer('decompression')} cta="30 s" />
            <SysButton tone="gold" small label="Voir la jauge de taille" onPress={() => router.push('/taille')} />
          </Panel>

          <Panel title="Quêtes hebdomadaires">
            {weekly.map((q) => {
              const key = `${q.id}@${wk}`;
              const claimed = s0.weeklyClaims.includes(key);
              const ready = q.value >= q.goal;
              return (
                <QuestRow key={q.id} label={`${q.label} (${Math.min(q.value, q.goal)}/${q.goal})`} detail={`+${q.exp} EXP`}
                  done={claimed} progress={q.value / q.goal}
                  onPress={ready ? tap(() => s0.claimWeekly(key, q.exp)) : undefined} cta="Réclamer" />
              );
            })}
          </Panel>
        </ScrollView>

        <QuestTimer visible={timer === 'meditation'} title="Méditation" seconds={600}
          tips={['Assis, dos droit, yeux fermés.', 'Compte tes respirations de 1 à 10, puis recommence.']}
          onComplete={() => s0.logMeditation()} onClose={() => setTimer(null)} />
        <QuestTimer visible={timer === 'decompression'} title="Décompression" seconds={DECOMPRESSION_SECONDS}
          tips={DECOMPRESSION_TIPS} onComplete={() => s0.logDecompression()} onClose={() => setTimer(null)} />

        <Modal visible={stretchOpen} transparent animationType="fade" onRequestClose={() => setStretchOpen(false)}>
          <View style={s.backdrop}>
            <Panel title="Routine d’étirements">
              {STRETCH_ROUTINE.map((st) => (
                <View key={st.name} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={T.body}>{st.name}</Text><Text style={T.dim}>{st.duration}</Text>
                </View>
              ))}
              <View style={{ gap: 8, marginTop: 10 }}>
                <SysButton label="Routine terminée" onPress={() => { s0.logStretch(); setStretchOpen(false); }} disabled={day.stretch} />
                <SysButton tone="ghost" label="Fermer" onPress={() => setStretchOpen(false)} />
              </View>
            </Panel>
          </View>
        </Modal>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line + '55' },
  check: { width: 14, height: 14, borderWidth: 1.5, borderColor: C.dim, transform: [{ rotate: '45deg' }] },
  input: { flex: 1, borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 15, paddingHorizontal: 10, paddingVertical: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(1,4,12,0.88)', justifyContent: 'center', padding: 20 },
});
