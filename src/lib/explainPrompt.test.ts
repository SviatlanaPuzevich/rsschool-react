import { describe, it, expect } from 'vitest';
import { buildPrompt, buildExplainContext } from './explainPrompt';
import type { PokemonDetails } from '../types';

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

describe('explainPrompt', () => {
  it('builds an allowlisted context with exact 12 properties', () => {
    const ctx = buildExplainContext(baseDetails);

    expect(Object.keys(ctx).sort()).toEqual(
      [
        'abilities',
        'attack',
        'defense',
        'height',
        'hp',
        'id',
        'name',
        'specialAttack',
        'specialDefense',
        'speed',
        'types',
        'weight',
      ].sort()
    );

    expect(ctx.id).toBe(25);
    expect(ctx.name).toBe('pikachu');
    expect(ctx.types).toEqual(['electric']);
    expect(ctx.hp).toBe(35);
    expect(ctx.specialAttack).toBe(50);
    expect(ctx.abilities).toEqual(['static', 'lightning-rod']);
  });

  it('produces a serializedContext <= 4096 bytes for normal data', () => {
    const { serializedContext, promptText } = buildPrompt(baseDetails, 'en');
    expect(Buffer.byteLength(serializedContext, 'utf8')).toBeLessThanOrEqual(4096);
    expect(promptText).toContain('untrusted data');
    expect(promptText).toContain('Use only the supplied facts');
  });

  it('includes requested locale in the prompt instructions', () => {
    const { promptText } = buildPrompt(baseDetails, 'ru');
    expect(promptText).toContain('in the language "ru"');
  });

  it('includes beginner-friendly and factual instructions in prompt', () => {
    const { promptText } = buildPrompt(baseDetails, 'en');
    expect(promptText).toContain('beginner-friendly');
    expect(promptText).toContain('factual');
    expect(promptText).toContain('Use only the supplied facts');
  });

  it('deterministically trims oversized context', () => {
    // create a details with very large abilities and types and long name
    const hugeDetails: PokemonDetails = {
      ...baseDetails,
      name: 'p'.repeat(2000),
      abilities: Array.from({ length: 200 }, (_, i) => `ability-${i}-${'x'.repeat(200)}`),
      types: Array.from({ length: 50 }, (_, i) => `type-${i}`),
    };

    const first = buildPrompt(hugeDetails, 'en');
    const second = buildPrompt(hugeDetails, 'en');

    expect(Buffer.byteLength(first.serializedContext, 'utf8')).toBeLessThanOrEqual(4096);
    expect(first.serializedContext).toBe(second.serializedContext); // deterministic

    // ensure only allowlisted keys present when parsed
    const parsed = JSON.parse(first.serializedContext);
    expect(Object.keys(parsed).includes('abilities')).toBeTruthy();
    expect(Object.keys(parsed).includes('types')).toBeTruthy();
    expect(parsed.id).toBeDefined();
  });

  it('excludes unrelated fields from serialized context', () => {
    const { serializedContext } = buildPrompt(baseDetails, 'en');
    const parsed = JSON.parse(serializedContext);

    // These fields must not be present in the serialized context
    expect(parsed.soundUrl).toBeUndefined();
    expect(parsed.imgUrl).toBeUndefined();
    expect(parsed.sprites).toBeUndefined();
  });

  it('falls back to minimal object if trimming cannot satisfy size', () => {
    // craft an artificial extremely large name that will still cause trouble
    const monsterName = '好'.repeat(5000); // multi-byte
    const monster: PokemonDetails = { ...baseDetails, name: monsterName, abilities: ['a'.repeat(2000)], types: ['t'.repeat(2000)] };

    const result = buildPrompt(monster, 'en');
    expect(Buffer.byteLength(result.serializedContext, 'utf8')).toBeLessThanOrEqual(4096);
    const parsed = JSON.parse(result.serializedContext);
    // minimal fallback includes id and name (possibly short)
    expect(parsed.id).toBeDefined();
    expect(parsed.name !== undefined).toBeTruthy();
  });
});
