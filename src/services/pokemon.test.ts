import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pokemonService } from './pokemon.ts';

const globalFetchMock = vi.fn();
vi.stubGlobal('fetch', globalFetchMock);

describe('PokemonService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAll', () => {
    it('should successfully return a list of pokemons with formatted data', async () => {
      const mockApiResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      globalFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await pokemonService.getAll(2);

      expect(globalFetchMock).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=2'
      );

      expect(result).toEqual([
        {
          id: 1,
          name: 'bulbasaur',
          image:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          abilities: '',
        },
        {
          id: 2,
          name: 'ivysaur',
          image:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
          abilities: '',
        },
      ]);
    });

    it('should call fetch with a default limit of 1200 if no parameter is provided', async () => {
      globalFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await pokemonService.getAll();

      expect(globalFetchMock).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1200'
      );
    });

    it('should throw an error if the request fails (ok: false)', async () => {
      globalFetchMock.mockResolvedValueOnce({
        ok: false,
      });

      await expect(pokemonService.getAll()).rejects.toThrow(
        'Failed to fetch pokemons'
      );
    });
  });

  describe('getById', () => {
    it('should successfully return detailed information about a pokemon', async () => {
      const mockPokemonDetailsResponse = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        cries: {
          latest: 'https://cries-url/25.ogg',
        },
        abilities: [
          { ability: { name: 'static' } },
          { ability: { name: 'lightning-rod' } },
        ],
        types: [{ type: { name: 'electric' } }],
      };

      globalFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetailsResponse,
      });

      const result = await pokemonService.getById(25);

      expect(globalFetchMock).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/25'
      );

      expect(result).toEqual({
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        soundUrl: 'https://cries-url/25.ogg',
        imgUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        abilities: ['static', 'lightning-rod'],
        types: ['electric'],
      });
    });

    it('should handle ID correctly when passed as a string', async () => {
      globalFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 25,
          name: 'pikachu',
          cries: { latest: '' },
          abilities: [],
          types: [],
        }),
      });

      const result = await pokemonService.getById('25');

      expect(globalFetchMock).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/25'
      );
      expect(result.imgUrl).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
      );
    });

    it('should throw an error if the pokemon details are not found or server errors', async () => {
      globalFetchMock.mockResolvedValueOnce({
        ok: false,
      });

      await expect(pokemonService.getById(999)).rejects.toThrow(
        'Failed to fetch pokemon details'
      );
    });
  });
});
