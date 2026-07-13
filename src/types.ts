export type Pokemon = {
  id: number;
  name: string;
  image: string;
  abilities: string;
};

export interface PokemonDetails {
  id: number;
  name: string;
  soundUrl: string;
  height: number;
  weight: number;
  abilities: string[];
  types: string[];
}
