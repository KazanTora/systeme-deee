import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSystem, AIProvider } from '@/store/useSystem';
import { Screen, Panel, SysButton, T } from '@/components/Hud';
import { GRACE_MIN, GRACE_MAX } from '@/logic/force';
import { saveApiKey, loadApiKey, DEFAULT_MODELS } from '@/services/ai';
import { initHealth, healthAvailable } from '@/services/health';
import { useGoddessVoice } from '@/audio/useGoddessVoice';
import { feedback } from '@/audio/feedback';
import { VOICE_LINES, VOICE_REACTIONS } from '@/audio/voiceMap';
import { C, F } from '@/theme/tokens';

function Stepper({ value, min, max, step = 1, decimals = 0, onChange, suffix }: {
  value: number; min: number; max: number; step?: number; decimals?: number; onChange: (v: number) => void; suffix: string;
}) {
  const round = (v: number) => Math.round(v * 100) / 100;
  return (
    <View style={s.stepper}>
      <Pressable onPress={() => onChange(round(Math.max(min, value - step)))} hitSlop={8}><Text style={s.stepBtn}>−</Text></Pressable>
      <Text style={T.num}>{value.toFixed(decimals)} {suffix}</Text>
      <Pressable onPress={() => onChange(round(Math.min(max, value + step)))} hitSlop={8}><Text style={s.stepBtn}>+</Text></Pressable>
    </View>
  );
}

