import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchResult from './SearchResult';
import type { Pokemon } from '../../types.ts';

vi.mock('../pokemonCard/PokemonCard.tsx', () => ({
  default: ({ pokemon }: { pokemon: Pokemon }) => (
    <div data-testid="pokemon-card">{pokemon.name}</div>
  ),
}));

vi.mock('../pagination/Pagination.tsx', () => ({
  default: ({
    count,
    currentPage,
    onPageChange,
  }: {
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <span>
        Page {currentPage} of {count}
      </span>

      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

const pokemons = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'image1',
    abilities: '',
  },
  {
    id: 2,
    name: 'pikachu',
    image: 'image2',
    abilities: '',
  },
];

describe('SearchResult', () => {
  it('renders pokemon list', () => {
    render(<SearchResult pokemons={pokemons} />);

    expect(screen.getByText('List of pokemons')).toBeInTheDocument();

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();

    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('shows empty message when no pokemons', () => {
    render(<SearchResult pokemons={[]} />);

    expect(screen.getByText('No such pokemon')).toBeInTheDocument();
  });

  it('renders error', () => {
    expect(() => render(<SearchResult pokemons={pokemons} error />)).toThrow(
      'This error was generated'
    );
  });

  it('changes page', async () => {
    const manyPokemons = Array.from(
      {
        length: 31,
      },
      (_, index) => ({
        id: index,
        name: `pokemon-${index}`,
        image: '',
        abilities: '',
      })
    );

    render(<SearchResult pokemons={manyPokemons} />);

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByText('Next'));

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });
});
