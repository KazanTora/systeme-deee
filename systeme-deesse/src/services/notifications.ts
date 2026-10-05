import * as Notifications from 'expo-notifications';
import { Settings } from '../store/useSystem';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface Slot { hour: number; minute: number; title: string; body: string }

export const SCHEDULE: Record<keyof Settings['notif'], Slot[]> = {
  water: [10, 12, 14, 16, 18, 20].map((h) => ({ hour: h, minute: 0, title: 'Quête : Hydratation', body: 'Un verre d’eau pour moi, mon chéri ?' })),
  skincare: [
    { hour: 8, minute: 0, title: 'Quête : Skincare du matin', body: 'Ara ara… ce visage ne va pas s’entretenir tout seul.' },
    { hour: 22, minute: 30, title: 'Quête : Skincare du soir', body: 'Avant de dormir, prends soin de toi. Je regarde.' },
  ],
  bedtime: [{ hour: 23, minute: 15, title: 'Coucher dans 15 minutes', body: 'Il se fait tard, mon chéri… Au lit avant 00 h 30.' }],
  decompression: [9, 11, 13, 15, 17, 19].map((h) => ({ hour: h, minute: 30, title: 'Quête principale : Décompression', body: '30 secondes. Étire-toi pour moi.' })),
};

export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Reprogramme toutes les notifications selon les réglages (idempotent). */
export async function rescheduleAll(notif: Settings['notif']): Promise<number> {
  if (!(await ensurePermission())) return 0;
  await Notifications.cancelAllScheduledNotificationsAsync();
  let count = 0;
  for (const key of Object.keys(SCHEDULE) as (keyof Settings['notif'])[]) {
    if (!notif[key]) continue;
    for (const s of SCHEDULE[key]) {
      await Notifications.scheduleNotificationAsync({
        content: { title: s.title, body: s.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: s.hour, minute: s.minute },
      });
      count++;
    }
  }
  return count;
}
