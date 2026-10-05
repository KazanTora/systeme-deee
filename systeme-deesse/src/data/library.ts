/**
 * BIBLIOTHÈQUE — Intelligence (Survie & Tactique)
 * Ton : brut, terrain, pragmatique. Chaque réponse juste est celle qui te garde en vie,
 * même quand elle n'est pas spectaculaire.
 */
export type Category = 'Survie' | 'Feu' | 'Eau' | 'Abris' | 'Chasse' | 'Plantes' | 'Faune' | 'Forge' | 'Combat';
export const CATEGORIES: Category[] = ['Survie', 'Feu', 'Eau', 'Abris', 'Chasse', 'Plantes', 'Faune', 'Forge', 'Combat'];

export interface Quiz { id: string; cat: Category; q: string; choices: string[]; answer: number; why: string }
export interface Course { id: string; cat: Category; title: string; body: string[] }
export interface ScenarioOption { text: string; correct: boolean; feedback: string }
export interface Scenario { id: string; cat: Category; title: string; situation: string; options: ScenarioOption[] }

export const QUIZZES: Quiz[] = [
  // SURVIE
  { id: 'q1', cat: 'Survie', q: 'Coincé dehors pour la nuit. Ordre de priorité ?', choices: ['Nourriture, eau, abri', 'Abri, eau, feu, nourriture', 'Feu, nourriture, abri'], answer: 1, why: 'Le froid te tue en heures, la soif en jours, la faim en semaines. Tu manges en dernier.' },
  { id: 'q2', cat: 'Survie', q: 'Coton trempé sur la peau par 5 °C :', choices: ['Pas grave tant que tu bouges', 'Il pompe ta chaleur : vire-le ou remplace-le', 'Il isole encore un peu'], answer: 1, why: 'Le coton mouillé n’isole plus rien et accélère l’hypothermie. Laine et synthétique gardent de la chaleur même trempés.' },
  { id: 'q3', cat: 'Survie', q: 'Hypothermie : quel signe veut dire que ça devient critique ?', choices: ['Il frissonne fort', 'Il arrête de frissonner et devient confus', 'Il a les mains froides'], answer: 1, why: 'Plus de frissons alors qu’il fait toujours froid = plus de réserves. Réchauffe le tronc tout de suite.' },
  { id: 'q4', cat: 'Survie', q: 'La mousse indique le nord ?', choices: ['Toujours', 'Non, elle pousse là où c’est humide et ombragé', 'Seulement sur les chênes'], answer: 1, why: 'Mythe. Soleil levant à l’est, couchant à l’ouest, au sud à midi dans l’hémisphère nord.' },
  { id: 'q5', cat: 'Survie', q: 'Suivre un cours d’eau vers l’aval :', choices: ['Mène toujours aux habitations', 'Mène souvent aux habitations, mais aussi vers des gorges, cascades et marais', 'Ne sert à rien'], answer: 1, why: 'Bonne direction générale, terrain piégeux. Longe-le par les crêtes quand ça se resserre.' },
  // FEU
  { id: 'q6', cat: 'Feu', q: 'Ton feu fume énormément et ne prend pas. Cause n°1 ?', choices: ['Trop d’oxygène', 'Bois humide ou trop gros trop tôt', 'Mauvais briquet'], answer: 1, why: 'Fumée blanche = eau qui s’évapore. Fends le bois et monte en section progressivement.' },
  { id: 'q7', cat: 'Feu', q: 'Ordre d’alimentation d’un feu naissant ?', choices: ['Bûches, brindilles, amadou', 'Amadou, petit bois, combustible', 'Petit bois, bûches, amadou'], answer: 1, why: 'Tout est prêt AVANT l’étincelle : trois tas, du plus fin au plus gros.' },
  { id: 'q8', cat: 'Feu', q: 'Pourquoi l’écorce de bouleau sous la pluie ?', choices: ['Elle sèche instantanément', 'Ses huiles brûlent même mouillées', 'Elle fait beaucoup de fumée'], answer: 1, why: 'La bétuline est inflammable même humide. Arrache des lanières fines sur les arbres morts.' },
  { id: 'q9', cat: 'Feu', q: 'Pile 9 V contre de la paille de fer fine :', choices: ['Rien ne se passe', 'La paille rougit et s’enflamme instantanément', 'La pile explose'], answer: 1, why: 'Le courant chauffe les fibres au rouge. Amadou prêt avant de toucher les bornes.' },
  { id: 'q10', cat: 'Feu', q: 'Ferrocérium sans éparpiller ton nid d’amadou :', choices: ['Frapper la tige vers le nid', 'Lame immobile au contact, tirer la tige vers toi', 'Gratter le plus vite possible'], answer: 1, why: 'Ta main ne bouge pas vers le nid, donc tu ne le défonces pas. Les étincelles tombent au même endroit.' },
  // EAU
  { id: 'q11', cat: 'Eau', q: 'Ébullition pour rendre l’eau buvable (basse altitude) ?', choices: ['10 secondes', '1 minute à gros bouillons', '20 minutes'], answer: 1, why: '1 minute suffit. 3 minutes au-dessus d’environ 2 000 m.' },
  { id: 'q12', cat: 'Eau', q: 'Un filtre en tissu rend l’eau potable ?', choices: ['Oui', 'Non : il enlève la boue, pas les microbes', 'Oui si on filtre trois fois'], answer: 1, why: 'Le tissu clarifie. Ensuite tu fais bouillir ou tu traites.' },
  { id: 'q13', cat: 'Eau', q: 'Manger de la neige directement :', choices: ['Bonne hydratation', 'Ça refroidit ton noyau et coûte de l’énergie', 'Aucun effet'], answer: 1, why: 'Fais-la fondre d’abord, contre ton corps dans une gourde ou près du feu.' },
  { id: 'q14', cat: 'Eau', q: 'Distillateur solaire creusé dans le sol :', choices: ['Ta source principale', 'Rendement ridicule, souvent moins d’un demi-litre par jour', 'Parfait en forêt'], answer: 1, why: 'Tu perds plus en sueur à creuser qu’il ne te rapporte. Cherche de l’eau, ne la fabrique pas.' },
  { id: 'q15', cat: 'Eau', q: 'Désinfection solaire (SODIS) :', choices: ['Bouteille PET transparente en plein soleil environ 6 h', 'Bouteille en verre teinté 1 h', 'Sac noir 30 min'], answer: 0, why: 'Les UV tuent l’essentiel des pathogènes. Ciel couvert : deux jours. Eau trouble : filtre avant.' },
  { id: 'q16', cat: 'Eau', q: 'Eau de mer ou urine en dernier recours ?', choices: ['Petites gorgées, ça aide', 'Jamais : le sel te déshydrate plus vite'], answer: 1, why: 'Tu accélères ta mort. Économise ta sueur à la place : bouge la nuit, reste à l’ombre le jour.' },
  // ABRIS
  { id: 'q17', cat: 'Abris', q: 'Où perds-tu le plus de chaleur en dormant à même le sol ?', choices: ['Vers le ciel', 'Dans le sol, par conduction', 'Par les pieds'], answer: 1, why: 'Le sol aspire ta chaleur toute la nuit. Lit de feuilles sèches épais d’abord, toit ensuite.' },
  { id: 'q18', cat: 'Abris', q: 'Où ne JAMAIS monter ton abri ?', choices: ['Lit de ruisseau à sec', 'Petite butte', 'Derrière un rocher coupe-vent'], answer: 0, why: 'Crue éclair possible. Évite aussi les arbres morts et les cuvettes où l’air froid stagne.' },
  { id: 'q19', cat: 'Abris', q: 'Hutte de débris : épaisseur de feuilles sur la structure ?', choices: ['10 cm', 'Au moins une longueur de bras (60–90 cm)', 'Peu importe'], answer: 1, why: 'Si tu vois le jour à travers, tu vas geler.' },
  { id: 'q20', cat: 'Abris', q: 'Taille idéale d’un abri de survie ?', choices: ['Le plus grand possible', 'Juste ton corps', 'Ouvert pour voir les étoiles'], answer: 1, why: 'Chaque litre d’air en trop, c’est ton corps qui doit le chauffer.' },
  // CHASSE
  { id: 'q21', cat: 'Chasse', q: 'Pourquoi ne manger que du lapin est dangereux ?', choices: ['Le lapin est toxique', 'Trop maigre : sans graisse, tu t’affaiblis', 'Trop sucré'], answer: 1, why: 'Protéines sans graisses = malnutrition. Mange la cervelle, la moelle, les abats.' },
  { id: 'q22', cat: 'Chasse', q: 'À l’éviscération, l’erreur à ne pas faire :', choices: ['Percer intestins ou vessie', 'Refroidir la carcasse', 'Retirer les abats'], answer: 0, why: 'Le contenu pourrit la viande. Ouvre en tirant la peau vers le haut, lame tranchant vers l’extérieur.' },
  { id: 'q23', cat: 'Chasse', q: 'Où poser un collet ?', choices: ['Au milieu d’une clairière', 'Sur une coulée fréquentée, là où le passage se resserre', 'Près du camp'], answer: 1, why: 'Les animaux reprennent toujours les mêmes passages. Pose-en plusieurs, relève-les à l’aube.' },
  { id: 'q24', cat: 'Chasse', q: 'Meilleur rendement calories/effort ?', choices: ['Gros gibier', 'Insectes, larves, poisson', 'Oiseaux en vol'], answer: 1, why: 'Traquer un cerf brûle plus que ce que tu ramèneras. Larves et sauterelles cuites : protéines immédiates.' },
  // PLANTES
  { id: 'q25', cat: 'Plantes', q: 'Champignon inconnu, tu as faim :', choices: ['Tu goûtes un bout', 'Tu n’y touches pas', 'Tu le fais bouillir'], answer: 1, why: 'Les amanites mortelles résistent à la cuisson et frappent 12 h plus tard. Trop tard.' },
  { id: 'q26', cat: 'Plantes', q: 'La carotte sauvage se confond avec :', choices: ['L’ortie', 'La grande ciguë', 'Le pissenlit'], answer: 1, why: 'Tige lisse tachée de pourpre, odeur de souris : ciguë. Sans formation, tu laisses toute la famille.' },
  { id: 'q27', cat: 'Plantes', q: 'L’ail des ours se confond avec :', choices: ['Muguet et colchique, mortels', 'Menthe et ortie', 'Trèfle et plantain'], answer: 0, why: 'Froisse la feuille : pas d’odeur d’ail, tu jettes.' },
  { id: 'q28', cat: 'Plantes', q: 'Insectes à éviter :', choices: ['Poilus, très colorés ou qui puent', 'Sauterelles', 'Vers de terre'], answer: 0, why: 'Couleurs vives et poils = défense chimique. Tout le reste, cuit : parasites.' },
  // FAUNE
  { id: 'q29', cat: 'Faune', q: 'Ours brun en attaque défensive (tu l’as surpris) :', choices: ['Tu cours vers un arbre', 'À plat ventre, mains sur la nuque, sac sur le dos', 'Tu frappes'], answer: 1, why: 'Il neutralise une menace. Tu n’en es plus une, il part. Attaque prédatrice ou ours noir : tu te bats, museau et yeux.' },
  { id: 'q30', cat: 'Faune', q: 'Morsure de vipère, réaction terrain :', choices: ['Garrot et aspiration', 'Immobiliser, retirer bagues et montre, rejoindre un hôpital sans courir', 'Inciser'], answer: 1, why: 'Le garrot concentre le venin et nécrose, l’aspiration ne retire rien. L’adulte en bonne santé survit presque toujours, mais l’œdème peut être sévère.' },
  { id: 'q31', cat: 'Faune', q: 'Sanglier qui charge sur le sentier :', choices: ['Sortir de sa trajectoire, monter en hauteur ou derrière un tronc', 'Lui faire face', 'S’allonger'], answer: 0, why: 'Les défenses ouvrent les cuisses à hauteur de fémorale. Ne reste pas dans l’axe.' },
  { id: 'q32', cat: 'Faune', q: 'Chien agressif qui charge :', choices: ['Courir', 'Lui offrir l’avant-bras protégé, rester debout, frapper nez et yeux', 'S’allonger'], answer: 1, why: 'Au sol, il va à la gorge. Donne-lui une cible sacrifiable et reste sur tes jambes.' },
  { id: 'q33', cat: 'Faune', q: 'Loup qui s’approche :', choices: ['Courir', 'Rester grand, faire face, reculer lentement ; s’il attaque, te battre en protégeant la gorge'], answer: 1, why: 'Fuir déclenche la poursuite. Tu ne lui tournes jamais le dos.' },
  // FORGE
  { id: 'q34', cat: 'Forge', q: 'Acier au carbone prêt pour la trempe quand :', choices: ['Il est rouge sombre', 'Il n’attire plus l’aimant', 'Il fume'], answer: 1, why: 'Vers 770 °C l’acier devient amagnétique. Un poil au-dessus, puis trempe.' },
  { id: 'q35', cat: 'Forge', q: 'Pourquoi le revenu après la trempe ?', choices: ['Plus dur', 'Moins cassant', 'Plus brillant'], answer: 1, why: 'Trempé, il casse comme du verre. Revenu ~200 °C, deux cycles d’une heure.' },
  { id: 'q36', cat: 'Forge', q: 'Meilleur métal de récupération pour une lame :', choices: ['Cornière en acier doux', 'Lame de ressort ou vieille lime', 'Aluminium'], answer: 1, why: 'Haut carbone = prend la trempe. L’acier doux reste mou.' },
  { id: 'q37', cat: 'Forge', q: 'Tremper un acier haut carbone dans l’eau froide :', choices: ['Dureté maximale sans risque', 'Gros risque de fissure : huile tiède'], answer: 1, why: 'Le choc thermique de l’eau fend les aciers haut carbone. Huile préchauffée vers 50 °C.' },
  // COMBAT
  { id: 'q38', cat: 'Combat', q: 'L’agression est inévitable, aucune sortie. Tu :', choices: ['Attends qu’il frappe', 'Frappes le premier, fort, sur une cible vulnérable, puis casses le contact', 'Négocies jusqu’au bout'], answer: 1, why: 'L’initiative gagne. Yeux, gorge, genoux, entrejambe. Dès qu’une ouverture existe, tu dégages.' },
  { id: 'q39', cat: 'Combat', q: 'Cycle OODA :', choices: ['Observer, Orienter, Décider, Agir', 'Ouvrir, Opposer, Dévier, Attaquer', 'Organiser, Obéir, Défendre, Avancer'], answer: 0, why: 'Le plus rapide à boucler le cycle dicte le combat. Fais-le réagir à toi, pas l’inverse.' },
  { id: 'q40', cat: 'Combat', q: 'Couteau en face, mains nues :', choices: ['Désarmement', 'Tu pars du principe que tu seras coupé : distance, obstacle, arme improvisée, sortie', 'Bloquer la lame à la main'], answer: 1, why: 'Les désarmements de film échouent. Chaise, sac, veste entre toi et la lame, et tu sors.' },
  { id: 'q41', cat: 'Combat', q: 'Plusieurs agresseurs :', choices: ['Viser le chef', 'Bouger pour les aligner et n’en avoir qu’un à portée, puis sortir', 'Rester dos au mur'], answer: 1, why: 'Au centre du cercle tu te fais déchirer. Mouvement permanent vers une sortie.' },
  { id: 'q42', cat: 'Combat', q: 'Sous adrénaline, tu perds d’abord :', choices: ['La force', 'La motricité fine et la vision périphérique', 'L’audition'], answer: 1, why: 'Vision tunnel, mains qui tremblent. Gestes simples et larges, tourne la tête pour élargir le champ.' },
  { id: 'q43', cat: 'Combat', q: 'Sang qui gicle d’une cuisse :', choices: ['Compresse légère', 'Garrot haut et serré au-dessus de la plaie, noter l’heure', 'Surélever seulement'], answer: 1, why: 'Une fémorale vide un homme en quelques minutes. Serre jusqu’à l’arrêt du saignement ; un garrot se tolère en général jusqu’à environ deux heures.' },
];

