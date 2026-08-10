import type { Pokemon, PokemonDetails } from '../types.ts';

type PokemonApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;

  cries: {
    latest: string;
  };

  abilities: {
    ability: {
      name: string;
    };
  }[];

  types: {
    type: {
      name: string;
    };
  }[];

  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };

  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};

type AllPokemonsApiResponse = {
  results: [{ name: string; url: string }];
};

const BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonService {
  private getIdFromURL(url: string): number {
    return Number(url.split('/').filter(Boolean).pop());
  }

  private buildURLToImage(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  async getAll(limit = 1200): Promise<Pokemon[]> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch pokemons');
    }

    const data: AllPokemonsApiResponse = await response.json();

    return data.results.map((item) => {
      const id = this.getIdFromURL(item.url);

      return {
        id,
        name: item.name,
        image: this.buildURLToImage(id),
        abilities: '',
      };
    });
  }

  async getById(id: number | string): Promise<PokemonDetails> {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch pokemon details');
    }

    const data: PokemonApiResponse = await response.json();

    return {
      id: data.id,
      name: data.name,
      soundUrl: data.cries.latest,
      height: data.height,
      weight: data.weight,

      abilities: data.abilities.map((item) => item.ability.name),

      types: data.types.map((item) => item.type.name),

      sprites: {
        frontDefault: data.sprites.front_default,
        backDefault: data.sprites.back_default,
        frontShiny: data.sprites.front_shiny,
        backShiny: data.sprites.back_shiny,
      },

      stats: data.stats.map((item) => ({
        name: item.stat.name,
        value: item.base_stat,
      })),
    };
  }
}

export const pokemonService = new PokemonService();
