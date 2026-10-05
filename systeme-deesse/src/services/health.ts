/**
 * Apple Santé (HealthKit) via react-native-health.
 * ⚠ Ne fonctionne PAS dans Expo Go : il faut un build de développement (npx expo run:ios).
 */
import { Platform } from 'react-native';

type HK = typeof import('react-native-health').default;
let HealthKit: HK | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  HealthKit = Platform.OS === 'ios' ? require('react-native-health').default : null;
} catch {
  HealthKit = null;
}

let ready = false;

export const healthAvailable = () => !!HealthKit;

export function initHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!HealthKit) return resolve(false);
    const P = HealthKit.Constants.Permissions;
    HealthKit.initHealthKit({ permissions: { read: [P.StepCount, P.SleepAnalysis], write: [] } }, (err: string) => {
      ready = !err;
      resolve(ready);
    });
  });
}

export function getTodaySteps(): Promise<number | null> {
  return new Promise((resolve) => {
    if (!HealthKit || !ready) return resolve(null);
    HealthKit.getStepCount({ date: new Date().toISOString(), includeManuallyAdded: false }, (err: string, res: { value: number }) =>
      resolve(err ? null : Math.round(res?.value ?? 0)),
    );
  });
}

/**
 * Heure d'endormissement de la nuit dernière (minutes depuis minuit),
 * cherchée entre hier 18 h et aujourd'hui 12 h. Préfère les phases de sommeil à "au lit".
 */
export function getLastBedtime(): Promise<number | null> {
  return new Promise((resolve) => {
    if (!HealthKit || !ready) return resolve(null);
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 1);
    start.setHours(18, 0, 0, 0);
    HealthKit.getSleepSamples(
      { startDate: start.toISOString(), endDate: end.toISOString(), limit: 200 },
      (err: string, samples: { value: string; startDate: string }[]) => {
        if (err || !samples?.length) return resolve(null);
        const asleep = samples.filter((s) => ['ASLEEP', 'CORE', 'DEEP', 'REM'].includes(s.value));
        const pool = asleep.length ? asleep : samples.filter((s) => s.value === 'INBED');
        if (!pool.length) return resolve(null);
        const first = pool.map((s) => new Date(s.startDate)).sort((a, b) => a.getTime() - b.getTime())[0];
        resolve(first.getHours() * 60 + first.getMinutes());
      },
    );
  });
}