export const COURSES: Course[] = [
  { id: 'c1', cat: 'Survie', title: 'Les priorités qui te gardent en vie', body: ['Sécurité immédiate, abri, eau, feu, signalisation, nourriture. Dans cet ordre, pas un autre.', 'Le froid humide tue en quelques heures. La faim, en semaines : oublie-la la première nuit.', 'Coton = mort par temps humide. Laine et synthétique, même trempés, gardent de la chaleur.', 'Signal : trois feux en triangle, trois coups de sifflet, éclats de miroir vers ce qui vole.'] },
  { id: 'c2', cat: 'Feu', title: 'Feu sous la pluie', body: ['Le sec est sous le mouillé : branches mortes encore accrochées, cœur des souches, bois gras de pin.', 'Fends tout. L’intérieur d’une branche trempée est souvent sec.', 'Trois tas prêts AVANT la flamme : amadou, petit bois allumette-crayon, bois poignet.', 'Ferro : lame immobile contre l’amadou, tu tires la tige vers toi. Pile 9 V + paille de fer en secours.'] },
  { id: 'c3', cat: 'Eau', title: 'Trouver et traiter l’eau', body: ['Descends le terrain, suis la végétation dense, les traces et les vols d’oiseaux à l’aube et au crépuscule.', 'Eau courante plutôt que stagnante, puisée en amont de ton camp.', 'Préfiltre au tissu, puis 1 minute à gros bouillons. Pas de feu : SODIS, bouteille PET transparente, 6 h de plein soleil.', 'Pas d’eau ? Économise ta sueur : actif la nuit, immobile à l’ombre le jour.'] },
  { id: 'c4', cat: 'Abris', title: 'Hutte de débris', body: ['Une perche faîtière inclinée, posée sur une fourche à hauteur de hanche.', 'Côtes en branches serrées des deux côtés, à peine plus large que tes épaules.', 'Feuilles sèches entassées sur au moins une longueur de bras. Si tu vois le jour, ce n’est pas fini.', 'Rembourre l’intérieur de feuilles, bouche l’entrée avec un tas de feuilles derrière toi.'] },
  { id: 'c5', cat: 'Chasse', title: 'Collets et traitement du petit gibier', body: ['Collet en fil de laiton sur une coulée, boucle d’environ un poing de diamètre, à un poing du sol.', 'Pose-en plusieurs, là où le passage se resserre. Relève à l’aube.', 'Saigne, éviscère sans percer intestins ni vessie, refroidis vite.', 'Foie taché ou kysteux : animal malade, tu jettes. Garde graisses, moelle et abats : c’est ce qui te nourrit vraiment.'] },
  { id: 'c6', cat: 'Plantes', title: 'Manger sans s’empoisonner', body: ['Tu ne manges que ce que tu identifies à 100 %. Un doute, c’est non.', 'Valeurs sûres : ortie cuite, pissenlit, plantain, ail des ours (qui doit sentir l’ail).', 'Toute la famille de la carotte sauvage cache la ciguë : tu la laisses.', 'Champignons : jamais en survie. Rendement calorique nul, risque mortel.'] },
  { id: 'c7', cat: 'Faune', title: 'Bêtes dangereuses : les réflexes', body: ['Ours brun surpris : à plat ventre, mains sur la nuque. Ours qui te traque ou ours noir : tu te bats, museau et yeux.', 'Loup, chien : debout, face à lui, jamais le dos tourné. Avant-bras protégé en appât si ça mord.', 'Sanglier : hors de l’axe, en hauteur. Ses défenses visent tes cuisses.', 'Vipère : membre immobilisé, bagues retirées, évacuation à allure calme. Ni garrot ni incision.'] },
  { id: 'c8', cat: 'Forge', title: 'Du ressort à la lame', body: ['Normalise : chauffe jusqu’à l’amagnétisme, refroidis à l’air, trois fois.', 'Mets en forme, puis trempe à l’huile tiède juste au-dessus du point amagnétique. Jamais l’eau froide sur du haut carbone.', 'Revenu ~200 °C, une heure, deux fois. Paille = dur, bleu = souple.', 'Lunettes, gants, huile qui ne déborde pas, extincteur à portée.'] },
  { id: 'c9', cat: 'Combat', title: 'Lire et gagner une confrontation', body: ['Repère les sorties en entrant. Toujours.', 'Surveille les mains, pas les yeux : ce sont elles qui portent l’arme.', 'Si la fuite est impossible et l’attaque imminente : frappe le premier, cibles molles (yeux, gorge, genoux, entrejambe), puis sors.', 'Arme blanche : tu seras coupé. Mets des obstacles, prends une arme improvisée, quitte la zone. Hémorragie : garrot haut et serré.'] },
];

