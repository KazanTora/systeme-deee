import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feedback } from '@/audio/feedback';
import { useSystem } from '@/store/useSystem';
import { Screen, Panel, T } from '@/components/Hud';
import { TITLES, Rarity, RARITY_COLORS } from '@/data/titles';
import { C, F, glow } from '@/theme/tokens';

const RARITIES: Rarity[] = ['Bronze', 'Argent', 'Or', 'Platine'];

export default function TitlesScreen() {
  const titles = useSystem((s) => s.titles);
  const equip = useSystem((s) => s.equipTitle);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={T.h1}>Succès & titres</Text>
          <Text style={[T.dim, { marginBottom: 14 }]}>{titles.unlocked.length} / {TITLES.length} débloqués · touche un titre pour l’équiper</Text>
          {RARITIES.map((r) => (
            <Panel key={r} title={r} accent={RARITY_COLORS[r]}>
              {TITLES.filter((t) => t.rarity === r).map((t) => {
                const unlocked = titles.unlocked.includes(t.id);
                const equipped = titles.equipped === t.id;
                return (
                  <Pressable key={t.id} disabled={!unlocked}
                    onPress={() => { feedback.tap(); equip(t.id); }}
                    style={[s.row, equipped && { borderColor: RARITY_COLORS[r] }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.name, { color: unlocked ? RARITY_COLORS[r] : C.faint }, unlocked && glow(RARITY_COLORS[r], 4)]}>
                        {unlocked ? t.name : '???'}
                      </Text>
                      <Text style={T.dim}>{t.hint}</Text>
                    </View>
                    {equipped && <Text style={[s.badge, { color: RARITY_COLORS[r] }]}>Équipé</Text>}
                  </Pressable>
                );
              })}
            </Panel>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'transparent', padding: 10, marginBottom: 4 },
  name: { fontFamily: F.hudBold, fontSize: 18 },
  badge: { fontFamily: F.hudBold, fontSize: 13, letterSpacing: 1 },
});
