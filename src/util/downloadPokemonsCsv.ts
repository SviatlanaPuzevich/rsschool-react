import type { PokemonDetails } from '@/types';

export const downloadPokemonsCsv = async (
  pokemons: PokemonDetails[]
): Promise<void> => {
  if (pokemons.length === 0) {
    return;
  }

  const response = await fetch('/api/pokemons/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pokemons),
  });

  if (!response.ok) {
    throw new Error('Failed to generate CSV');
  }

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = `${pokemons.length}_items.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
