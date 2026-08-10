export type Pokemon = {
  id: number;
  name: string;
  image: string;
  abilities?: string;
};

export interface PokemonStats {
  name: string;
  value: number;
}

export interface PokemonSprites {
  frontDefault: string | null;
  backDefault: string | null;
  frontShiny: string | null;
  backShiny: string | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  soundUrl: string;
  height: number;
  weight: number;
  abilities: string[];
  types: string[];
  sprites: PokemonSprites;
  stats: PokemonStats[];
}
