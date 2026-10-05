import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/theme/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={icon} color={color} size={size - 2} />,
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.neon,
        tabBarInactiveTintColor: C.faint,
        tabBarStyle: { backgroundColor: '#040A1A', borderTopColor: C.line },
        tabBarLabelStyle: { fontFamily: F.hud, fontSize: 10 },
      }}
    >
      <Tabs.Screen name="index" options={tab('Statut', 'person-outline')} />
      <Tabs.Screen name="quetes" options={tab('Quêtes', 'flash-outline')} />
      <Tabs.Screen name="bibliotheque" options={tab('Biblio', 'book-outline')} />
      <Tabs.Screen name="entrainement" options={tab('Training', 'barbell-outline')} />
      <Tabs.Screen name="calendrier" options={tab('Planning', 'calendar-outline')} />
      <Tabs.Screen name="succes" options={tab('Titres', 'trophy-outline')} />
    </Tabs>
  );
}
