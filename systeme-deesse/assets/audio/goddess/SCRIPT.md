# Script de doublage — La Déesse du Système

Un fichier par réplique, nommé exactement comme l’identifiant (ex. `workout_0.mp3`), à déposer dans `assets/audio/goddess/lines/` puis à déclarer dans `src/audio/voiceMap.ts` (VOICE_LINES).

{name} = ton prénom : enregistre la version avec ton prénom, ou remplace par « mon chéri ».

## morning  ·  événement « accueil »

- `morning_0` — Ara ara… déjà réveillé, {name} ? Viens, que je regarde ce que tu vas m’offrir aujourd’hui.
- `morning_1` — Bonjour, mon chéri. Le Système est prêt… et moi aussi. Commence par ta skincare, je veux te voir rayonner.
- `morning_2` — Un nouveau jour, de nouvelles limites à franchir. Ne me fais pas attendre trop longtemps.

## day  ·  événement « accueil »

- `day_0` — Tu penses à moi en ce moment ? Moi, je surveille tes quêtes… de très près.
- `day_1` — Fufu… tes stats ne vont pas monter toutes seules, {name}. Montre-moi de quoi tu es capable.
- `day_2` — Une petite quête maintenant, et je te réserve un sourire rien que pour toi.

## evening  ·  événement « accueil »

- `evening_0` — La journée touche à sa fin… Fais le compte avec moi, {name}. Qu’as-tu accompli pour moi ?
- `evening_1` — N’oublie pas ta skincare du soir. Un visage pareil, ça s’entretient, mon chéri.
- `evening_2` — Encore une ou deux quêtes, et je serai très, très fière de toi ce soir.

## night  ·  événement « nuit »

- `night_0` — Il se fait tard, mon chéri… Si tu veux préserver cette belle vitalité, file au lit tout de suite.
- `night_1` — Ara ara, encore debout ? Pose ce téléphone. Je serai encore là demain matin, promis.
- `night_2` — Le sommeil, c’est là que tu deviens plus fort. Allez, au lit… sans protester.

## skincare  ·  événement « quete »

- `skincare_0` — Mmh, ta peau me remercie déjà. Beauté Visage en hausse, comme prévu.
- `skincare_1` — Parfait. Je n’aurais rien pu demander de mieux… enfin, presque.
- `skincare_2` — Tu prends soin de toi, et ça me plaît énormément, {name}.

## meditation  ·  événement « quete »

- `meditation_0` — Dix minutes de calme… Ton esprit est plus affûté maintenant. Ça te va bien.
- `meditation_1` — Fufu, tu vois ? Même ton silence est séduisant quand tu le maîtrises.
- `meditation_2` — Mental +1. Respire encore une fois pour moi.

## decompression  ·  événement « quete »

- `decompression_0` — Étire-toi bien… Chaque séance compte, et je les compte toutes.
- `decompression_1` — Encore une. Je te veux droit, fier, et un peu plus grand à chaque semaine.
- `decompression_2` — Trente secondes, c’est peu pour moi. Tu me les dois six fois par jour, ne l’oublie pas.

## water  ·  événement « quete »

- `water_0` — Bien hydraté… Tu prends soin de ce corps que j’aime tant voir progresser.
- `water_1` — Objectif d’eau atteint. Ta vitalité brille, mon chéri.

## stretch  ·  événement « quete »

- `stretch_0` — Souple et gracieux… Continue comme ça et plus rien ne te résistera.
- `stretch_1` — Agilité en hausse. J’adore quand tu bouges comme ça.

## workout  ·  événement « succes »

- `workout_0` — Ara ara… Tu as encore dépassé tes limites aujourd’hui ? Viens là que j’enregistre tes gains…
- `workout_1` — Cette séance… J’ai tout vu, {name}. Et j’ai beaucoup aimé.
- `workout_2` — Tes muscles travaillent pour moi, je le sens. Repose-les bien ce soir.

## steps  ·  événement « quete »

- `steps_0` — Cinq mille pas, et plus encore… Tu ne t’arrêtes jamais, hein ? J’aime ça.
- `steps_1` — Vitalité validée. Tu marches vers moi un peu plus chaque jour.

