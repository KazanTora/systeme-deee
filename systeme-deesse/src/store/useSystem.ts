import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lifts, isBenchmark } from '../logic/force';
import { computeStats, evaluateBedtime, REWARDS, START_POINTS, StoredStat, agilityInitialPoints } from '../logic/stats';
import { EXP, levelFromExp } from '../logic/exp';
import { rankIndex } from '../logic/ranks';
import { DECOMPRESSION_PER_DAY, theoreticalGainMm } from '../logic/height';
import { TITLES, Counters } from '../data/titles';
import { DialogueKind } from '../data/dialogues';
import { ExerciseId } from '../data/exercises';

export const dayKey = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export interface DayLog {
  skincareAM: boolean;
  skincarePM: boolean;
  meditations: number;
  decompression: number;
  water: number;
  waterRewarded: boolean;
  stretch: boolean;
  steps: number;
  stepsRewarded: boolean;
  steps10kRewarded: boolean;
  /** Heure de coucher de la nuit qui PRÉCÈDE ce jour, en minutes depuis minuit */
  bedtime: number | null;
  workout: boolean;
  library: number;
}

export const emptyDay = (): DayLog => ({
  skincareAM: false, skincarePM: false, meditations: 0, decompression: 0, water: 0,
  waterRewarded: false, stretch: false, steps: 0, stepsRewarded: false, steps10kRewarded: false,
  bedtime: null, workout: false, library: 0,
});

/** Une série : valeur dans l'unité de l'exercice (kg, reps ou secondes) + répétitions pour les exercices en kg. */
export interface SetLog { value: number; reps?: number }
export interface WorkoutEntry { id: ExerciseId; sets: SetLog[] }
export interface WorkoutSession { date: string; entries: WorkoutEntry[] }

export type AIProvider = 'none' | 'anthropic' | 'openai';

export interface Settings {
  graceDays: number;
  waterGoal: number;
  aiProvider: AIProvider;
  aiModel: string;
  notif: { water: boolean; skincare: boolean; bedtime: boolean; decompression: boolean };
  /** Voix de la Déesse : fichiers audio de doublage (assets/audio/goddess) */
  voice: { muted: boolean; volume: number };
  /** Bruitages Système (assets/audio/sfx) */
  sfx: { enabled: boolean; volume: number };
  haptics: boolean;
}

export interface SystemEvent { kind: DialogueKind; at: number }

interface Data {
  onboarded: boolean;
  name: string;
  createdAt: string;
  /** Charges des exercices repères du test de force */
  lifts: Lifts;
  /** Le jeu d'exercices repères a changé : nouveau test de force demandé */
  forceRetest: boolean;
  forceAdjust: number;
  lastSessionAt: string | null;
  /** Meilleure valeur par exercice du catalogue (kg, reps ou s) */
  records: Partial<Record<ExerciseId, number>>;
  /** Séances planifiées par jour (Planning) */
  plans: Record<string, ExerciseId[]>;
  /** Séance en cours (Training), conservée si l'app est fermée */
  draft: WorkoutEntry[];
  history: WorkoutSession[];
  points: Record<StoredStat, number>;
  exp: number;
  days: Record<string, DayLog>;
  height: { startCm: number; targetCm: number; startDate: string; measures: { date: string; cm: number }[] };
  titles: { unlocked: string[]; equipped: string };
  counters: Counters;
  /** Anti-farm : un item de Bibliothèque ne rapporte qu'une fois par jour ; un cours, une seule fois. */
  libraryLog: Record<string, string>;
  coursesRead: string[];
  /** Quêtes hebdo déjà réclamées, clé "idQuête@lundiDeLaSemaine" */
  weeklyClaims: string[];
  settings: Settings;
  event: SystemEvent | null;
}

