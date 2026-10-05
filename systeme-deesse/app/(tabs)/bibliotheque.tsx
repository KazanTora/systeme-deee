import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feedback } from '@/audio/feedback';
import { useSystem } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { CATEGORIES, Category, QUIZZES, COURSES, SCENARIOS, Quiz, Course, Scenario } from '@/data/library';
import { generateScenario } from '@/services/ai';
import { C, F } from '@/theme/tokens';

type Mode = 'Quiz' | 'Cours' | 'Scénario';
type Filter = Category | 'Aléatoire';

const pick = <X,>(arr: X[]) => arr[Math.floor(Math.random() * arr.length)];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={() => { feedback.select(); onPress(); }} style={[s.chip, active && { borderColor: C.neon, backgroundColor: C.neon + '22' }]}>
      <Text style={[s.chipText, active && { color: C.neon }]}>{label}</Text>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const answer = useSystem((s) => s.answerLibrary);
  const settings = useSystem((s) => s.settings);
  const coursesRead = useSystem((s) => s.coursesRead);
  const [mode, setMode] = useState<Mode>('Quiz');
  const [filter, setFilter] = useState<Filter>('Aléatoire');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const [loading, setLoading] = useState(false);

  const byCat = <X extends { cat: Category }>(arr: X[]) => (filter === 'Aléatoire' ? arr : arr.filter((x) => x.cat === filter));
  const courses = useMemo(() => byCat(COURSES), [filter]);

  const reset = () => { setChosen(null); setRewarded(false); };
  const nextQuiz = () => { reset(); const pool = byCat(QUIZZES); setQuiz(pool.length ? pick(pool) : null); };
  const nextScenario = async (useAI: boolean) => {
    reset();
    if (useAI) {
      setLoading(true);
      const sc = await generateScenario({ provider: settings.aiProvider, model: settings.aiModel }, filter);
      setLoading(false);
      if (sc) return setScenario(sc);
    }
    const pool = byCat(SCENARIOS);
    setScenario(pool.length ? pick(pool) : pick(SCENARIOS));
  };

  const choose = (i: number, ok: boolean, kind: 'quiz' | 'scenario', id: string) => {
    if (chosen !== null) return;
    setChosen(i);
    setRewarded(answer(kind, ok, id.startsWith('ai-') ? undefined : id));
  };

  const optionStyle = (i: number, correct: boolean) => {
    if (chosen === null) return s.option;
    if (correct) return [s.option, { borderColor: C.ok, backgroundColor: C.ok + '1A' }];
    if (i === chosen) return [s.option, { borderColor: C.danger, backgroundColor: C.danger + '1A' }];
    return [s.option, { opacity: 0.5 }];
  };

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={T.h1}>Bibliothèque</Text>
          <Text style={[T.dim, { marginBottom: 12 }]}>Intelligence · survie et tactique. Un échec ne coûte rien.</Text>

          <View style={s.chips}>
            {(['Quiz', 'Cours', 'Scénario'] as Mode[]).map((m) => (
              <Chip key={m} label={m} active={mode === m} onPress={() => { setMode(m); reset(); setQuiz(null); setCourse(null); setScenario(null); }} />
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {(['Aléatoire', ...CATEGORIES] as Filter[]).map((c) => (
              <Chip key={c} label={c} active={filter === c} onPress={() => { setFilter(c); reset(); setQuiz(null); setScenario(null); setCourse(null); }} />
            ))}
          </ScrollView>

          {mode === 'Quiz' && (
            <Panel title={quiz ? `Quiz · ${quiz.cat}` : 'Quiz'}>
              {!quiz ? (
                <SysButton label="Lancer un quiz" onPress={nextQuiz} />
              ) : (
                <>
                  <Text style={[T.h2, { marginBottom: 12 }]}>{quiz.q}</Text>
                  {quiz.choices.map((c, i) => (
                    <Pressable key={c} style={optionStyle(i, i === quiz.answer)} onPress={() => choose(i, i === quiz.answer, 'quiz', quiz.id)}>
                      <Text style={T.body}>{c}</Text>
                    </Pressable>
                  ))}
                  {chosen !== null && (
                    <>
                      <Text style={[T.dim, { marginVertical: 10 }]}>{quiz.why}</Text>
                      {chosen === quiz.answer && <Text style={[T.dim, { color: rewarded ? C.ok : C.dim, marginBottom: 10 }]}>{rewarded ? '+1 Intelligence' : 'Déjà récompensée aujourd’hui'}</Text>}
                      <SysButton label="Question suivante" onPress={nextQuiz} />
                    </>
                  )}
                </>
              )}
            </Panel>
          )}

          {mode === 'Cours' && !course && courses.map((c) => (
            <Pressable key={c.id} onPress={() => setCourse(c)}>
              <Panel>
                <Text style={T.h2}>{c.title}</Text>
                <Text style={T.dim}>{c.cat} · {coursesRead.includes(c.id) ? 'Lu' : '+0,5 Intelligence'}</Text>
              </Panel>
            </Pressable>
          ))}
          {mode === 'Cours' && course && (
            <Panel title={course.cat}>
              <Text style={[T.h2, { marginBottom: 10 }]}>{course.title}</Text>
              {course.body.map((p) => <Text key={p} style={[T.body, { marginBottom: 10 }]}>{p}</Text>)}
              <View style={{ gap: 8 }}>
                <SysButton label={coursesRead.includes(course.id) ? 'Retour' : 'J’ai terminé ce cours'}
                  onPress={() => { if (!coursesRead.includes(course.id)) answer('cours', true, course.id); setCourse(null); }} />
              </View>
            </Panel>
          )}

          {mode === 'Scénario' && (
            <Panel title={scenario ? `Scénario · ${scenario.cat}` : 'Scénario tactique'}>
              {loading && <ActivityIndicator color={C.neon} />}
              {!scenario && !loading && (
                <View style={{ gap: 8 }}>
                  <SysButton label="Scénario de la Bibliothèque" onPress={() => nextScenario(false)} />
                  {settings.aiProvider !== 'none' && <SysButton tone="gold" label="Scénario inédit (Déesse IA)" onPress={() => nextScenario(true)} />}
                </View>
              )}
              {scenario && !loading && (
                <>
                  <Text style={[T.h2, { marginBottom: 6 }]}>{scenario.title}</Text>
                  <Text style={[T.body, { marginBottom: 12 }]}>{scenario.situation}</Text>
                  {scenario.options.map((o, i) => (
                    <Pressable key={o.text} style={optionStyle(i, o.correct)} onPress={() => choose(i, o.correct, 'scenario', scenario.id)}>
                      <Text style={T.body}>{o.text}</Text>
                      {chosen !== null && (i === chosen || o.correct) && <Text style={[T.dim, { marginTop: 6 }]}>{o.feedback}</Text>}
                    </Pressable>
                  ))}
                  {chosen !== null && (
                    <View style={{ gap: 8, marginTop: 6 }}>
                      {scenario.options[chosen].correct && <Text style={[T.dim, { color: rewarded ? C.ok : C.dim }]}>{rewarded ? '+2 Intelligence' : 'Déjà récompensé aujourd’hui'}</Text>}
                      <SysButton label="Scénario suivant" onPress={() => nextScenario(false)} />
                      {settings.aiProvider !== 'none' && <SysButton tone="gold" label="Scénario inédit (IA)" onPress={() => nextScenario(true)} />}
                    </View>
                  )}
                </>
              )}
            </Panel>
          )}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: C.line, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8 },
  chipText: { fontFamily: F.hud, fontSize: 14, color: C.dim },
  option: { borderWidth: 1, borderColor: C.line, padding: 12, marginBottom: 8 },
});
