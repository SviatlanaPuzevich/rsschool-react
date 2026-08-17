import type { PokemonDetails } from '../types.ts';

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

export const createPokemonsCsv = (pokemons: PokemonDetails[]): string => {
  const rows = pokemons.map(detailsToCsvRow);

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export const downloadPokemonsCsv = (pokemons: PokemonDetails[]): void => {
  if (pokemons.length === 0) {
    return;
  }

  const csv = createPokemonsCsv(pokemons);

  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = `${pokemons.length}_items.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
