import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { PokemonDetails } from '../../types';
import { explainCache } from '../../lib/explainCache';
import { explainPokemon } from './explainPokemon';
import { pokemonService } from '../../services/pokemonService';

type MockGeminiError = {
  statusCode?: number;
  code?: number;
  status?: number;
  blocked?: boolean;
  type?: string;
};

type MockFormDataLike = {
  get: (key: string) => string | null | undefined;
};

const baseDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  soundUrl: 'pikachu.mp3',
  imgUrl: 'https://example.com/pikachu.png',
  height: 4,
  weight: 60,
  abilities: ['static', 'lightning-rod'],
  types: ['electric'],
  sprites: {
    frontDefault: 'pikachu-front.png',
    backDefault: 'pikachu-back.png',
    frontShiny: 'pikachu-front-shiny.png',
    backShiny: 'pikachu-back-shiny.png',
  },
  stats: [
    { name: 'hp', value: 35 },
    { name: 'attack', value: 55 },
    { name: 'defense', value: 40 },
    { name: 'special-attack', value: 50 },
    { name: 'special-defense', value: 50 },
    { name: 'speed', value: 90 },
  ],
};

vi.mock('@google/genai', () => {
  class MockGoogleGenAI {
    static __mockText: string | null = null;
    static __mockError: MockGeminiError | null = null;
    static __mockBlocked = false;
    static __mockEmpty = false;

    models: {
      generateContent: () => Promise<{ blocked?: boolean; text?: string }>; 
    };

    constructor() {
      this.models = {
        generateContent: async () => {
          if (MockGoogleGenAI.__mockError) throw MockGoogleGenAI.__mockError;
          if (MockGoogleGenAI.__mockBlocked) return { blocked: true };
          if (MockGoogleGenAI.__mockEmpty) return { text: '' };
          return { text: MockGoogleGenAI.__mockText ?? 'mock explanation' };
        },
      };
    }
  }

  return {
    GoogleGenAI: MockGoogleGenAI,
  };
});

describe('explainPokemon Server Action', () => {
  beforeEach(() => {
    explainCache.clear();
    vi.resetAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('returns success and caches result on successful Gemini response', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };

    const result = await explainPokemon({ status: 'idle' }, formData);

    expect(result.status).toBe('success');
    if (result.status === 'success') {
      expect(result.explanation).toBe('mock explanation');
    }

    vi.spyOn(pokemonService, 'getById').mockClear();

    const second = await explainPokemon({ status: 'idle' }, formData);
    expect(second.status).toBe('success');
    if (second.status === 'success') {
      expect(second.explanation).toBe('mock explanation');
    }
  });

  it('respects regenerate flag (bypasses cache and replaces on success)', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);
    const MockGoogleGenAI = (await import('@google/genai')).GoogleGenAI as {
      __mockText: string | null;
    };
    MockGoogleGenAI.__mockText = 'first';

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };
    const r1 = await explainPokemon({ status: 'idle' }, formData);
    expect(r1.status).toBe('success');

    MockGoogleGenAI.__mockText = 'second';
    const formDataReg: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'true'),
    };
    const r2 = await explainPokemon({ status: 'idle' }, formDataReg);
    expect(r2.status).toBe('success');
    if (r2.status === 'success') expect(r2.explanation).toBe('second');
  });

  it('returns explainMissingApiKey when API key missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : 'en'),
    };
    const result = await explainPokemon({ status: 'idle' }, formData);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainMissingApiKey');
  });

  it('maps auth error to explainAuth', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);
    const MockGoogleGenAI = (await import('@google/genai')).GoogleGenAI as {
      __mockError: MockGeminiError | null;
    };
    MockGoogleGenAI.__mockError = { statusCode: 401 };

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };
    const result = await explainPokemon({ status: 'idle' }, formData);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainAuth');

    MockGoogleGenAI.__mockError = null;
  });

  it('maps 429 to explainRateLimit', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);
    const MockGoogleGenAI = (await import('@google/genai')).GoogleGenAI as {
      __mockError: MockGeminiError | null;
    };
    MockGoogleGenAI.__mockError = { statusCode: 429 };

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };
    const result = await explainPokemon({ status: 'idle' }, formData);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainRateLimit');

    MockGoogleGenAI.__mockError = null;
  });

  it('maps blocked response to explainBlocked', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);
    const MockGoogleGenAI = (await import('@google/genai')).GoogleGenAI as {
      __mockBlocked: boolean;
    };
    MockGoogleGenAI.__mockBlocked = true;

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };
    const result = await explainPokemon({ status: 'idle' }, formData);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainBlocked');

    MockGoogleGenAI.__mockBlocked = false;
  });

  it('maps empty response to explainEmpty', async () => {
    vi.spyOn(pokemonService, 'getById').mockResolvedValue(baseDetails);
    const MockGoogleGenAI = (await import('@google/genai')).GoogleGenAI as {
      __mockEmpty: boolean;
    };
    MockGoogleGenAI.__mockEmpty = true;

    const formData: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? '25' : key === 'locale' ? 'en' : 'false'),
    };
    const result = await explainPokemon({ status: 'idle' }, formData);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainEmpty');

    MockGoogleGenAI.__mockEmpty = false;
  });

  it('returns explainInvalidInput for bad id or locale', async () => {
    const badId: MockFormDataLike = {
      get: (key: string) => (key === 'id' ? 'abc' : key === 'locale' ? 'zz' : 'false'),
    };
    const result = await explainPokemon({ status: 'idle' }, badId);
    expect(result.status).toBe('error');
    if (result.status === 'error') expect(result.error).toBe('explainInvalidInput');
  });
});
