import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem, statsOf, dayKey, WorkoutEntry } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { QuestTimer } from '@/components/QuestTimer';
import { RankBadge } from '@/components/RankBadge';
import { ExercisePicker, ExerciseFilterBar } from '@/components/ExercisePicker';
import { feedback } from '@/audio/feedback';
import { Exercise, ExerciseId, ExerciseFilter, exerciseById, filterExercises, UNIT_LABEL } from '@/data/exercises';
import { daysSince, isBenchmark } from '@/logic/force';
import { rankFromPoints } from '@/logic/ranks';
import { suggestRest } from '@/services/ai';
import { C, F } from '@/theme/tokens';

const fmtSet = (ex: Exercise, v: number, r?: number) =>
  ex.unit === 'kg' ? `${v} kg${r ? ` × ${r}` : ''}` : `${v} ${UNIT_LABEL[ex.unit]}`;

export default function TrainingScreen() {
  const router = useRouter();
  const st = useSystem();
  const stats = statsOf(st);
  const draft = st.draft;
  const todayPlan = st.plans[dayKey()] ?? [];
  const aiOn = st.settings.aiProvider !== 'none';
  const since = st.lastSessionAt ? daysSince(st.lastSessionAt) : null;

  const [filter, setFilter] = useState<ExerciseFilter>('Principaux');
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [inputs, setInputs] = useState<Record<string, { v: string; r: string }>>({});
  const [rest, setRest] = useState<{ ex: Exercise; sec: number } | null>(null);
  const [aiLine, setAiLine] = useState<string | null>(null);

  const addToDraft = (ids: ExerciseId[]) => {
    const existing = new Set(draft.map((e) => e.id));
    st.setDraft([...draft, ...ids.filter((id) => !existing.has(id)).map((id) => ({ id, sets: [] }))]);
  };
  const removeFromDraft = (id: ExerciseId) => st.setDraft(draft.filter((e) => e.id !== id));
  const removeSet = (id: ExerciseId, i: number) =>
    st.setDraft(draft.map((e) => (e.id === id ? { ...e, sets: e.sets.filter((_, j) => j !== i) } : e)));

  const addSet = async (ex: Exercise, feeling?: string) => {
    const inp = inputs[ex.id] ?? { v: '', r: '' };
    const value = parseFloat(inp.v.replace(',', '.'));
    const reps = parseInt(inp.r, 10);
    if (isNaN(value) || value <= 0) return;
    feedback.set();
    st.setDraft(draft.map((e) => (e.id === ex.id ? { ...e, sets: [...e.sets, { value, reps: ex.unit === 'kg' && !isNaN(reps) ? reps : undefined }] } : e)));
    // Valeur conservée pour la série suivante.
    if (feeling && aiOn) {
      setAiLine('…');
      const r = await suggestRest({ provider: st.settings.aiProvider, model: st.settings.aiModel }, ex.name, ex.restSec, feeling);
      setAiLine(r?.line ?? null);
      setRest({ ex, sec: r?.seconds ?? ex.restSec });
    } else {
      setAiLine(null);
      setRest({ ex, sec: ex.restSec });
    }
  };

  const finish = () => {
    st.logWorkout(draft);
    setInputs({});
  };
  const totalSets = draft.reduce((a, e) => a + e.sets.length, 0);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <Text style={[T.h1, { marginBottom: 12 }]}>Entraînement</Text>

          <Panel title="Force" right={<RankBadge rank={rankFromPoints(stats.values.force)} />}>
            <Text style={T.dim}>
              Base repères {stats.forceBase.toFixed(1)} pts{st.forceAdjust ? ` · ajustement ${st.forceAdjust.toFixed(1)}` : ''}
              {stats.detraining ? ` · désentraînement −${stats.detraining.toFixed(1)}` : ''}
            </Text>
            <Text style={[T.dim, { marginTop: 4 }]}>
              {since === null ? 'Aucune séance enregistrée.' : `Dernière séance il y a ${since} j · pénalité au-delà de ${st.settings.graceDays} j.`}
            </Text>
            <Text style={[T.dim, { marginTop: 4 }]}>Un record sur un exercice repère met ta Force à jour automatiquement.</Text>
            <View style={{ marginTop: 10 }}>
              <SysButton small tone="ghost" label="Refaire le test de force" onPress={() => router.push('/test-force')} />
            </View>
          </Panel>

          <Panel title="Séance en cours">
            {draft.length === 0 && (
              <View style={{ gap: 8 }}>
                <Text style={T.dim}>Choisis tes exercices dans le catalogue, ou charge la séance planifiée.</Text>
                {todayPlan.length > 0 && (
                  <SysButton label={`Charger la séance du jour (${todayPlan.length})`} onPress={() => addToDraft(todayPlan)} />
                )}
                <SysButton tone={todayPlan.length ? 'ghost' : 'neon'} label="Choisir des exercices" onPress={() => setPickerOpen(true)} />
              </View>
            )}

            {draft.map((entry: WorkoutEntry) => {
              const ex = exerciseById(entry.id);
              const inp = inputs[ex.id] ?? { v: '', r: '' };
              const record = st.records[ex.id];
              return (
                <View key={ex.id} style={s.card}>
                  <View style={s.cardHead}>
                    <View style={{ flex: 1 }}>
                      <Text style={T.h2}>{ex.name}</Text>
                      <Text style={T.dim}>
                        {ex.sets} × {ex.target} · repos {ex.restSec} s{record ? ` · record ${record} ${UNIT_LABEL[ex.unit]}` : ''}{isBenchmark(ex.id) ? ' · repère' : ''}
                      </Text>
                    </View>
                    <Pressable onPress={() => removeFromDraft(ex.id)} hitSlop={10}><Text style={s.x}>✕</Text></Pressable>
                  </View>

                  {entry.sets.map((set, i) => (
                    <View key={i} style={s.setRow}>
                      <Text style={[T.body, { flex: 1 }]}>Série {i + 1} · {fmtSet(ex, set.value, set.reps)}</Text>
                      <Pressable onPress={() => removeSet(ex.id, i)} hitSlop={8}><Text style={[s.x, { fontSize: 13 }]}>✕</Text></Pressable>
                    </View>
                  ))}

                  <View style={s.inputRow}>
                    <TextInput keyboardType="decimal-pad" value={inp.v} placeholder={UNIT_LABEL[ex.unit]} placeholderTextColor={C.faint}
                      onChangeText={(v) => setInputs((x) => ({ ...x, [ex.id]: { ...inp, v } }))} style={s.input} />
                    {ex.unit === 'kg' && (
                      <TextInput keyboardType="number-pad" value={inp.r} placeholder="reps" placeholderTextColor={C.faint}
                        onChangeText={(r) => setInputs((x) => ({ ...x, [ex.id]: { ...inp, r } }))} style={s.input} />
                    )}
                    {!aiOn && <SysButton small silent label="Série ✓" onPress={() => addSet(ex)} />}
                  </View>
                  {aiOn && (
                    <View style={[s.inputRow, { marginTop: 6 }]}>
                      {['Facile', 'Correct', 'Très dur'].map((f) => (
                        <SysButton key={f} small silent tone="gold" label={f} onPress={() => addSet(ex, f)} />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {draft.length > 0 && (
              <View style={{ gap: 8, marginTop: 6 }}>
                <SysButton tone="ghost" small label="Ajouter des exercices" onPress={() => setPickerOpen(true)} />
                <SysButton silent label={`Terminer la séance (${totalSets} séries)`} disabled={totalSets === 0} onPress={finish} />
                <SysButton tone="danger" small label="Abandonner la séance" onPress={() => st.setDraft([])} />
              </View>
            )}
          </Panel>

          <Panel title="Catalogue">
            <ExerciseFilterBar filter={filter} query={query} onFilter={setFilter} onQuery={setQuery} />
            {filterExercises(query ? 'Tout' : filter, query).map((ex) => {
              const inDraft = draft.some((d) => d.id === ex.id);
              return (
                <View key={ex.id} style={s.catRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={T.body}>{ex.favorite ? '★ ' : ''}{ex.name}</Text>
                    <Text style={T.dim}>{ex.group} · {ex.sets} × {ex.target} · {UNIT_LABEL[ex.unit]}{st.records[ex.id] ? ` · record ${st.records[ex.id]}` : ''}</Text>
                    <Text style={[T.dim, { fontSize: 13, marginTop: 2 }]}>{ex.cue}</Text>
                  </View>
                  <SysButton small tone={inDraft ? 'ghost' : 'neon'} label={inDraft ? 'Ajouté' : 'Ajouter'} disabled={inDraft} onPress={() => addToDraft([ex.id])} />
                </View>
              );
            })}
          </Panel>
        </ScrollView>

        <ExercisePicker visible={pickerOpen} title="Composer la séance" initial={[]} confirmLabel="Ajouter"
          onConfirm={addToDraft} onClose={() => setPickerOpen(false)} />

        <QuestTimer visible={!!rest} title={rest ? `Repos · ${rest.ex.name}` : ''} seconds={rest?.sec ?? 60}
          tips={aiLine ? [aiLine] : undefined} confirmLabel="Série suivante" onComplete={() => {}} onClose={() => setRest(null)} />
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderColor: C.line, padding: 10, marginBottom: 10, backgroundColor: 'rgba(4,14,36,0.6)' },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  x: { fontFamily: F.hudBold, fontSize: 16, color: C.dim },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  input: { width: 74, borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 8, paddingVertical: 5, textAlign: 'right' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line + '44' },
});
