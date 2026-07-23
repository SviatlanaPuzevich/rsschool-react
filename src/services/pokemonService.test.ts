import { describe, expect, it } from 'vitest';
import { pokemonService } from './pokemonService';
import { server } from '../mocks/server.ts';
import { http, HttpResponse } from 'msw';

describe('PokemonService', () => {
  it('should get all pokemons', async () => {
    const result = await pokemonService.getAll();

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
      {
        id: 25,
        name: 'pikachu',
        image:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        abilities: '',
      },
    ]);
  });

  it('should get pokemon by id', async () => {
    const result = await pokemonService.getById(25);

    expect(result).toEqual({
      id: 25,
      name: 'pikachu',
      soundUrl: 'pikachu.mp3',
      height: 4,
      weight: 60,
      abilities: ['static', 'lightning-rod'],
      types: ['electric'],
    });
  });

  it('should throw error when API fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, {
          status: 500,
        });
      })
    );

    await expect(pokemonService.getAll()).rejects.toThrow(
      'Failed to fetch pokemons'
    );
  });
});
