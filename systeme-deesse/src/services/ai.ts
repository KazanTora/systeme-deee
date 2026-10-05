/**
 * Mode IA dynamique (optionnel). Clé API stockée dans le trousseau iOS (expo-secure-store).
 * Fournisseurs : Anthropic ou OpenAI. Si aucune clé : l'app reste 100 % locale.
 */
import * as SecureStore from 'expo-secure-store';
import { AIProvider } from '../store/useSystem';
import { GODDESS_SYSTEM_PROMPT, SCENARIO_SYSTEM_PROMPT } from '../ai/systemPrompt';
import { Scenario, Category } from '../data/library';

const KEY = 'systeme_ai_key';

/** Noms de modèles par défaut, modifiables dans les Réglages. */
export const DEFAULT_MODELS: Record<Exclude<AIProvider, 'none'>, string> = {
  anthropic: 'claude-sonnet-5-5',
  openai: 'gpt-4.1-mini',
};

export const saveApiKey = (k: string) => (k ? SecureStore.setItemAsync(KEY, k) : SecureStore.deleteItemAsync(KEY));
export const loadApiKey = () => SecureStore.getItemAsync(KEY);

interface Cfg { provider: AIProvider; model: string }

async function complete(cfg: Cfg, system: string, user: string, maxTokens = 300): Promise<string | null> {
  if (cfg.provider === 'none') return null;
  const key = await loadApiKey();
  if (!key) return null;
  const model = cfg.model || DEFAULT_MODELS[cfg.provider];
  try {
    if (cfg.provider === 'anthropic') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      return (j.content ?? []).map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text : '')).join('').trim() || null;
    }
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        max_completion_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

/** Réaction de la Déesse à un événement, avec le contexte chiffré du joueur. */
export const goddessReact = (cfg: Cfg, context: string, event: string) =>
  complete(cfg, GODDESS_SYSTEM_PROMPT, `CONTEXTE DU JOUEUR\n${context}\n\nÉVÉNEMENT\n${event}\n\nRéagis.`);

/** Temps de repos adapté. Renvoie des secondes, ou null (on garde alors le repos par défaut). */
export async function suggestRest(cfg: Cfg, exercise: string, defaultSec: number, feeling: string): Promise<{ seconds: number; line: string } | null> {
  const txt = await complete(cfg, GODDESS_SYSTEM_PROMPT,
    `Exercice : ${exercise}. Repos prévu : ${defaultSec} s. Ressenti de la dernière série : ${feeling}. Donne le temps de repos adapté.`);
  if (!txt) return null;
  const m = txt.match(/(\d{2,3})\s*(s|sec|secondes)/i);
  return { seconds: m ? Math.min(300, Math.max(30, parseInt(m[1], 10))) : defaultSec, line: txt };
}

/** Scénario de survie généré à l'infini. */
export async function generateScenario(cfg: Cfg, cat: Category | 'Aléatoire'): Promise<Scenario | null> {
  const txt = await complete(cfg, SCENARIO_SYSTEM_PROMPT, `Catégorie : ${cat}.`, 700);
  if (!txt) return null;
  try {
    const j = JSON.parse(txt.replace(/```json|```/g, '').trim());
    if (!Array.isArray(j.options) || j.options.length < 2) return null;
    return { id: `ai-${Date.now()}`, cat: cat === 'Aléatoire' ? 'Survie' : cat, title: j.title, situation: j.situation, options: j.options };
  } catch {
    return null;
  }
}
