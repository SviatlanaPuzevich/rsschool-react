import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SearchResult from './SearchResult';
import { SEARCH_RESULT } from '../../constants/messages.ts';
import type { Pokemon } from '../../types.ts';

vi.mock('../../constants/layout.ts', () => ({
  POKEMON_NUMBER_ON_PAGE: 2,
}));

vi.mock('../../constants/messages.ts', () => ({
  SEARCH_RESULT: {
    NOT_FOUND: 'No pokemons found',
  },
}));

vi.mock('../pokemonItem/PokemonItem.tsx', () => ({
  default: ({ pokemon }: { pokemon: Pokemon }) => (
    <div data-testid="pokemon-item">{pokemon.name}</div>
  ),
}));

vi.mock('../pagination/Pagination.tsx', () => ({
  default: ({ count }: { count: number }) => (
    <div data-testid="pagination">Pages: {count}</div>
  ),
}));

const mockPokemons = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
  { id: 5, name: 'Charmeleon' },
];

const renderWithRouter = (pokemons: Pokemon[], initialPage = 1) => {
  return render(
    <MemoryRouter initialEntries={[`/search/${initialPage}`]}>
      <Routes>
        <Route
          path="/search/:page"
          element={<SearchResult pokemons={pokemons} />}
        />
        <Route path="/search" element={<SearchResult pokemons={pokemons} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SearchResult Component', () => {
  it('should display "Not Found" message if the pokemon list is empty', () => {
    renderWithRouter([]);

    expect(screen.getByText(SEARCH_RESULT.NOT_FOUND)).toBeInTheDocument();
    expect(screen.queryByText('List of pokemons')).not.toBeInTheDocument();
  });

  it('should display the heading and correct number of pokemons for the first page (default value)', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route
            path="/search"
            element={<SearchResult pokemons={mockPokemons} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('List of pokemons')).toBeInTheDocument();

    const items = screen.getAllByTestId('pokemon-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Bulbasaur');
    expect(items[1]).toHaveTextContent('Ivysaur');
  });

  it('should correctly slice the pokemons array for the second page', () => {
    renderWithRouter(mockPokemons, 2);

    const items = screen.getAllByTestId('pokemon-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Venusaur');
    expect(items[1]).toHaveTextContent('Charmander');
  });

  it('should pass the correct page count to the pagination component', () => {
    renderWithRouter(mockPokemons, 1);

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveTextContent('Pages: 3');
  });
});
