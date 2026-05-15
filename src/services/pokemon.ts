import type { Pokemon, PokemonDetails } from '../types.ts';

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

    const data = await response.json();

    return data.results.map((item: { name: string; url: string }) => {
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

    const data = await response.json();

    return {
      id: data.id,
      soundUrl: data?.cries?.latest || undefined,
      name: data.name,
      image: this.buildURLToImage(data.id),
      height: data.height,
      weight: data.weight,

      abilities: data.abilities.map((item) => item.ability.name),

      types: data.types.map((item) => item.type.name),
    };
  }
}

export const pokemonService = new PokemonService();
