import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SearchResult from './SearchResult';
import type { Pokemon } from '../../types';

const createPokemons = (count: number): Pokemon[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `pokemon-${index + 1}`,
    image: `https://pokeapi.co/api/v2/pokemon/${index + 1}`,
  }));

describe('SearchResult component', () => {
  it('should render pokemon list', () => {
    const pokemons = createPokemons(5);

    render(
      <MemoryRouter>
        <SearchResult pokemons={pokemons} />
      </MemoryRouter>
    );

    expect(screen.getByText('List of pokemons')).toBeInTheDocument();

    expect(screen.getByText('pokemon-1')).toBeInTheDocument();

    expect(screen.getByText('pokemon-5')).toBeInTheDocument();
  });

  it('should show only pokemons from current page', () => {
    const pokemons = createPokemons(15);

    render(
      <MemoryRouter initialEntries={['/search?page=2']}>
        <SearchResult pokemons={pokemons} />
      </MemoryRouter>
    );

    expect(screen.getByText('pokemon-6')).toBeInTheDocument();

    expect(screen.getByText('pokemon-10')).toBeInTheDocument();

    expect(screen.queryByText('pokemon-1')).not.toBeInTheDocument();

    expect(screen.queryByText('pokemon-11')).not.toBeInTheDocument();
  });

  it('should show first page when page param is missing', () => {
    const pokemons = createPokemons(10);

    render(
      <MemoryRouter>
        <SearchResult pokemons={pokemons} />
      </MemoryRouter>
    );

    expect(screen.getByText('pokemon-1')).toBeInTheDocument();

    expect(screen.getByText('pokemon-5')).toBeInTheDocument();

    expect(screen.queryByText('pokemon-6')).not.toBeInTheDocument();
  });

  it('should show empty message when no pokemons found', () => {
    render(
      <MemoryRouter>
        <SearchResult pokemons={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('No such pokemon')).toBeInTheDocument();
  });

  it('should throw error when error prop is true', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <SearchResult pokemons={[]} error />
        </MemoryRouter>
      )
    ).toThrow('This error was generated');
  });

  it('should render pagination with correct page count', () => {
    const pokemons = createPokemons(32);

    render(
      <MemoryRouter>
        <SearchResult pokemons={pokemons} />
      </MemoryRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
