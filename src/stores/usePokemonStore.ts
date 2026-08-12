import { create } from 'zustand';
import { pokemonService } from '../services/pokemonService.ts';
import type { Pokemon, PokemonDetails } from '../types.ts';
import { ERROR_MESSAGE } from '../constants/messages.ts';
import { downloadPokemonsCsv } from '../util/downloadPokemonsCsv.ts';

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
  resetSelected: () => void;

  isDownloading: boolean;
  downloadSelectedPokemons: () => Promise<void>;
}

const usePokemonStore = create<PokemonState>((set, get) => ({
  pokemons: [],
  isLoading: false,
  error: null,

  fetchPokemons: async () => {
    set({ isLoading: true, error: null });

    try {
      const pokemons = await pokemonService.getAll();

      set({ pokemons });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : ERROR_MESSAGE.SERVER_ERROR,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  pokemonDetails: null,
  pokemonDetailsError: null,
  isDetailsLoading: false,

  fetchPokemonDetailsById: async (id: string) => {
    if (!id) {
      return;
    }

    set({
      isDetailsLoading: true,
      pokemonDetailsError: null,
    });

    try {
      const pokemon = await pokemonService.getById(id);

      set({
        pokemonDetails: pokemon,
      });
    } catch (error: unknown) {
      set({
        pokemonDetailsError:
          error instanceof Error ? error.message : ERROR_MESSAGE.SERVER_ERROR,
      });
    } finally {
      set({
        isDetailsLoading: false,
      });
    }
  },

  selectedPokemons: [],

  selectPokemon: (id) =>
    set((state) => {
      if (state.selectedPokemons.includes(id)) {
        return state;
      }

      return {
        selectedPokemons: [...state.selectedPokemons, id],
      };
    }),

  unselectPokemon: (id) =>
    set((state) => ({
      selectedPokemons: state.selectedPokemons.filter(
        (pokemonId) => pokemonId !== id
      ),
    })),

  resetSelected: () => {
    set({
      selectedPokemons: [],
    });
  },

  isDownloading: false,

  downloadSelectedPokemons: async () => {
    const { selectedPokemons } = get();

    if (selectedPokemons.length === 0) {
      return;
    }

    set({
      isDownloading: true,
    });

    try {
      const details = await Promise.all(
        selectedPokemons.map((id) => pokemonService.getById(id))
      );

      downloadPokemonsCsv(details);

      set({
        selectedPokemons: [],
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : ERROR_MESSAGE.SERVER_ERROR,
      });
    } finally {
      set({
        isDownloading: false,
      });
    }
  },
}));

export default usePokemonStore;
