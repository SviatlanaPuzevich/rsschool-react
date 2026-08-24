import type { PokemonDetails } from '@/types';

export const CSV_HEADERS = [
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

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const getStatValue = (details: PokemonDetails, statName: string): number =>
  details.stats.find((stat) => stat.name === statName)?.value ?? 0;

const detailsToCsvRow = (details: PokemonDetails): string => {
  const description = [
    `Types: ${details.types.join(', ')}`,
    `Abilities: ${details.abilities.join(', ')}`,
  ].join('; ');

  const values = [
    details.name,
    description,
    `https://pokeapi.co/api/v2/pokemon/${details.id}`,
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

export const createPokemonsCsv = (pokemons: PokemonDetails[]): string =>
  [CSV_HEADERS.join(','), ...pokemons.map(detailsToCsvRow)].join('\n');
