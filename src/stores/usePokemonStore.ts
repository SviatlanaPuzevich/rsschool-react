import { create } from 'zustand';

interface PokemonState {
  selectedPokemons: (string | number)[];
  selectPokemon: (id: string | number) => void;
  unselectPokemon: (id: string | number) => void;
  resetSelected: () => void;
}

const usePokemonStore = create<PokemonState>((set) => ({
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

  resetSelected: () => {
    set({ selectedPokemons: [] });
  },
}));

export default usePokemonStore;
