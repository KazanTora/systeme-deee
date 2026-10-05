# Bible des poses — La Déesse du Système

À placer dans le projet : `systeme-deesse/ref2d/POSES.md`.
Ce fichier définit **tout ce que la Déesse peut faire** dans l'app : poses, gestes, expressions, accessoires, et quel événement déclenche quoi.

---

## 1. Les quatre niveaux d'animation

| Niveau | Ce que c'est | Comment c'est produit |
|---|---|---|
| **Pose** | Une illustration complète du corps dans une attitude (comme un costume dans NIKKE) | Image générée dans ComfyUI, puis découpée en pièces et animée |
| **Geste** | Un mouvement *dans* une pose : hochement, rire, rebond, inclinaison, clin d'œil | Animation codée sur les pièces de la pose, aucune image en plus |
| **Expression** | Un jeu de visage (yeux, sourcils, bouche, rougeurs) | Inpainting du visage, **partagé par toutes les poses** |
| **Accessoire / effet** | Bandeau, lunettes, pompons, particules, éclat de lumière… | Tenu en main : présent dans l'illustration de la pose. Posé (bandeau, lunettes) : pièce ajoutée par inpainting. Effets : codés |

**Règle** : les grands mouvements (lever les deux bras, s'asseoir, applaudir) demandent une **pose**. En 2D découpée, on ne peut pas bouger un membre très loin de sa position d'origine sans que ça se voie. Les petits mouvements sont des **gestes**.

Passage d'une pose à l'autre : fondu rapide avec un éclat doré, comme un changement d'illustration dans NIKKE.

---

## 2. Qui fait quoi

1. **Pose principale P01** : générée et choisie à la main (c'est elle qui fixe le visage, la tenue et le style). Rien d'autre ne démarre avant sa validation.
2. **Toutes les autres poses** : Claude Code les génère lui-même via l'API de ComfyUI :
   - même checkpoint et mêmes LoRA ;
   - IPAdapter branché sur P01, pour garder le visage et la tenue ;
   - ControlNet OpenPose, pour imposer la pose ;
   - 4 à 6 propositions par pose. **L'humain choisit**, Claude Code ne valide jamais seul.
3. **Expressions** : automatiques (inpainting), une seule fois, réutilisées sur toutes les poses.
4. **Découpage et animation** : automatiques pour chaque pose validée, avec un point d'étape pour chaque pose.

---

## 3. Contraintes communes à toutes les poses

- Même personnage : `gaia, mature female, laurel crown, blonde hair, long hair, wavy hair, yellow eyes, jewelry, bridal gauntlet, gold sandals, white dress, cleavage, robe`, avec le style habituel (`sweaty skin`, proportions, LoRA).
- Corps entier visible (sauf mention), visage lisible, fond blanc uni (`simple background, white background`).
- Les mains et accessoires ne cachent jamais le buste ; les cheveux ne masquent pas un bras entier.
- Résolution finale vers 1536×2688.
- **Règle de contenu** : sensuelle, jamais explicite, pas de nudité. Une proposition qui en montre est écartée.

---

## 4. Les poses

Les tags de pose se placent à la place de la ligne de pose du prompt de P01. Tout le reste du prompt ne change pas.

### Lot 1 — essentiel (à faire en premier)

| ID | Où / quand | Pose (tags) | Gestes animés | Accessoires |
|---|---|---|---|---|
| **P01** | Statut, pose principale, au repos partout | `standing, contrapposto, weight on one leg, body slightly turned, head tilt, one hand on hip, other hand touching own hair` | respiration, transfert de poids, clin d'œil, petit rire, inclinaison de tête, regard qui suit le doigt | — |
| **P05** | Quête validée, quiz réussi, 5 000 pas, objectif d'eau | `standing, clapping hands, leaning forward slightly, happy` | rebond de joie, applaudissements répétés | particules dorées |
| **P08** | Quiz raté, malus léger | `standing, hand on hip, index finger raised, wagging finger, leaning forward` | doigt qui se balance, hochement « tsk tsk » | — |
| **P09** | Training : séance en cours, série validée | `standing, crossed arms, confident stance, legs apart` | hochement approbateur, tapotement du pied | **bandeau blanc** de sport, sifflet doré au cou |
| **P10** | Training : encouragement pom-pom (voir événements) | `standing, both arms raised, cheering, jumping, open mouth` | petit saut, bras qui s'agitent | bandeau blanc, **pompons dorés** |
| **P06** | Bibliothèque (quiz, cours, scénarios) | `standing, holding open book, one hand on book, looking at viewer over the book` | tourne la page, lève les yeux du livre | **lunettes fines dorées** |
| **P04** | Onglet Quêtes | `standing, holding glowing scroll, pointing at scroll` | pointe la liste, déroule le parchemin | parchemin lumineux |
| **P17** | Montée de niveau / de rang (plein écran) | `full body, from below, arms spread wide, triumphant, floating` | élévation lente, tissu soulevé | éclat de lumière, rayons |

### Lot 2 — moments clés

| ID | Où / quand | Pose (tags) | Gestes animés | Accessoires |
|---|---|---|---|---|
| **P11** | Training : minuteur de repos | `sitting on weight bench, crossed legs, holding hourglass` | balance le sablier, jambe qui se balance | sablier doré, bandeau blanc |
| **P12** | Record battu, séance terminée | `standing, raised fist, triumphant, wink` | poing qui pompe, rebond | bandeau blanc, éclat |
| **P16** | Titre débloqué, quête hebdo accomplie | `standing, holding laurel wreath with both hands, reaching towards viewer` | tend la couronne vers l'écran | couronne de lauriers, particules |
| **P13** | Minuteur de méditation | `sitting, lotus position, floating, hands together, closed eyes, serene` | lévitation lente, respiration profonde | halo doux |
| **P14** | Minuteur de décompression | `standing, stretching, arms up, hands clasped above head` | étirement qui monte et descend | — |
| **P18** | Éveil, création du profil (plein écran) | `full body, floating, holding glowing orb, light in hands, descending` | descente, orbe qui pulse | orbe, rayons |
| **P19** | Désentraînement | `sitting on marble pillar, crossed legs, crossed arms, looking away, pout` | soupir, regard en coin | colonne de marbre |
| **P02** | Ouverture de l'app (matin et journée) | `standing, waving, hand raised in greeting` | salut de la main | — |
| **P03** | Le soir, rappel de coucher, coucher tardif | `standing, yawning, hand over mouth, holding lantern` | bâillement, lanterne qui oscille | lanterne, petits « zzz » |

### Lot 3 — détails de vie

| ID | Où / quand | Pose (tags) | Gestes animés | Accessoires |
|---|---|---|---|---|
| **P15** | Onglet Planning | `standing, holding tablet and stylus, finger on own chin, thinking` | tape sur la tablette | tablette dorée |
| **P20** | Douleur ou fatigue signalée (mode IA) | `standing, hands clasped near chest, leaning forward, worried` | penche la tête, inquiète | — |
| **P21** | Quête principale (taille) | `standing, hand raised above head, palm down, measuring height, playful` | main qui monte d'un cran | ruban de mesure doré |
| **P22** | Rappel et objectif d'eau | `standing, holding golden cup, offering cup towards viewer` | tend la coupe | coupe dorée |
| **P23** | Skincare matin et soir | `standing, hand touching own cheek, holding small glass bottle` | caresse la joue | petit flacon |
| **P24** | Toutes les quêtes du jour terminées | `standing, blowing a kiss, one eye closed` | envoi du baiser | petits cœurs dorés |

---

## 5. Expressions (partagées par toutes les poses)

`défaut` (sourire charmeur) · `taquine` (clin d'œil) · `joyeuse` (rire) · `satisfaite` (fière) · `timide` (rougissante) · `surprise` · `boudeuse` · `inquiète` · `colère légère` · `ensommeillée` · `concentrée` (yeux fermés, sereine)
Pour la vie : `yeux fermés` (clignement) · bouche `fermée / entrouverte / ouverte` (parole).

---

## 6. Gestes universels (valables dans toutes les poses)

Respiration · clignement aléatoire · parole synchronisée sur la voix · physique des cheveux, de la robe et des bijoux · légère rotation pseudo-3D de la tête · regard qui suit le toucher · parallaxe à l'inclinaison du téléphone.

---

## 7. Événement → réaction

| Événement de l'app | Pose | Expression | Geste / effet |
|---|---|---|---|
| Ouverture le matin / la journée | P02 | joyeuse | salut |
| Ouverture après 22 h | P03 | ensommeillée | bâillement |
| Toucher (1 à 3 fois) | pose en cours | taquine → joyeuse → timide | clin d'œil, petit rire |
| Toucher insistant (5 fois et plus) | pose en cours | boudeuse | regard en coin |
| Quête journalière validée | P05 | satisfaite | rebond + particules |
| Toutes les quêtes du jour | P24 | taquine | baiser + cœurs |
| Quête hebdo accomplie | P16 | joyeuse | tend la couronne |
| Quiz ou scénario réussi | P05 | joyeuse | applaudit |
| Quiz ou scénario raté | P08 | taquine | doigt qui gronde |
| Séance de sport démarrée | P09 | défaut | hochement |
| Série validée | P09 | satisfaite | hochement + son « série » |
| Repos en cours | P11 | défaut | sablier |
| **Repos : encouragement** (une fois par repos, quand il reste environ 20 s, ou si le repos dure plus que prévu) | P10 | joyeuse | saut pom-pom + réplique du type « Allez, encore une, tu peux le faire ! » |
| Record battu | P12 | joyeuse | poing levé + éclat |
| Séance terminée | P12 | satisfaite | rebond |
| Méditation | P13 | concentrée | lévitation |
| Décompression | P14 | défaut | étirement |
| Objectif d'eau | P22 | satisfaite | tend la coupe |
| Skincare | P23 | timide | caresse la joue |
| Coucher dans la plage idéale | P03 | satisfaite | lanterne |
| Coucher trop tard | P03 | boudeuse | soupir |
| Désentraînement | P19 | boudeuse | soupir |
| Montée de niveau ou de rang | P17 | joyeuse | plein écran, rayons |
| Titre débloqué | P16 | satisfaite | couronne + particules |
| Douleur / fatigue signalée (IA) | P20 | inquiète | se penche |
| Mesure de taille enregistrée | P21 | taquine | main qui mesure |
| Création du profil | P18 | défaut | descente + orbe |
| Onglets (au repos) | Quêtes P04 · Biblio P06 · Training P09 · Planning P15 · Statut P01 | défaut | gestes universels |

Après chaque réaction, retour à la pose de l'onglet au bout de quelques secondes.

---

## 8. Ordre de production

1. P01, validée à la main.
2. Expressions (section 5) sur P01, puis découpage et animation de P01 → **point d'étape : on valide la qualité avant de continuer.**
3. Lot 1, une pose à la fois : génération (4 à 6 propositions) → choix humain → découpage → animation → point d'étape.
4. Lot 2, puis lot 3, même méthode.
