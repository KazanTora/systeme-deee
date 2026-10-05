import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Rajdhani_500Medium, Rajdhani_600SemiBold, Rajdhani_700Bold } from '@expo-google-fonts/rajdhani';
import { CormorantGaramond_500Medium_Italic, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { useSystem } from '@/store/useSystem';
import { rescheduleAll } from '@/services/notifications';
import { SystemFeedback } from '@/components/SystemFeedback';
import { C } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Rajdhani_500Medium, Rajdhani_600SemiBold, Rajdhani_700Bold,
    CormorantGaramond_500Medium_Italic, CormorantGaramond_700Bold,
  });
  const [hydrated, setHydrated] = useState(useSystem.persist.hasHydrated());
  useEffect(() => useSystem.persist.onFinishHydration(() => setHydrated(true)), []);

  const onboarded = useSystem((s) => s.onboarded);
  const segments = useSegments();
  const router = useRouter();
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {});
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboarded && !inOnboarding) router.replace('/onboarding');
    else if (onboarded && inOnboarding) router.replace('/');
  }, [ready, onboarded, segments]);

  useEffect(() => {
    if (ready && onboarded) rescheduleAll(useSystem.getState().settings.notif).catch(() => {});
  }, [ready, onboarded]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <SystemFeedback />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.abyss } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="stat/[key]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="taille" />
        <Stack.Screen name="parametres" />
        <Stack.Screen name="test-force" />
      </Stack>
    </>
  );
}
