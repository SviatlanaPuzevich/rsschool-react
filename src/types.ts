export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  soundUrl: string;
  image: string;
  height: number;
  weight: number;
  abilities: string[];
  types: string[];
}
