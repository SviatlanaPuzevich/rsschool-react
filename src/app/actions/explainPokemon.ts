'use server';

import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';
import { pokemonService } from '../../services/pokemonService';
import { buildPrompt } from '../../lib/explainPrompt';
import { explainCache } from '../../lib/explainCache';
import type { ExplainState, ExplainErrorKey } from '../../lib/explainState';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const ALLOWED_LOCALES = ['en', 'ru'] as const;

type GeminiErrorLike = {
  statusCode?: number;
  code?: number;
  status?: number;
  blocked?: boolean;
  type?: string;
};

type GeminiResponseLike = Pick<GenerateContentResponse, 'text'> & {
  blocked?: boolean;
  type?: string;
};

function mapErrorToKey(err: unknown): ExplainErrorKey {
  if (!process.env.GEMINI_API_KEY) return 'explainMissingApiKey';
  if (!err) return 'explainGeneric';

  const errorLike = err as GeminiErrorLike;
  const status = errorLike.statusCode ?? errorLike.code ?? errorLike.status;
  if (status === 401) return 'explainAuth';
  if (status === 429) return 'explainRateLimit';
  if (errorLike.blocked === true || errorLike.type === 'blocked') return 'explainBlocked';

  return 'explainGeneric';
}

export async function explainPokemon(
  _prevState: ExplainState,
  formData: FormData
): Promise<ExplainState> {
  try {
    const idRaw = String(formData.get('id') ?? '');
    const locale = String(formData.get('locale') ?? '');
    const regenerate = String(formData.get('regenerate') ?? 'false') === 'true';

    const id = Number(idRaw);

    if (!id || Number.isNaN(id) || !ALLOWED_LOCALES.includes(locale as 'en' | 'ru')) {
      return { status: 'error', error: 'explainInvalidInput' };
    }

    const cached = explainCache.get(id, locale);
    if (cached && !regenerate) {
      return { status: 'success', explanation: cached.explanation };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { status: 'error', error: 'explainMissingApiKey' };
    }

    const details = await pokemonService.getById(id);
    const { promptText, serializedContext } = buildPrompt(details, locale);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: `${promptText}\n\nContext:\n${serializedContext}`,
        config: {
          maxOutputTokens: 512,
        },
      });

      const responseLike = response as GeminiResponseLike;
      if (responseLike.blocked === true || responseLike.type === 'blocked') {
        return { status: 'error', error: 'explainBlocked' };
      }

      const text = responseLike.text ?? response.text;
      if (!text || String(text).trim() === '') {
        return { status: 'error', error: 'explainEmpty' };
      }

      const resultText = String(text).trim();
      explainCache.set(id, locale, resultText);
      return { status: 'success', explanation: resultText };
    } catch (err) {
      const mapped = mapErrorToKey(err);
      console.error('Explain with AI failed:', err);
      return { status: 'error', error: mapped };
    }
  } catch (err) {
    console.error('Unexpected explainPokemon error:', err);
    return { status: 'error', error: 'explainGeneric' };
  }
}
