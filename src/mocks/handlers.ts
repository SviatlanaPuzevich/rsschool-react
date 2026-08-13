import { http, HttpResponse } from 'msw';

const pokemons = [
  {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  },
  {
    name: 'ivysaur',
    url: 'https://pokeapi.co/api/v2/pokemon/2/',
  },
  {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/',
  },
];

const pokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,

  cries: {
    latest: 'pikachu.mp3',
  },

  abilities: [
    {
      ability: {
        name: 'static',
      },
    },
    {
      ability: {
        name: 'lightning-rod',
      },
    },
  ],

  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],

  sprites: {
    front_default: 'pikachu-front.png',
    back_default: 'pikachu-back.png',
    front_shiny: 'pikachu-front-shiny.png',
    back_shiny: 'pikachu-back-shiny.png',
  },

  stats: [
    {
      base_stat: 35,
      stat: {
        name: 'hp',
      },
    },
    {
      base_stat: 55,
      stat: {
        name: 'attack',
      },
    },
    {
      base_stat: 40,
      stat: {
        name: 'defense',
      },
    },
    {
      base_stat: 50,
      stat: {
        name: 'special-attack',
      },
    },
    {
      base_stat: 50,
      stat: {
        name: 'special-defense',
      },
    },
    {
      base_stat: 90,
      stat: {
        name: 'speed',
      },
    },
  ],
};

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json({
      results: pokemons,
    });
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
    return HttpResponse.json({
      ...pokemonDetails,
      id: Number(params.id),
    });
  }),
];
