import { create } from 'zustand';

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

    set({ isDownloading: true });

    try {
      const response = await fetch('/api/pokemons/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pokemonIds: selectedPokemons,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `${selectedPokemons.length}_items.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } finally {
      set({ isDownloading: false });
    }
  },
}));

export default usePokemonStore;
