'use server';

import { createPokemonsCsv } from '@/lib/pokemonsCsv';
import type { ExportCsvState } from '@/lib/exportCsvState';
import { pokemonService } from '@/services/pokemonService';

const MAX_ITEMS = 200;

export async function exportPokemonsCsv(
  _prevState: ExportCsvState,
  formData: FormData
): Promise<ExportCsvState> {
  const ids = String(formData.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_ITEMS);

  if (ids.length === 0) {
    return { status: 'error', error: 'downloadFailed' };
  }

  try {
    const pokemons = await Promise.all(
      ids.map((id) => pokemonService.getById(id))
    );

    // The BOM keeps Excel happy with the UTF-8 encoded content.
    return {
      status: 'success',
      csv: `﻿${createPokemonsCsv(pokemons)}`,
      filename: `${pokemons.length}_items.csv`,
    };
  } catch (error) {
    console.error('Failed to generate CSV:', error);

    return { status: 'error', error: 'downloadFailed' };
  }
}
