/**
 * CATALOGUE D'ENTRAÎNEMENT
 *  - 13 exercices principaux (favorite: true), toujours affichés en tête ;
 *  - exercices secondaires classés par muscle, tous utilisables dans Training et Planning.
 * Le test de Force n'utilise que 5 repères : voir LIFTS dans logic/force.ts.
 */
export type Unit = 'kg' | 'reps' | 's';
export const UNIT_LABEL: Record<Unit, string> = { kg: 'kg', reps: 'reps', s: 's' };

export type MuscleGroup = 'Pecs' | 'Épaules' | 'Dos' | 'Bras' | 'Abdos' | 'Jambes & hanches' | 'Lombaires';
export const GROUPS: MuscleGroup[] = ['Pecs', 'Épaules', 'Dos', 'Bras', 'Abdos', 'Jambes & hanches', 'Lombaires'];

interface ExerciseDef {
  id: string;
  name: string;
  unit: Unit;
  group: MuscleGroup;
  sets: number;
  /** Objectif par série : répétitions (exercices en kg) ou valeur cible (reps / secondes) */
  target: string;
  restSec: number;
  cue: string;
  /** Exercices principaux : affichés en tête de liste */
  favorite?: boolean;
}

const DEFS = [
  // ───────── EXERCICES PRINCIPAUX (les 13, toujours en tête) ─────────
  { id: 'pec_press', name: 'Pec Press (machine)', unit: 'kg', group: 'Pecs', sets: 4, target: '8–12', restSec: 120, favorite: true, cue: 'Poignées à hauteur du milieu des pecs, omoplates serrées contre le dossier, pousse sans verrouiller les coudes.' },
  { id: 'shoulder_press', name: 'Shoulder Press (machine)', unit: 'kg', group: 'Épaules', sets: 4, target: '8–12', restSec: 120, favorite: true, cue: 'Poignées à hauteur d’épaules, dos plaqué, pousse sans hausser les épaules vers les oreilles.' },
  { id: 'rowing_pulldown', name: 'Rowing Pulldown', unit: 'kg', group: 'Dos', sets: 4, target: '8–12', restSec: 120, favorite: true, cue: 'Poitrine sortie, abaisse d’abord les épaules, tire les coudes vers les hanches, zéro élan.' },
  { id: 'elevations_laterales', name: 'Élévations latérales', unit: 'kg', group: 'Épaules', sets: 4, target: '12–15', restSec: 75, favorite: true, cue: 'Coudes légèrement fléchis, monte jusqu’à l’horizontale, descente contrôlée en 2 s.' },
  { id: 'curl_biceps', name: 'Curl biceps', unit: 'kg', group: 'Bras', sets: 3, target: '8–12', restSec: 75, favorite: true, cue: 'Coudes fixes contre le corps, aucune aide du dos, serre en haut.' },
  { id: 'machine_crunch', name: 'Machine Crunch', unit: 'kg', group: 'Abdos', sets: 3, target: '10–15', restSec: 60, favorite: true, cue: 'Enroule la colonne vertèbre par vertèbre, expire en fermant, ne tire pas avec les bras.' },
  { id: 'rotation_torse', name: 'Rotation du torse / machine', unit: 'kg', group: 'Abdos', sets: 3, target: '12 / côté', restSec: 60, favorite: true, cue: 'Bassin verrouillé, rotation lente depuis le tronc, amplitude contrôlée, pas d’à-coups.' },
  { id: 'hanging_leg_raise', name: 'Relevé de jambes suspendu', unit: 'reps', group: 'Abdos', sets: 3, target: '10–15', restSec: 75, favorite: true, cue: 'Bascule le bassin en fin de mouvement, pas de balancier, redescends lentement.' },
  { id: 'hollow_body', name: 'Hollow Body / Banane', unit: 's', group: 'Abdos', sets: 3, target: '30–45 s', restSec: 45, favorite: true, cue: 'Lombaires collées au sol en permanence, bras et jambes tendus près du sol, respire court.' },
  { id: 'leg_curl', name: 'Leg Curl assis', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '10–12', restSec: 90, favorite: true, cue: 'Hanches calées au fond du siège, contracte fort en bas, freine la remontée.' },
  { id: 'hip_flexors_poulie', name: 'Renforcement Hip Flexors à la poulie', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '12 / jambe', restSec: 60, favorite: true, cue: 'Sangle à la cheville, dos à la poulie, monte le genou à hauteur de hanche sans cambrer.' },
  { id: 'extensions_lombaires', name: 'Extensions lombaires', unit: 'reps', group: 'Lombaires', sets: 3, target: '12–15', restSec: 60, favorite: true, cue: 'Banc à 45°, remonte jusqu’à l’alignement jambes-buste, jamais en hyperextension.' },
  { id: 'hip_thrust', name: 'Hip Thrust', unit: 'kg', group: 'Jambes & hanches', sets: 4, target: '8–12', restSec: 120, favorite: true, cue: 'Haut du dos sur le banc, tibias verticaux en haut, menton rentré, serre les fessiers sans cambrer.' },

  // ───────── PECS ─────────
  { id: 'dc_barre', name: 'Développé couché barre', unit: 'kg', group: 'Pecs', sets: 4, target: '6–10', restSec: 150, cue: 'Omoplates serrées, pieds ancrés, barre au bas des pecs, coudes à 45°.' },
  { id: 'dc_halteres', name: 'Développé couché haltères', unit: 'kg', group: 'Pecs', sets: 4, target: '8–12', restSec: 120, cue: 'Descends jusqu’à l’étirement, remonte en rapprochant les haltères sans les cogner.' },
  { id: 'di_halteres', name: 'Développé incliné haltères', unit: 'kg', group: 'Pecs', sets: 3, target: '8–12', restSec: 120, cue: 'Banc à 30°, coudes sous les poignets, contrôle la descente.' },
  { id: 'ecarte_poulie', name: 'Écarté à la poulie (vis-à-vis)', unit: 'kg', group: 'Pecs', sets: 3, target: '12–15', restSec: 60, cue: 'Bras légèrement fléchis et fixes, ramène les mains en arc de cercle, serre au centre.' },
  { id: 'pec_deck', name: 'Pec deck (butterfly)', unit: 'kg', group: 'Pecs', sets: 3, target: '12–15', restSec: 60, cue: 'Épaules basses, ferme lentement, tiens 1 s en contraction.' },
  { id: 'pompes', name: 'Pompes', unit: 'reps', group: 'Pecs', sets: 3, target: 'max', restSec: 75, cue: 'Corps gainé en planche, poitrine au sol, coudes à 45°.' },
  { id: 'dips', name: 'Dips', unit: 'reps', group: 'Pecs', sets: 3, target: '8–12', restSec: 90, cue: 'Buste penché vers l’avant, descends jusqu’à l’épaule au niveau du coude.' },

  // ───────── ÉPAULES ─────────
  { id: 'dm_barre', name: 'Développé militaire barre', unit: 'kg', group: 'Épaules', sets: 4, target: '6–10', restSec: 120, cue: 'Debout, fessiers et abdos serrés, la barre passe près du visage, verrouille au-dessus.' },
  { id: 'dm_halteres', name: 'Développé haltères assis', unit: 'kg', group: 'Épaules', sets: 3, target: '8–12', restSec: 90, cue: 'Dos plaqué, descends les haltères à hauteur d’oreilles, pousse en arc.' },
  { id: 'oiseau', name: 'Oiseau (deltoïde arrière)', unit: 'kg', group: 'Épaules', sets: 3, target: '12–15', restSec: 60, cue: 'Buste penché, ouvre les bras sans hausser les épaules, petits poids.' },
  { id: 'face_pull', name: 'Face pull', unit: 'kg', group: 'Épaules', sets: 3, target: '15', restSec: 60, cue: 'Corde vers le front, coudes hauts, rotation externe en fin de mouvement.' },
  { id: 'elev_frontales', name: 'Élévations frontales', unit: 'kg', group: 'Épaules', sets: 3, target: '10–12', restSec: 60, cue: 'Monte jusqu’à hauteur d’yeux, sans balancer le buste.' },
  { id: 'shrugs', name: 'Shrugs (trapèzes)', unit: 'kg', group: 'Épaules', sets: 3, target: '12–15', restSec: 60, cue: 'Monte les épaules vers les oreilles, tiens 1 s, sans rouler les épaules.' },

  // ───────── DOS ─────────
  { id: 'souleve_terre', name: 'Soulevé de terre', unit: 'kg', group: 'Dos', sets: 4, target: '4–6', restSec: 180, cue: 'Barre contre les tibias, dos neutre, pousse le sol avec les jambes, verrouille hanches et genoux ensemble.' },
  { id: 'tractions', name: 'Tractions', unit: 'reps', group: 'Dos', sets: 4, target: 'max', restSec: 120, cue: 'Départ bras tendus, poitrine vers la barre, pas d’élan.' },
  { id: 'tirage_vertical', name: 'Tirage vertical', unit: 'kg', group: 'Dos', sets: 3, target: '10–12', restSec: 90, cue: 'Abaisse les épaules, puis tire les coudes vers les hanches, barre au haut de la poitrine.' },
  { id: 'rowing_barre', name: 'Rowing barre', unit: 'kg', group: 'Dos', sets: 4, target: '6–10', restSec: 120, cue: 'Buste penché à 45°, dos plat, tire vers le nombril.' },
  { id: 'rowing_haltere', name: 'Rowing haltère unilatéral', unit: 'kg', group: 'Dos', sets: 3, target: '10 / bras', restSec: 75, cue: 'Main et genou sur le banc, tire le coude vers la hanche, sans rotation du buste.' },
  { id: 'tirage_horizontal', name: 'Tirage horizontal poulie', unit: 'kg', group: 'Dos', sets: 3, target: '10–12', restSec: 90, cue: 'Buste droit, tire la poignée vers le ventre, serre les omoplates.' },
  { id: 'pullover_poulie', name: 'Pull-over à la poulie', unit: 'kg', group: 'Dos', sets: 3, target: '12–15', restSec: 60, cue: 'Bras presque tendus, ramène la barre vers les cuisses en arc, sens le grand dorsal.' },

  // ───────── BRAS ─────────
  { id: 'curl_marteau', name: 'Curl marteau', unit: 'kg', group: 'Bras', sets: 3, target: '10–12', restSec: 60, cue: 'Prise neutre, coudes fixes, monte en contrôlant.' },
  { id: 'curl_incline', name: 'Curl incliné haltères', unit: 'kg', group: 'Bras', sets: 3, target: '10–12', restSec: 75, cue: 'Bras derrière le buste pour étirer le biceps en bas.' },
  { id: 'curl_pupitre', name: 'Curl pupitre', unit: 'kg', group: 'Bras', sets: 3, target: '10–12', restSec: 75, cue: 'Bras à plat sur le pupitre, ne verrouille pas en bas.' },
  { id: 'triceps_poulie', name: 'Extension triceps poulie', unit: 'kg', group: 'Bras', sets: 3, target: '10–15', restSec: 60, cue: 'Coudes collés au corps, tends complètement en bas.' },
  { id: 'barre_front', name: 'Barre au front', unit: 'kg', group: 'Bras', sets: 3, target: '8–12', restSec: 90, cue: 'Coudes fixes pointés vers le plafond, descends la barre vers le front.' },
  { id: 'extension_nuque', name: 'Extension nuque haltère', unit: 'kg', group: 'Bras', sets: 3, target: '10–12', restSec: 75, cue: 'Coudes serrés près de la tête, descends derrière la nuque, tends.' },
  { id: 'dips_banc', name: 'Dips sur banc', unit: 'reps', group: 'Bras', sets: 3, target: '12–15', restSec: 60, cue: 'Dos près du banc, coudes vers l’arrière, descends à 90°.' },

  // ───────── ABDOS ─────────
  { id: 'gainage', name: 'Gainage (planche)', unit: 's', group: 'Abdos', sets: 3, target: '45–60 s', restSec: 45, cue: 'Corps aligné, fessiers serrés, ne creuse pas le dos.' },
  { id: 'gainage_lateral', name: 'Gainage latéral', unit: 's', group: 'Abdos', sets: 3, target: '30 s / côté', restSec: 45, cue: 'Hanches hautes, corps en ligne droite.' },
  { id: 'crunch_sol', name: 'Crunch au sol', unit: 'reps', group: 'Abdos', sets: 3, target: '15–20', restSec: 45, cue: 'Enroule le haut du dos, bas du dos au sol, ne tire pas sur la nuque.' },
  { id: 'ab_wheel', name: 'Roue abdominale', unit: 'reps', group: 'Abdos', sets: 3, target: '8–12', restSec: 75, cue: 'Bassin rétroversé, va aussi loin que tu tiens le dos plat.' },
  { id: 'russian_twist', name: 'Russian twist', unit: 'reps', group: 'Abdos', sets: 3, target: '20', restSec: 45, cue: 'Buste incliné, rotation depuis le tronc, pieds au sol si besoin.' },
  { id: 'pallof_press', name: 'Pallof press', unit: 'kg', group: 'Abdos', sets: 3, target: '10 / côté', restSec: 45, cue: 'De profil à la poulie, pousse les mains devant toi sans laisser le tronc tourner.' },

  // ───────── JAMBES & HANCHES ─────────
  { id: 'squat', name: 'Squat barre', unit: 'kg', group: 'Jambes & hanches', sets: 4, target: '5–8', restSec: 180, cue: 'Barre sur les trapèzes, genoux dans l’axe des pieds, descends sous la parallèle dos neutre.' },
  { id: 'goblet_squat', name: 'Goblet squat', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '10–12', restSec: 90, cue: 'Haltère contre la poitrine, coudes entre les genoux en bas.' },
  { id: 'presse', name: 'Presse à cuisses', unit: 'kg', group: 'Jambes & hanches', sets: 4, target: '10–12', restSec: 120, cue: 'Bas du dos plaqué, descends jusqu’à 90°, ne verrouille pas les genoux.' },
  { id: 'fentes', name: 'Fentes haltères', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '10 / jambe', restSec: 90, cue: 'Grand pas, genou arrière frôle le sol, buste droit.' },
  { id: 'fentes_bulgares', name: 'Fentes bulgares', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '8–10 / jambe', restSec: 90, cue: 'Pied arrière sur le banc, descends à la verticale, genou avant stable.' },
  { id: 'sdt_roumain', name: 'Soulevé de terre roumain', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '8–10', restSec: 120, cue: 'Genoux légèrement fléchis, hanches vers l’arrière, barre le long des cuisses, dos plat.' },
  { id: 'leg_extension', name: 'Leg extension', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '12–15', restSec: 60, cue: 'Tends complètement, tiens 1 s, freine la descente.' },
  { id: 'abduction', name: 'Abduction hanche (machine)', unit: 'kg', group: 'Jambes & hanches', sets: 3, target: '15', restSec: 60, cue: 'Buste légèrement penché vers l’avant, ouvre sans à-coups.' },
  { id: 'mollets', name: 'Mollets debout', unit: 'kg', group: 'Jambes & hanches', sets: 4, target: '12–15', restSec: 60, cue: 'Étirement complet en bas, monte sur la pointe, tiens 1 s.' },

  // ───────── LOMBAIRES ─────────
  { id: 'good_morning', name: 'Good morning', unit: 'kg', group: 'Lombaires', sets: 3, target: '10–12', restSec: 90, cue: 'Barre légère, hanches vers l’arrière, dos neutre, arrête-toi à l’horizontale.' },
  { id: 'superman', name: 'Superman', unit: 's', group: 'Lombaires', sets: 3, target: '20–30 s', restSec: 45, cue: 'Allongé sur le ventre, bras et jambes décollés, regard vers le sol.' },
  { id: 'bird_dog', name: 'Bird dog', unit: 'reps', group: 'Lombaires', sets: 3, target: '10 / côté', restSec: 45, cue: 'À quatre pattes, bras et jambe opposés tendus, bassin immobile.' },
] as const satisfies readonly ExerciseDef[];