export const SCENARIOS: Scenario[] = [
  { id: 's1', cat: 'Survie', title: 'La nuit tombe', situation: 'Égaré en forêt. Bruine, 8 °C, une heure de jour. Couteau, briquet, veste en coton.', options: [
    { text: 'Tu forces la marche pour retrouver le sentier', correct: false, feedback: 'De nuit sous la pluie, tu te tords une cheville et tu t’épuises trempé. C’est comme ça qu’on meurt à 8 °C.' },
    { text: 'Tu montes une hutte de débris épaisse et tu fais ton bois avant la nuit', correct: true, feedback: 'Le froid humide est ton ennemi. Isolé du sol, au sec, feu prêt : tu t’orientes au matin.' },
    { text: 'Tu cherches à manger', correct: false, feedback: 'Une nuit sans manger ne te fera rien. Une nuit trempé sans abri, si.' },
  ] },
  { id: 's2', cat: 'Eau', title: 'Deux sources', situation: 'Jour 2. Une mare stagnante à côté du camp, un ruisseau vif à 15 minutes. Feu possible, une gourde métal.', options: [
    { text: 'Tu bois la mare, c’est plus près', correct: false, feedback: 'Diarrhée garantie, et la diarrhée te déshydrate plus vite que la soif.' },
    { text: 'Ruisseau, préfiltre tissu, une minute à gros bouillons dans la gourde', correct: true, feedback: 'Eau courante, filtrée, bouillie. Le trajet vaut largement le risque évité.' },
    { text: 'Tu bois le ruisseau cru, l’eau courante est propre', correct: false, feedback: 'Une carcasse en amont suffit. Tu traites tout.' },
  ] },
  { id: 's3', cat: 'Faune', title: 'Charge d’ours', situation: 'À 20 m, un ours brun se dresse, retombe et charge avant de s’arrêter net.', options: [
    { text: 'Tu cours vers la forêt', correct: false, feedback: 'Il court à 50 km/h. Tu déclenches la poursuite.' },
    { text: 'Tu restes planté, voix grave et posée, tu recules lentement face à lui', correct: true, feedback: 'Charge d’intimidation. S’il touche : à plat ventre, mains sur la nuque, et tu ne bouges plus.' },
    { text: 'Tu lui balances des pierres', correct: false, feedback: 'Tu transformes une intimidation en attaque.' },
  ] },
  { id: 's4', cat: 'Abris', title: 'Choix du camp', situation: 'Trois options : lit de rivière sec et plat, cuvette abritée sous un grand arbre mort, petite butte protégée par des arbres vivants.', options: [
    { text: 'Le lit de rivière', correct: false, feedback: 'Un orage en amont et tu te noies dans ton sommeil.' },
    { text: 'La cuvette sous l’arbre mort', correct: false, feedback: 'L’air froid s’y accumule et l’arbre mort finira sur toi.' },
    { text: 'La butte', correct: true, feedback: 'Drainée, plus tiède, coupe-vent naturel.' },
  ] },
  { id: 's5', cat: 'Combat', title: 'Coincé', situation: 'Parking souterrain. Un type te bloque contre ta voiture, aucune sortie, il arme son poing et avance.', options: [
    { text: 'Tu lèves les mains et attends', correct: false, feedback: 'Il a déjà décidé de frapper. Tu lui offres le premier coup.' },
    { text: 'Tu frappes le premier, yeux ou gorge, puis tu dégages dès l’ouverture', correct: true, feedback: 'L’attaque est inévitable : l’initiative est à toi. Frappe, casse le contact, sors.' },
    { text: 'Tu tentes une clé de bras', correct: false, feedback: 'Sous adrénaline la technique fine disparaît. Gestes simples et brutaux.' },
  ] },
  { id: 's6', cat: 'Combat', title: 'Lame sortie', situation: 'Un homme te menace d’un couteau à un mètre et exige ton portefeuille. Il ne s’approche pas plus.', options: [
    { text: 'Tu tentes de lui arracher le couteau', correct: false, feedback: 'Désarmement à mains nues contre une lame : tu prends au minimum deux coups.' },
    { text: 'Tu jettes le portefeuille loin de toi sur le côté et tu sors dans l’autre direction', correct: true, feedback: 'Il veut l’argent, pas toi. Le portefeuille part au sol, il doit choisir : toi, ou lui. Tu as gagné la distance.' },
    { text: 'Tu lui fais face pour l’impressionner', correct: false, feedback: 'Tu transformes un vol en combat au couteau. Tu perds.' },
  ] },
  { id: 's7', cat: 'Feu', title: 'Une seule allumette', situation: 'Tout est trempé. Une allumette, un peu d’écorce de bouleau, des sapins autour.', options: [
    { text: 'Tu la grattes tout de suite', correct: false, feedback: 'Rien de prêt, ta seule flamme meurt.' },
    { text: 'Écorce de bouleau, brindilles mortes de sapin, bois fendu, tout prêt, puis allumette à l’abri du vent', correct: true, feedback: 'La flamme ne dure que quelques secondes. Tout doit être là avant.' },
    { text: 'Tu enflammes directement une grosse branche', correct: false, feedback: 'Elle n’atteindra jamais sa température d’ignition.' },
  ] },
  { id: 's8', cat: 'Survie', title: 'Il ne tremble plus', situation: 'Ton partenaire est trempé depuis des heures. Il a arrêté de frissonner, parle de travers et veut dormir.', options: [
    { text: 'Tu le laisses dormir pour qu’il récupère', correct: false, feedback: 'Il ne se réveillera peut-être pas.' },
    { text: 'Vêtements mouillés retirés, isolé du sol, enveloppé avec toi pour te servir de radiateur, boisson chaude sucrée s’il avale bien', correct: true, feedback: 'Il n’a plus de réserves : la chaleur doit venir de dehors, sur le tronc.' },
    { text: 'Tu lui frictionnes les bras et les jambes', correct: false, feedback: 'Tu renvoies le sang froid des membres vers le cœur. Réchauffe le tronc.' },
  ] },
  { id: 's9', cat: 'Combat', title: 'Hache dans la cuisse', situation: 'En fendant du bois, ton partenaire s’ouvre l’intérieur de la cuisse. Le sang est rouge vif et sort par saccades.', options: [
    { text: 'Compresse et tu attends que ça coagule', correct: false, feedback: 'Une fémorale ne coagule pas sous compresse. Il a quelques minutes.' },
    { text: 'Garrot haut et serré au-dessus de la plaie jusqu’à l’arrêt du saignement, tu notes l’heure, puis évacuation', correct: true, feedback: 'Ceinture, sangle et bâton pour serrer. L’heure écrite sur sa peau.' },
    { text: 'Tu surélèves la jambe', correct: false, feedback: 'Bien pour une coupure, inutile pour une artère.' },
  ] },
  { id: 's10', cat: 'Survie', title: 'Plein nord', situation: 'Pas de boussole, plein soleil en milieu de matinée, tu dois tenir le nord pendant des heures.', options: [
    { text: 'Tu suis la mousse sur les troncs', correct: false, feedback: 'Elle suit l’humidité, pas le nord.' },
    { text: 'Bâton planté, tu marques le bout de l’ombre, tu attends 15 minutes, nouvelle marque : la ligne va d’ouest en est', correct: true, feedback: 'Première marque = ouest, seconde = est. Le nord est perpendiculaire, soleil dans le dos à midi.' },
    { text: 'Tu marches droit devant en espérant', correct: false, feedback: 'Sans repère, tout le monde tourne en rond.' },
  ] },
  { id: 's11', cat: 'Faune', title: 'Chien lâché', situation: 'Un gros chien sans maître sort d’une cour et charge vers toi, crocs sortis. Tu as une veste.', options: [
    { text: 'Tu cours', correct: false, feedback: 'Il court deux fois plus vite et tu lui offres ton dos.' },
    { text: 'Veste enroulée sur l’avant-bras, tu le lui présentes, tu restes debout et tu frappes nez et yeux s’il mord', correct: true, feedback: 'Il mord ce que tu lui donnes. Au sol, il cherche la gorge.' },
    { text: 'Tu te roules en boule', correct: false, feedback: 'Bon contre un ours défensif, pas contre un chien qui veut te tenir.' },
  ] },
  { id: 's12', cat: 'Survie', title: 'Passage à gué', situation: 'Une rivière à traverser. Un étroit rapide aux genoux, ou une section large et calme à mi-cuisse.', options: [
    { text: 'L’étroit rapide, c’est plus court', correct: false, feedback: 'Le courant s’accélère là où ça se resserre. Une chute et tu es emporté.' },
    { text: 'La section large, sangle ventrale du sac défaite, bâton en appui, face à l’amont, pas latéraux', correct: true, feedback: 'Sac détachable si tu tombes, trois appuis permanents.' },
    { text: 'Tu traverses en courant pour aller vite', correct: false, feedback: 'Un pied sur un galet glissant, et c’est fini.' },
  ] },
];
