import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPokemonsCsv,
  downloadPokemonsCsv,
} from './downloadPokemonsCsv.ts';

import type { PokemonDetails } from '../types.ts';

const pikachu: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  soundUrl: 'pikachu.mp3',
  height: 4,
  weight: 60,
  imgUrl: 'pikachu.png',

  abilities: ['static', 'lightning-rod'],

  types: ['electric'],

  sprites: {
    frontDefault: 'pikachu-front.png',
    backDefault: 'pikachu-back.png',
    frontShiny: 'pikachu-shiny-front.png',
    backShiny: 'pikachu-shiny-back.png',
  },

  stats: [
    {
      name: 'hp',
      value: 35,
    },
    {
      name: 'attack',
      value: 55,
    },
    {
      name: 'defense',
      value: 40,
    },
    {
      name: 'special-attack',
      value: 50,
    },
    {
      name: 'special-defense',
      value: 50,
    },
    {
      name: 'speed',
      value: 90,
    },
  ],
};

const bulbasaur: PokemonDetails = {
  id: 1,
  name: 'bulbasaur, "test"',
  soundUrl: 'bulbasaur.mp3',
  height: 7,
  weight: 69,
  imgUrl: 'bulbasaur.png',

  abilities: ['overgrow'],

  types: ['grass', 'poison'],

  sprites: {
    frontDefault: 'bulbasaur-front.png',
    backDefault: 'bulbasaur-back.png',
    frontShiny: 'bulbasaur-shiny-front.png',
    backShiny: 'bulbasaur-shiny-back.png',
  },

  stats: [
    {
      name: 'hp',
      value: 45,
    },
  ],
};

const mockPokemons = [pikachu, bulbasaur];

describe('downloadPokemonsCsv', () => {
  describe('createPokemonsCsv', () => {
    it('should create CSV with correct headers', () => {
      const csv = createPokemonsCsv([pikachu]);

      const lines = csv.split('\n');

      expect(lines[0]).toBe(
        'Name,Description,Details URL,Height,Weight,Types,Abilities,HP,Attack,Defense,Special Attack,Special Defense,Speed'
      );
    });

    it('should create CSV row with pokemon details', () => {
      const csv = createPokemonsCsv([pikachu]);

      const row = csv.split('\n')[1];

      expect(row).toContain('pikachu');
      expect(row).toContain(
        '"Types: electric; Abilities: static, lightning-rod"'
      );
      expect(row).toContain('https://pokeapi.co/api/v2/pokemon/25');
      expect(row).toContain('0.4 m');
      expect(row).toContain('6 kg');

      expect(row).toContain('electric');
      expect(row).toContain('"static, lightning-rod"');

      expect(row).toContain('35,55,40,50,50,90');
    });

    it('should escape quotes and commas in CSV values', () => {
      const csv = createPokemonsCsv([bulbasaur]);

      const row = csv.split('\n')[1];

      expect(row).toContain('"bulbasaur, ""test"""');
    });

    it('should use 0 for missing stats', () => {
      const csv = createPokemonsCsv([bulbasaur]);

      const row = csv.split('\n')[1];

      expect(row).toContain('45,0,0,0,0,0');
    });

    it('should create one row for each pokemon', () => {
      const csv = createPokemonsCsv(mockPokemons);

      const lines = csv.split('\n');

      expect(lines).toHaveLength(3);
      expect(lines[1]).toContain('pikachu');
      expect(lines[2]).toContain('bulbasaur');
    });

    it('should return only headers for an empty array', () => {
      const csv = createPokemonsCsv([]);

      expect(csv).toBe(
        'Name,Description,Details URL,Height,Weight,Types,Abilities,HP,Attack,Defense,Special Attack,Special Defense,Speed'
      );
    });
  });

  describe('downloadPokemonsCsv', () => {
    let createObjectURLSpy: ReturnType<typeof vi.fn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
    let clickSpy: ReturnType<typeof vi.fn>;
    let appendChildSpy: ReturnType<typeof vi.spyOn>;
    let removeChildSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      createObjectURLSpy = vi.fn(() => 'blob:mock-url');
      revokeObjectURLSpy = vi.fn();
      clickSpy = vi.fn();

      vi.stubGlobal('URL', {
        createObjectURL: createObjectURLSpy,
        revokeObjectURL: revokeObjectURLSpy,
      });

      const mockLink = {
        href: '',
        download: '',
        click: clickSpy,
      } as unknown as HTMLAnchorElement;

      vi.spyOn(document, 'createElement').mockImplementation(
        (tagName: string) => {
          if (tagName === 'a') {
            return mockLink;
          }

          return document.createElement(tagName);
        }
      );

      appendChildSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation((node) => node);

      removeChildSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation((node) => node);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('should do nothing when there are no pokemons', () => {
      downloadPokemonsCsv([]);

      expect(createObjectURLSpy).not.toHaveBeenCalled();
      expect(clickSpy).not.toHaveBeenCalled();
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it('should create a Blob with CSV data', () => {
      const blobSpy = vi.spyOn(globalThis, 'Blob');

      downloadPokemonsCsv(mockPokemons);

      expect(blobSpy).toHaveBeenCalledWith(
        [expect.stringContaining('\uFEFFName,Description,Details URL')],
        {
          type: 'text/csv;charset=utf-8;',
        }
      );
    });

    it('should create object URL for the Blob', () => {
      downloadPokemonsCsv(mockPokemons);

      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
    });

    it('should create a download link and click it', () => {
      downloadPokemonsCsv(mockPokemons);

      expect(appendChildSpy).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledTimes(1);
    });

    it('should use the number of pokemons in the filename', () => {
      downloadPokemonsCsv(mockPokemons);

      const link = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;

      expect(link.download).toBe('2_items.csv');
    });

    it('should revoke the object URL after download', () => {
      downloadPokemonsCsv(mockPokemons);

      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