interface Actions {
  completeOnboarding(p: { name: string; lifts: Lifts; agilityScores: number[]; heightCm: number }): void;
  completeForceTest(lifts: Lifts): void;
  logSkincare(slot: 'AM' | 'PM'): boolean;
  logMeditation(): void;
  logDecompression(): boolean;
  logWater(): void;
  logStretch(): boolean;
  setDraft(entries: WorkoutEntry[]): void;
  logWorkout(entries: WorkoutEntry[]): void;
  setPlan(date: string, ids: ExerciseId[]): void;
  answerLibrary(kind: 'quiz' | 'cours' | 'scenario', success: boolean, itemId?: string): boolean;
  claimWeekly(claimKey: string, exp: number): void;
  applySteps(steps: number, date?: string): void;
  applyBedtime(minutes: number, date?: string): void;
  addHeightMeasure(cm: number): void;
  equipTitle(id: string): void;
  updateSettings(s: Partial<Settings>): void;
  updateVoice(v: Partial<Settings['voice']>): void;
  updateSfx(v: Partial<Settings['sfx']>): void;
  setName(name: string): void;
  resetAll(): void;
}

export type SystemState = Data & Actions;

const defaultSettings = (): Settings => ({
  graceDays: 14,
  waterGoal: 8,
  aiProvider: 'none',
  aiModel: '',
  notif: { water: true, skincare: true, bedtime: true, decompression: true },
  voice: { muted: false, volume: 1 },
  sfx: { enabled: true, volume: 0.7 },
  haptics: true,
});

const initialData = (): Data => ({
  onboarded: false,
  name: '',
  createdAt: new Date().toISOString(),
  lifts: {},
  forceRetest: false,
  forceAdjust: 0,
  lastSessionAt: null,
  records: {},
  plans: {},
  draft: [],
  history: [],
  points: { ...START_POINTS },
  exp: 0,
  days: {},
  height: { startCm: 0, targetCm: 180, startDate: new Date().toISOString(), measures: [] },
  titles: { unlocked: ['debutant'], equipped: 'debutant' },
  counters: { workouts: 0, meditations: 0, skincare: 0, quizCorrect: 0, scenariosWon: 0, decompression: 0, stepsDays: 0, idealSleeps: 0, stretches: 0 },
  libraryLog: {},
  coursesRead: [],
  weeklyClaims: [],
  settings: defaultSettings(),
  event: null,
});

const DATA_KEYS = Object.keys(initialData()) as (keyof Data)[];
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const pickData = (s: Data): Data => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])) as unknown as Data;

export const statsOf = (s: Data) =>
  computeStats({ lifts: s.lifts, forceAdjust: s.forceAdjust, lastSessionAt: s.lastSessionAt, graceDays: s.settings.graceDays, points: s.points });

export const decompressionLog = (s: Data) =>
  Object.fromEntries(Object.entries(s.days).map(([k, d]) => [k, d.decompression]));

const HISTORY_MAX = 300;