export type ExerciseId = (typeof DEFS)[number]['id'];
export type Exercise = Omit<ExerciseDef, 'id'> & { id: ExerciseId };

/** Catalogue complet : les 13 principaux d'abord, puis les secondaires groupés par muscle. */
export const EXERCISES: Exercise[] = DEFS as unknown as Exercise[];
export const FAVORITES: Exercise[] = EXERCISES.filter((e) => e.favorite);

export const exerciseById = (id: ExerciseId): Exercise => EXERCISES.find((e) => e.id === id) ?? EXERCISES[0];

/** Filtre commun à Training et Planning : "Principaux", "Tout" ou un groupe, plus une recherche texte. */
export type ExerciseFilter = 'Principaux' | 'Tout' | MuscleGroup;
export const FILTERS: ExerciseFilter[] = ['Principaux', 'Tout', ...GROUPS];

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function filterExercises(filter: ExerciseFilter, query = ''): Exercise[] {
  const q = norm(query.trim());
  const base = filter === 'Principaux' ? FAVORITES : filter === 'Tout' ? EXERCISES : EXERCISES.filter((e) => e.group === filter);
  const found = q ? base.filter((e) => norm(e.name).includes(q)) : base;
  // Principaux toujours en tête
  return [...found.filter((e) => e.favorite), ...found.filter((e) => !e.favorite)];
}

