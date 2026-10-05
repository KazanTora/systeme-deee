/**
 * Deux voix visuelles :
 *  - le Système : HUD bleu néon, Rajdhani, coins en équerre ;
 *  - la Déesse : or pâle, Cormorant Garamond italique (marbre et gravure gréco-romaine).
 * L'or n'apparaît QUE quand c'est elle qui parle ou ce qu'elle t'accorde (titres).
 */
export const C = {
  abyss: '#03060F',
  deep: '#071026',
  panel: 'rgba(9, 26, 62, 0.78)',
  panelSolid: '#0A1A3E',
  line: '#1E4C8F',
  neon: '#3DB8FF',
  glow: '#9BE3FF',
  text: '#DCEBFF',
  dim: '#7D93B8',
  faint: '#3A4F75',
  gold: '#E9C77B',
  goldDim: '#8E7646',
  danger: '#FF5470',
  ok: '#5CF2B0',
};

export const F = {
  hud: 'Rajdhani_600SemiBold',
  hudBold: 'Rajdhani_700Bold',
  hudBody: 'Rajdhani_500Medium',
  voice: 'CormorantGaramond_500Medium_Italic',
  voiceTitle: 'CormorantGaramond_700Bold',
};

export const glow = (color: string = C.neon, radius = 10) => ({
  shadowColor: color,
  shadowOpacity: 0.85,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: 0 },
});
