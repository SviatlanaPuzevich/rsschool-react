import { NextRequest, NextResponse } from 'next/server';
import type { PokemonDetails } from '@/types';

const CSV_HEADERS = [
  'Name',
  'Description',
  'Details URL',
  'Height',
  'Weight',
  'Types',
  'Abilities',
  'HP',
  'Attack',
  'Defense',
  'Special Attack',
  'Special Defense',
  'Speed',
];

const escapeCsvValue = (value: string | number): string => {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const getStatValue = (details: PokemonDetails, statName: string): number => {
  return details.stats.find((stat) => stat.name === statName)?.value ?? 0;
};

const detailsToCsvRow = (details: PokemonDetails): string => {
  const description = [
    `Types: ${details.types.join(', ')}`,
    `Abilities: ${details.abilities.join(', ')}`,
  ].join('; ');

  const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${details.id}`;

  const values = [
    details.name,
    description,
    detailsUrl,
    `${details.height / 10} m`,
    `${details.weight / 10} kg`,
    details.types.join(', '),
    details.abilities.join(', '),
    getStatValue(details, 'hp'),
    getStatValue(details, 'attack'),
    getStatValue(details, 'defense'),
    getStatValue(details, 'special-attack'),
    getStatValue(details, 'special-defense'),
    getStatValue(details, 'speed'),
  ];

  return values.map(escapeCsvValue).join(',');
};

const createPokemonsCsv = (pokemons: PokemonDetails[]): string => {
  const rows = pokemons.map(detailsToCsvRow);

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export async function POST(request: NextRequest) {
  try {
    const pokemons = (await request.json()) as PokemonDetails[];

    if (!Array.isArray(pokemons) || pokemons.length === 0) {
      return NextResponse.json(
        { error: 'No Pokémon selected' },
        { status: 400 }
      );
    }

    const csv = createPokemonsCsv(pokemons);

    return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${pokemons.length}_items.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
