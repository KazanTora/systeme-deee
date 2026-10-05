import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { FILTERS, ExerciseFilter, ExerciseId, UNIT_LABEL, filterExercises } from '../data/exercises';
import { isBenchmark } from '../logic/force';
import { feedback } from '../audio/feedback';
import { C, F } from '../theme/tokens';
import { Panel, SysButton, T } from './Hud';

/** Barre de filtres + recherche, partagée par le sélecteur et le catalogue du Training. */
export function ExerciseFilterBar({ filter, query, onFilter, onQuery }: {
  filter: ExerciseFilter; query: string; onFilter: (f: ExerciseFilter) => void; onQuery: (q: string) => void;
}) {
  return (
    <>
      <TextInput value={query} onChangeText={onQuery} placeholder="Rechercher un exercice" placeholderTextColor={C.faint}
        style={s.search} autoCorrect={false} clearButtonMode="while-editing" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} keyboardShouldPersistTaps="handled">
        {FILTERS.map((g) => (
          <Pressable key={g} onPress={() => { feedback.select(); onFilter(g); }} style={[s.chip, filter === g && s.chipOn]}>
            <Text style={[s.chipText, filter === g && { color: g === 'Principaux' ? C.gold : C.neon }]}>{g === 'Principaux' ? '★ Principaux' : g}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

/** Sélecteur multiple du catalogue complet, partagé par Training et Planning. */
export function ExercisePicker({ visible, title, initial = [], confirmLabel = 'Valider', onConfirm, onClose }: {
  visible: boolean; title: string; initial?: ExerciseId[]; confirmLabel?: string;
  onConfirm: (ids: ExerciseId[]) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<ExerciseId[]>(initial);
  const [filter, setFilter] = useState<ExerciseFilter>('Principaux');
  const [query, setQuery] = useState('');

  useEffect(() => { if (visible) { setSelected(initial); setQuery(''); } }, [visible]);

  const toggle = (id: ExerciseId) => {
    feedback.select();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  // La recherche porte sur tout le catalogue, quel que soit le filtre actif.
  const list = filterExercises(query ? 'Tout' : filter, query);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <ScrollView contentContainerStyle={{ paddingVertical: 50 }} keyboardShouldPersistTaps="handled">
          <Panel title={title}>
            <ExerciseFilterBar filter={filter} query={query} onFilter={setFilter} onQuery={setQuery} />
            {list.length === 0 && <Text style={T.dim}>Aucun exercice ne correspond.</Text>}
            {list.map((e) => {
              const on = selected.includes(e.id);
              return (
                <Pressable key={e.id} onPress={() => toggle(e.id)} style={[s.row, on && { borderColor: C.neon }]}>
                  <View style={[s.box, on && { backgroundColor: C.neon, borderColor: C.neon }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={T.body}>{e.favorite ? '★ ' : ''}{e.name}</Text>
                    <Text style={T.dim}>{e.group} · {UNIT_LABEL[e.unit]}{isBenchmark(e.id) ? ' · repère Force' : ''}</Text>
                  </View>
                  {on && <Text style={s.order}>{selected.indexOf(e.id) + 1}</Text>}
                </Pressable>
              );
            })}
            <View style={{ gap: 8, marginTop: 12 }}>
              <SysButton label={`${confirmLabel} (${selected.length})`} onPress={() => { onConfirm(selected); onClose(); }} />
              <SysButton tone="ghost" label="Annuler" onPress={onClose} />
            </View>
          </Panel>
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(1,4,12,0.94)', paddingHorizontal: 16 },
  search: { borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: C.line, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8 },
  chipOn: { borderColor: C.neon, backgroundColor: C.neon + '22' },
  chipText: { fontFamily: F.hud, fontSize: 14, color: C.dim },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'transparent', padding: 8, marginBottom: 4 },
  box: { width: 14, height: 14, borderWidth: 1.5, borderColor: C.dim, transform: [{ rotate: '45deg' }] },
  order: { fontFamily: F.hudBold, fontSize: 16, color: C.neon },
});
