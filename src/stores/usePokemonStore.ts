import { create } from 'zustand';
import { pokemonService } from '../services/pokemonService.ts';
import { ERROR_MESSAGE } from '../constants/messages.ts';
import { downloadPokemonsCsv } from '../util/downloadPokemonsCsv.ts';

interface PokemonState {
  selectedPokemons: (string | number)[];
  selectPokemon: (id: string | number) => void;
  unselectPokemon: (id: string | number) => void;
  resetSelected: () => void;

  isDownloading: boolean;
  downloadSelectedPokemons: () => Promise<void>;
}

const usePokemonStore = create<PokemonState>((set, get) => ({
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