function Chips<V extends string>({ options, value, onChange, color = C.neon }: {
  options: [V, string][]; value: V; onChange: (v: V) => void; color?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
      {options.map(([v, label]) => (
        <Pressable key={v} onPress={() => onChange(v)} style={[s.chip, value === v && { borderColor: color, backgroundColor: color + '22' }]}>
          <Text style={[s.chipText, value === v && { color }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const hasVoiceFiles = Object.keys(VOICE_LINES).length > 0 || Object.values(VOICE_REACTIONS).some((l) => l.length > 0);

export default function SettingsScreen() {
  const router = useRouter();
  const st = useSystem();
  const voice = st.settings.voice;
  const { speak } = useGoddessVoice();
  const [name, setName] = useState(st.name);
  const [key, setKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => { loadApiKey().then((k) => setHasKey(!!k)); }, []);

  const setProvider = (p: AIProvider) => st.updateSettings({ aiProvider: p, aiModel: p === 'none' ? '' : DEFAULT_MODELS[p] });
  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
          <SysButton tone="ghost" small label="‹ Retour" onPress={() => router.back()} />
          <Text style={[T.h1, { marginVertical: 12 }]}>Réglages</Text>

          <Panel title="Profil">
            <TextInput value={name} onChangeText={setName} onBlur={() => st.setName(name.trim())} style={s.input} placeholderTextColor={C.faint} placeholder="Prénom" />
          </Panel>

          <Panel title="Voix & sons" accent={C.gold}>
            <View style={s.switchRow}>
              <Text style={T.body}>Voix de la Déesse</Text>
              <Switch value={!voice.muted} onValueChange={(on) => st.updateVoice({ muted: !on })} trackColor={{ true: C.gold, false: C.faint }} />
            </View>
            <Text style={T.dim}>Volume de la voix</Text>
            <Stepper value={Math.round(voice.volume * 100)} min={0} max={100} step={10} suffix="%" onChange={(v) => st.updateVoice({ volume: v / 100 })} />
            <Text style={[T.dim, { marginVertical: 8 }]}>{hasVoiceFiles
              ? 'Doublages chargés depuis assets/audio/goddess.'
              : 'Aucun doublage installé : dépose tes fichiers dans assets/audio/goddess et déclare-les dans src/audio/voiceMap.ts.'}</Text>
            <SysButton small tone="gold" label="Tester la voix" onPress={() => speak(undefined, 'idle', true)} disabled={!hasVoiceFiles} />

            <View style={[s.switchRow, { marginTop: 16 }]}>
              <Text style={T.body}>Bruitages du Système</Text>
              <Switch value={st.settings.sfx.enabled} onValueChange={(enabled) => st.updateSfx({ enabled })} trackColor={{ true: C.neon, false: C.faint }} />
            </View>
            <Text style={T.dim}>Volume des bruitages</Text>
            <Stepper value={Math.round(st.settings.sfx.volume * 100)} min={0} max={100} step={10} suffix="%" onChange={(v) => st.updateSfx({ volume: v / 100 })} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              <SysButton small silent label="Quête" onPress={feedback.quest} />
              <SysButton small silent label="Série" onPress={feedback.set} />
              <SysButton small silent label="Niveau" onPress={feedback.levelUp} />
              <SysButton small silent label="Alerte" onPress={feedback.error} />
            </View>

            <View style={[s.switchRow, { marginTop: 16 }]}>
              <Text style={T.body}>Vibrations</Text>
              <Switch value={st.settings.haptics} onValueChange={(haptics) => st.updateSettings({ haptics })} trackColor={{ true: C.neon, false: C.faint }} />
            </View>
          </Panel>

          <Panel title="Règles du Système">
            <Text style={T.body}>Délai avant désentraînement</Text>
            <Stepper value={st.settings.graceDays} min={GRACE_MIN} max={GRACE_MAX} suffix="jours" onChange={(v) => st.updateSettings({ graceDays: v })} />
            <Text style={[T.body, { marginTop: 10 }]}>Objectif d’eau quotidien</Text>
            <Stepper value={st.settings.waterGoal} min={4} max={16} suffix="verres" onChange={(v) => st.updateSettings({ waterGoal: v })} />
          </Panel>

          <Panel title="Déesse IA (optionnel)" accent={C.gold}>
            <Text style={[T.dim, { marginBottom: 10 }]}>Sans clé, la Déesse utilise ses répliques locales. Avec une clé, elle réagit en direct, adapte tes repos et invente des scénarios. La clé reste dans le trousseau iOS.</Text>
            <Chips<AIProvider> color={C.gold} value={st.settings.aiProvider} onChange={setProvider}
              options={[['none', 'Local'], ['anthropic', 'Anthropic'], ['openai', 'OpenAI']]} />
            {st.settings.aiProvider !== 'none' && (
              <>
                <TextInput value={key} onChangeText={setKey} secureTextEntry autoCapitalize="none" autoCorrect={false}
                  placeholder={hasKey ? 'Clé enregistrée (saisir pour remplacer)' : 'Clé API'} placeholderTextColor={C.faint} style={s.input} />
                <TextInput value={st.settings.aiModel} onChangeText={(v) => st.updateSettings({ aiModel: v })} autoCapitalize="none"
                  placeholder="Modèle" placeholderTextColor={C.faint} style={[s.input, { marginTop: 8 }]} />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <SysButton small tone="gold" label="Enregistrer la clé" onPress={async () => { await saveApiKey(key.trim()); setHasKey(!!key.trim()); setKey(''); }} />
                  {hasKey && <SysButton small tone="danger" label="Effacer" onPress={async () => { await saveApiKey(''); setHasKey(false); }} />}
                </View>
              </>
            )}
          </Panel>

          <Panel title="Apple Santé">
            <Text style={[T.dim, { marginBottom: 10 }]}>{healthAvailable() ? 'Pas et sommeil synchronisés à chaque ouverture du Statut.' : 'Indisponible dans Expo Go : lance un build de développement (npx expo run:ios).'}</Text>
            <SysButton small label="Autoriser l’accès" onPress={async () => Alert.alert('Apple Santé', (await initHealth()) ? 'Accès accordé.' : 'Accès refusé ou indisponible. Vérifie Réglages iOS → Santé → Accès des données.')} />
          </Panel>

          <Panel title="Zone dangereuse" accent={C.danger}>
            <SysButton tone="danger" label="Réinitialiser le Système" onPress={() =>
              Alert.alert('Réinitialiser ?', 'Toutes tes stats, quêtes et titres seront effacés.', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Effacer', style: 'destructive', onPress: () => st.resetAll() },
              ])} />
          </Panel>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  input: { borderWidth: 1, borderColor: C.line, color: C.text, fontFamily: F.hudBody, fontSize: 16, paddingHorizontal: 10, paddingVertical: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 6 },
  stepBtn: { fontFamily: F.hudBold, fontSize: 26, color: C.neon, width: 24, textAlign: 'center' },
  chip: { borderWidth: 1, borderColor: C.line, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { fontFamily: F.hud, fontSize: 14, color: C.dim },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
});