export const useSystem = create<SystemState>()(
  persist(
    (set, get) => {
      /**
       * Applique une mutation sur une copie des données, puis :
       *  - détecte un passage de rang global (dialogue "rankup") ;
       *  - débloque les titres atteints (dialogue "title").
       */
      const mutate = (fn: (d: Data) => DialogueKind | void) => {
        const before = get();
        const d = clone(pickData(before));
        const rankBefore = statsOf(before).overallRank;
        const levelBefore = levelFromExp(before.exp).level;
        let kind = fn(d) ?? null;

        const stats = statsOf(d);
        // Priorité des célébrations : rang > niveau > titre
        if (rankIndex(stats.overallRank) > rankIndex(rankBefore)) kind = 'rankup';
        else if (levelFromExp(d.exp).level > levelBefore) kind = 'levelup';

        const ctx = {
          counters: d.counters,
          level: levelFromExp(d.exp).level,
          overallRank: stats.overallRank,
          heightGainMm: theoreticalGainMm(decompressionLog(d)),
        };
        const fresh = TITLES.filter((t) => !d.titles.unlocked.includes(t.id) && t.check(ctx));
        if (fresh.length) {
          d.titles.unlocked.push(...fresh.map((t) => t.id));
          if (kind !== 'rankup' && kind !== 'levelup') kind = 'title';
        }
        if (kind) d.event = { kind, at: Date.now() };
        set(d);
      };

      const today = (d: Data, key = dayKey()) => (d.days[key] ??= emptyDay());

      return {
        ...initialData(),

        completeOnboarding: ({ name, lifts, agilityScores, heightCm }) =>
          mutate((d) => {
            const now = new Date().toISOString();
            d.onboarded = true;
            d.name = name.trim();
            d.createdAt = now;
            d.lifts = lifts;
            d.records = { ...d.records, ...lifts };
            d.forceRetest = false;
            d.lastSessionAt = now; // le délai de grâce démarre à l'éveil du Système
            d.points.agilite = Math.max(START_POINTS.agilite, agilityInitialPoints(agilityScores));
            d.height.startCm = heightCm;
            d.height.startDate = now;
            d.height.measures = [{ date: now, cm: heightCm }];
            return 'morning';
          }),

        completeForceTest: (lifts) =>
          mutate((d) => {
            d.lifts = lifts;
            d.forceAdjust = 0;
            d.forceRetest = false;
            for (const [id, v] of Object.entries(lifts) as [ExerciseId, number][]) {
              d.records[id] = Math.max(d.records[id] ?? 0, v);
            }
            return 'workout';
          }),

        logSkincare: (slot) => {
          const day = get().days[dayKey()] ?? emptyDay();
          if (slot === 'AM' ? day.skincareAM : day.skincarePM) return false;
          mutate((d) => {
            const t = today(d);
            if (slot === 'AM') t.skincareAM = true; else t.skincarePM = true;
            d.points.beauteVisage += REWARDS.skincare;
            d.exp += EXP.skincare;
            d.counters.skincare++;
            return 'skincare';
          });
          return true;
        },

        logMeditation: () =>
          mutate((d) => {
            today(d).meditations++;
            d.points.mental += REWARDS.meditation10;
            d.exp += EXP.meditation;
            d.counters.meditations++;
            return 'meditation';
          }),

        logDecompression: () => {
          const day = get().days[dayKey()] ?? emptyDay();
          if (day.decompression >= DECOMPRESSION_PER_DAY) return false;
          mutate((d) => {
            today(d).decompression++;
            d.exp += EXP.decompression;
            d.counters.decompression++;
            return 'decompression';
          });
          return true;
        },

        logWater: () =>
          mutate((d) => {
            const t = today(d);
            t.water++;
            if (!t.waterRewarded && t.water >= d.settings.waterGoal) {
              t.waterRewarded = true;
              d.points.vitalite += REWARDS.water;
              d.exp += EXP.water;
              return 'water';
            }
          }),

        logStretch: () => {
          if ((get().days[dayKey()] ?? emptyDay()).stretch) return false;
          mutate((d) => {
            today(d).stretch = true;
            d.points.agilite += REWARDS.stretch;
            d.exp += EXP.stretch;
            d.counters.stretches++;
            return 'stretch';
          });
          return true;
        },

        setDraft: (entries) => set({ draft: entries }),

        logWorkout: (entries) =>
          mutate((d) => {
            const done = entries.filter((e) => e.sets.length > 0);
            if (!done.length) return;
            // Encaisse la pénalité de désentraînement accumulée, puis relance le compteur.
            d.forceAdjust -= statsOf(d).detraining;
            d.lastSessionAt = new Date().toISOString();

            let newBenchmarkRecord = false;
            for (const e of done) {
              const best = Math.max(...e.sets.map((s) => s.value));
              d.records[e.id] = Math.max(d.records[e.id] ?? 0, best);
              if (isBenchmark(e.id) && best > (d.lifts[e.id] ?? 0)) {
                d.lifts[e.id] = best;
                newBenchmarkRecord = true;
              }
            }
            if (newBenchmarkRecord) d.forceAdjust = 0;

            d.history.push({ date: d.lastSessionAt, entries: done });
            if (d.history.length > HISTORY_MAX) d.history = d.history.slice(-HISTORY_MAX);
            d.draft = [];
            today(d).workout = true;
            d.exp += EXP.workout;
            d.counters.workouts++;
            return 'workout';
          }),

        setPlan: (date, ids) =>
          set((s) => {
            const plans = { ...s.plans };
            if (ids.length) plans[date] = ids; else delete plans[date];
            return { plans };
          }),

        answerLibrary: (kind, success, itemId) => {
          const st = get();
          const key = dayKey();
          const already = itemId
            ? kind === 'cours' ? st.coursesRead.includes(itemId) : st.libraryLog[itemId] === key
            : false;
          const rewarded = success && !already;
          mutate((d) => {
            today(d).library++;
            if (!success) return 'quiz_fail'; // 0 gain, aucune pénalité
            if (itemId) {
              if (kind === 'cours') { if (!d.coursesRead.includes(itemId)) d.coursesRead.push(itemId); }
              else d.libraryLog[itemId] = key;
            }
            if (rewarded) {
              if (kind === 'quiz') { d.points.intelligence += REWARDS.quiz; d.exp += EXP.quiz; d.counters.quizCorrect++; }
              if (kind === 'cours') { d.points.intelligence += REWARDS.cours; d.exp += EXP.cours; }
              if (kind === 'scenario') { d.points.intelligence += REWARDS.scenario; d.exp += EXP.scenario; d.counters.scenariosWon++; }
            }
            return 'quiz_win';
          });
          return rewarded;
        },

        claimWeekly: (claimKey, exp) => {
          if (get().weeklyClaims.includes(claimKey)) return;
          mutate((d) => {
            d.weeklyClaims.push(claimKey);
            d.exp += exp;
            return 'weekly';
          });
        },

        applySteps: (steps, date = dayKey()) =>
          mutate((d) => {
            const t = today(d, date);
            t.steps = Math.max(t.steps, steps);
            let kind: DialogueKind | undefined;
            if (!t.stepsRewarded && t.steps >= 5000) {
              t.stepsRewarded = true;
              d.points.vitalite += REWARDS.steps5k;
              d.exp += EXP.steps;
              d.counters.stepsDays++;
              kind = 'steps';
            }
            if (!t.steps10kRewarded && t.steps >= 10000) {
              t.steps10kRewarded = true;
              d.points.vitalite += REWARDS.steps10kBonus;
            }
            return kind;
          }),

        applyBedtime: (minutes, date = dayKey()) => {
          if ((get().days[date] ?? emptyDay()).bedtime !== null) return; // une seule évaluation par nuit
          mutate((d) => {
            const t = today(d, date);
            t.bedtime = minutes;
            const { delta, verdict } = evaluateBedtime(minutes);
            d.points.vitalite += delta;
            if (delta > 0) d.exp += EXP.sleep;
            if (verdict === 'ideal') d.counters.idealSleeps++;
            return verdict === 'late' ? 'sleep_late' : 'sleep_ideal';
          });
        },

        addHeightMeasure: (cm) =>
          mutate((d) => {
            d.height.measures.push({ date: new Date().toISOString(), cm });
            d.exp += EXP.measure;
            return 'measure';
          }),

        equipTitle: (id) => set((s) => (s.titles.unlocked.includes(id) ? { titles: { ...s.titles, equipped: id } } : s)),
        updateSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
        updateVoice: (v) => set((s) => ({ settings: { ...s.settings, voice: { ...s.settings.voice, ...v } } })),
        updateSfx: (v) => set((s) => ({ settings: { ...s.settings, sfx: { ...s.settings.sfx, ...v } } })),
        setName: (name) => set({ name }),
        resetAll: () => set(initialData()),
      };
    },
    {
      name: 'systeme-deesse-v1',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        const { event, ...rest } = pickData(s);
        return rest as Partial<SystemState>;
      },
      /** v1 → v2 : nouveaux exercices repères. Le rowing est conservé, le reste passe par un nouveau test. */
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Record<string, any>;
        if (version < 2) {
          const old = (p.lifts ?? {}) as Record<string, number>;
          p.lifts = old.rowing ? { rowing_pulldown: old.rowing } : {};
          p.records = {
            ...(old.rowing ? { rowing_pulldown: old.rowing } : {}),
            ...(old.elevations_laterales ? { elevations_laterales: old.elevations_laterales } : {}),
          };
          p.forceAdjust = 0;
          p.forceRetest = !!p.onboarded;
        }
        return p as SystemState;
      },
      /** Fusion profonde des réglages : les nouveaux réglages (voix…) gardent leurs valeurs par défaut. */
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Data>;
        return {
          ...current,
          ...p,
          settings: {
            ...current.settings,
            ...(p.settings ?? {}),
            notif: { ...current.settings.notif, ...(p.settings?.notif ?? {}) },
            voice: { ...current.settings.voice, ...(p.settings?.voice ?? {}) },
            sfx: { ...current.settings.sfx, ...(p.settings?.sfx ?? {}) },
          },
        };
      },
    },
  ),
);
