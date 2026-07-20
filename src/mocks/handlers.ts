import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {

    return HttpResponse.json({
      results: [
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
      ],
    });
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
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
    });
  }),
];
