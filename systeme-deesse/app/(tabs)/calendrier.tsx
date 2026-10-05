import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem, dayKey, emptyDay, DayLog, Settings } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { ExercisePicker } from '@/components/ExercisePicker';
import { SCHEDULE, rescheduleAll } from '@/services/notifications';
import { evaluateBedtime } from '@/logic/stats';
import { exerciseById, UNIT_LABEL } from '@/data/exercises';
import { C, F } from '@/theme/tokens';

const CHECKS: [string, (d: DayLog) => boolean][] = [
  ['Skincare matin', (d) => d.skincareAM],
  ['Skincare soir', (d) => d.skincarePM],
  ['Méditation', (d) => d.meditations > 0],
  ['Décompression 6/6', (d) => d.decompression >= 6],
  ['Eau', (d) => d.waterRewarded],
  ['Étirements', (d) => d.stretch],
  ['5 000 pas', (d) => d.stepsRewarded],
  ['Coucher idéal', (d) => d.bedtime !== null && evaluateBedtime(d.bedtime).verdict === 'ideal'],
];
const score = (d: DayLog) => CHECKS.filter(([, f]) => f(d)).length / CHECKS.length;

const NOTIF_LABELS: Record<keyof Settings['notif'], string> = {
  water: 'Eau', skincare: 'Skincare', bedtime: 'Heure de coucher', decompression: 'Décompression',
};
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function CalendarScreen() {
  const router = useRouter();
  const days = useSystem((s) => s.days);
  const plans = useSystem((s) => s.plans);
  const history = useSystem((s) => s.history);
  const setPlan = useSystem((s) => s.setPlan);
  const settings = useSystem((s) => s.settings);
  const updateSettings = useSystem((s) => s.updateSettings);
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState(dayKey());
  const [pickerOpen, setPickerOpen] = useState(false);

  const offset = (month.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const sel = days[selected] ?? emptyDay();
  const selPlan = plans[selected] ?? [];
  const selDone = history.filter((h) => dayKey(new Date(h.date)) === selected).flatMap((h) => h.entries);
  const isFutureOrToday = selected >= dayKey();

  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  const toggle = async (k: keyof Settings['notif'], v: boolean) => {
    const notif = { ...settings.notif, [k]: v };
    updateSettings({ notif });
    await rescheduleAll(notif);
  };

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={[T.h1, { marginBottom: 12 }]}>Planning</Text>

          <Panel title={month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            right={<View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable onPress={() => shift(-1)} hitSlop={10}><Text style={s.nav}>‹</Text></Pressable>
              <Pressable onPress={() => shift(1)} hitSlop={10}><Text style={s.nav}>›</Text></Pressable>
            </View>}>
            <View style={s.grid}>
              {WEEKDAYS.map((w, i) => <Text key={i} style={s.wd}>{w}</Text>)}
              {cells.map((d, i) => {
                if (!d) return <View key={i} style={s.cell} />;
                const k = dayKey(d);
                const sc = days[k] ? score(days[k]) : 0;
                const planned = (plans[k]?.length ?? 0) > 0;
                return (
                  <Pressable key={i} style={s.cell} onPress={() => setSelected(k)}>
                    <View style={[s.dayBox, { backgroundColor: `rgba(61,184,255,${0.08 + sc * 0.62})` }, k === selected && { borderColor: C.glow }]}>
                      <Text style={s.dayNum}>{d.getDate()}</Text>
                      {planned && <View style={s.planDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Text style={[T.dim, { marginTop: 8 }]}>Intensité = quêtes accomplies · point or = séance planifiée</Text>
          </Panel>

          <Panel title={new Date(selected + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}>
            <Text style={[T.h2, { marginBottom: 6 }]}>Séance planifiée</Text>
            {selPlan.length === 0 ? (
              <Text style={T.dim}>Aucune.</Text>
            ) : (
              selPlan.map((id, i) => {
                const ex = exerciseById(id);
                return <Text key={id} style={T.body}>{i + 1}. {ex.name} <Text style={T.dim}>· {ex.sets} × {ex.target}</Text></Text>;
              })
            )}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {isFutureOrToday && <SysButton small label={selPlan.length ? 'Modifier' : 'Planifier'} onPress={() => setPickerOpen(true)} />}
              {selPlan.length > 0 && isFutureOrToday && <SysButton small tone="danger" label="Effacer" onPress={() => setPlan(selected, [])} />}
              {selected === dayKey() && selPlan.length > 0 && <SysButton small tone="ghost" label="Aller au Training" onPress={() => router.push('/entrainement')} />}
            </View>

            {selDone.length > 0 && (
              <>
                <Text style={[T.h2, { marginTop: 14, marginBottom: 6 }]}>Réalisé</Text>
                {selDone.map((e, i) => {
                  const ex = exerciseById(e.id);
                  const best = Math.max(...e.sets.map((x) => x.value));
                  return <Text key={`${e.id}-${i}`} style={T.body}>{ex.name} <Text style={T.dim}>· {e.sets.length} séries · max {best} {UNIT_LABEL[ex.unit]}</Text></Text>;
                })}
              </>
            )}

            <Text style={[T.h2, { marginTop: 14, marginBottom: 6 }]}>Quêtes</Text>
            {CHECKS.map(([label, f]) => (
              <View key={label} style={s.checkRow}>
                <Text style={T.body}>{label}</Text>
                <Text style={{ color: f(sel) ? C.ok : C.faint, fontFamily: F.hudBold }}>{f(sel) ? 'Fait' : '—'}</Text>
              </View>
            ))}
            <Text style={[T.dim, { marginTop: 6 }]}>Pas : {sel.steps.toLocaleString('fr-FR')} · Bibliothèque : {sel.library}</Text>
          </Panel>

          <Panel title="Notifications">
            {(Object.keys(NOTIF_LABELS) as (keyof Settings['notif'])[]).map((k) => (
              <View key={k} style={s.notifRow}>
                <View style={{ flex: 1 }}>
                  <Text style={T.body}>{NOTIF_LABELS[k]}</Text>
                  <Text style={T.dim}>{SCHEDULE[k].map((x) => `${x.hour}h${x.minute ? String(x.minute).padStart(2, '0') : ''}`).join(' · ')}</Text>
                </View>
                <Switch value={settings.notif[k]} onValueChange={(v) => toggle(k, v)} trackColor={{ true: C.neon, false: C.faint }} />
              </View>
            ))}
            <SysButton small label="Reprogrammer maintenant" onPress={async () => {
              const n = await rescheduleAll(settings.notif);
              Alert.alert('Système', n ? `${n} rappels programmés.` : 'Autorise les notifications dans Réglages iOS → Système.');
            }} />
          </Panel>
        </ScrollView>

        <ExercisePicker visible={pickerOpen} title="Planifier la séance" initial={selPlan} confirmLabel="Enregistrer"
          onConfirm={(ids) => setPlan(selected, ids)} onClose={() => setPickerOpen(false)} />
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  nav: { fontFamily: F.hudBold, fontSize: 22, color: C.neon },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  wd: { width: `${100 / 7}%`, textAlign: 'center', fontFamily: F.hud, color: C.dim, marginBottom: 6 },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, padding: 3 },
  dayBox: { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  dayNum: { fontFamily: F.hud, color: C.text, fontSize: 14 },
  planDot: { position: 'absolute', bottom: 3, width: 5, height: 5, backgroundColor: C.gold, transform: [{ rotate: '45deg' }] },
  checkRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.line + '55', marginBottom: 4 },
});