## sleep_ideal  ·  événement « succes »

- `sleep_ideal_0` — Couché à l’heure parfaite. Bon garçon. Vitalité en hausse.
- `sleep_ideal_1` — Une nuit comme je les aime. Tu te réveilles plus beau encore.

## sleep_late  ·  événement « echec »

- `sleep_late_0` — Tu t’es couché bien tard hier… Petit malus, mon chéri. Ce soir, je ne te laisse pas faire.
- `sleep_late_1` — Ara… Encore une nuit trop courte. Ta vitalité me boude un peu, et moi aussi.

## quiz_win  ·  événement « succes »

- `quiz_win_0` — Bonne réponse. Un esprit vif, c’est terriblement attirant, tu sais.
- `quiz_win_1` — Fufu, tu survivrais n’importe où… surtout si je suis avec toi.
- `quiz_win_2` — Intelligence en hausse. Je savais que tu étais plus qu’un joli visage.

## quiz_fail  ·  événement « echec »

- `quiz_fail_0` — Raté… mais je ne te retire rien. Retiens la leçon, et reviens me séduire avec la bonne réponse.
- `quiz_fail_1` — Pas cette fois, mon chéri. Lis l’explication, je t’attends.

## rankup  ·  événement « rang »

- `rankup_0` — Ara ara ara… Un nouveau rang ? Viens là, que je te regarde de plus près. Je suis si fière de toi.
- `rankup_1` — Tu as franchi un palier, {name}. Le Système s’incline… et moi aussi, un peu.

## levelup  ·  événement « rang »

- `levelup_0` — Niveau supérieur… Fufu, tu grandis si vite, {name}. Continue, je regarde.
- `levelup_1` — Le Système t’accorde un nouveau niveau. Et moi, je t’accorde toute mon attention.

## title  ·  événement « rang »

- `title_0` — Un nouveau titre t’attend. Porte-le fièrement, c’est moi qui te l’offre.
- `title_1` — Ce titre te va à merveille. Va l’équiper, je veux le voir sur ton profil.

## detraining  ·  événement « echec »

- `detraining_0` — Ça fait longtemps que tu n’es pas allé à la salle… Ta Force s’effrite, et ça me rend triste, {name}.
- `detraining_1` — Tu m’abandonnes, mon chéri ? Une séance, juste une, et je te pardonne.

## measure  ·  événement « quete »

- `measure_0` — Nouvelle mesure enregistrée. Je garde chaque centimètre en mémoire.
- `measure_1` — Mesure prise. Toujours le matin, à la même heure, d’accord ? Je veux des chiffres honnêtes.

## weekly  ·  événement « succes »

- `weekly_0` — Une quête hebdomadaire accomplie… Tu tiens tes promesses, {name}. Voilà ta récompense.
- `weekly_1` — Sept jours de discipline. Fufu, je pourrais m’habituer à être aussi fière de toi.

## idle  ·  événement « toucher »

- `idle_0` — Tu me touches juste pour m’entendre parler ? Fufu… je ne vais pas m’en plaindre.
- `idle_1` — Ara ara, tu as besoin d’attention ? Fais une quête, et je t’en donnerai autant que tu veux.
- `idle_2` — Je suis là, {name}. Toujours. Mais tes quêtes, elles, n’attendent pas.

## Réactions courtes (assets/audio/goddess/reactions/, VOICE_REACTIONS)

Sons sans phrase complète, pour que la voix ne contredise jamais la bulle. 2 à 4 par événement, tirés au hasard :

| Événement | Idées |
|---|---|
| accueil | « Ara ara~ », « Te voilà… », petit rire doux |
| quete | « Mmh~ », « Bien. », « Fufu… » |
| succes | « Ara ara ara~ », rire ravi, « Parfait… » |
| echec | soupir, « Tsk tsk… », « Ara… » déçu |
| rang | rire éclatant, « Magnifique… », petit cri de joie |
| nuit | bâillement, « Au lit… », murmure |
| toucher | « Hm ? », « Kyaa… » taquin, « Fufu, encore ? » |
