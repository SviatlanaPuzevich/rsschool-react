import { create } from 'zustand';
import { pokemonService } from '../services/pokemon.ts';
import type { Pokemon, PokemonDetails } from '../types.ts';
import { ERROR_MESSAGE } from '../constants/messages.ts';

interface PokemonState {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: string | null;
  fetchPokemons: () => Promise<void>;

  pokemonDetails: PokemonDetails | null;
  pokemonDetailsError: string | null;
  isDetailsLoading: boolean;
  fetchPokemonDetailsById: (id: string) => Promise<void>;

  selectedPokemons: (string | number)[];
  selectPokemon: (id: string | number) => void;
  unselectPokemon: (id: string | number) => void;
}

const usePokemonStore = create<PokemonState>((set) => ({
  pokemons: [],
  isLoading: false,
  error: null,

  fetchPokemons: async () => {
    set({ isLoading: true, error: null });
    try {
      const pokemons = await pokemonService.getAll();
      set({ pokemons, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : ERROR_MESSAGE.SERVER_ERROR,
        isLoading: false,
      });
    }
  },

  pokemonDetails: null,
  pokemonDetailsError: null,
  isDetailsLoading: false,

  fetchPokemonDetailsById: async (id: string) => {
    if (!id) return;

    set({ isDetailsLoading: true, pokemonDetailsError: null });
    try {
      const pokemon = await pokemonService.getById(id);
      set({ pokemonDetails: pokemon, isDetailsLoading: false });
    } catch (error: unknown) {
      set({
        pokemonDetailsError:
          error instanceof Error ? error.message : ERROR_MESSAGE.SERVER_ERROR,
        isDetailsLoading: false,
      });
    }
  },

  selectedPokemons: [],

  selectPokemon: (id: string | number) =>
    set((state) => ({
      selectedPokemons: [...state.selectedPokemons, id],
    })),

  unselectPokemon: (id: string | number) =>
    set((state) => ({
      selectedPokemons: state.selectedPokemons.filter(
        (pokemonId) => pokemonId !== id
      ),
    })),
}));

export default usePokemonStore;