/** Routine quotidienne d'étirements légers (quête Agilité). */
export const STRETCH_ROUTINE = [
  { name: 'Chat-vache', duration: '45 s' },
  { name: 'Fente basse avec rotation', duration: '30 s / côté' },
  { name: 'Pince assise jambes tendues', duration: '45 s' },
  { name: 'Pigeon', duration: '45 s / côté' },
  { name: 'Ouverture thoracique allongé sur le côté', duration: '30 s / côté' },
  { name: 'Squat profond tenu', duration: '45 s' },
];

/** Routine de décompression : 6 séances de 30 s par jour. */
export const DECOMPRESSION_TIPS = [
  'Suspension passive à une barre : bras tendus, épaules relâchées, laisse peser les jambes.',
  'Si la prise lâche avant 30 s, garde la pointe des pieds au sol pour décharger.',
  'Alternative au sol : allongé sur le dos, genoux ramenés à la poitrine, bascule douce.',
  'Arrête immédiatement en cas de douleur vive ou de fourmillements.',
];

/** Test initial d'Agilité : chaque item noté 0 (impossible) à 3 (facile et propre). */
export const AGILITY_TEST = [
  { id: 'a1', name: 'Toucher ses orteils, jambes tendues', levels: ['Genoux ou plus haut', 'Tibias', 'Chevilles', 'Paumes au sol'] },
  { id: 'a2', name: 'Squat profond, talons au sol, 30 s', levels: ['Impossible', 'Talons décollés', 'Tenu avec effort', 'Confortable'] },
  { id: 'a3', name: 'Mains jointes dans le dos (une par-dessus l’épaule)', levels: ['Écart > 15 cm', '5–15 cm', 'Les doigts se touchent', 'Les mains se croisent'] },
  { id: 'a4', name: 'Fente basse, genou arrière au sol, buste droit', levels: ['Douloureux', 'Tension forte', 'Tenu', 'Facile'] },
  { id: 'a5', name: 'Bras tendus au-dessus de la tête, dos au mur', levels: ['Bras loin du mur', 'Mur touché en cambrant', 'Mur touché dos plat, effort', 'Facile, dos plat'] },
  { id: 'a6', name: 'Équilibre sur un pied, yeux fermés', levels: ['< 5 s', '5–15 s', '15–30 s', '> 30 s'] },
];
