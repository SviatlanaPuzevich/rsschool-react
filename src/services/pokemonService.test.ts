import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { pokemonService } from './pokemonService';
import { server } from '../mocks/server';

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

  it('should get pokemon details by id', async () => {
    const result = await pokemonService.getById(25);

    expect(result).toEqual({
      id: 25,
      name: 'pikachu',
      soundUrl: 'pikachu.mp3',
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
    });
  });

  it('should get pokemon details by string id', async () => {
    const result = await pokemonService.getById('25');

    expect(result.id).toBe(25);
    expect(result.name).toBe('pikachu');
  });

  it('should throw error when getting all pokemons fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    await expect(pokemonService.getAll()).rejects.toThrow(
      'Failed to fetch pokemons',
    );
  });

  it('should throw error when getting pokemon details fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/:id', () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    await expect(pokemonService.getById(25)).rejects.toThrow(
      'Failed to fetch pokemon details',
    );
  });
});
