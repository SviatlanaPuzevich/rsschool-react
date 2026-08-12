import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import SearchPage from './SearchPage';
import { pokemonService } from '../../services/pokemonService';
import type { Pokemon } from '../../types';

vi.mock('../../services/pokemonService', () => ({
  pokemonService: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../components/loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../components/error/Alert', () => ({
  default: ({ message }: { message?: string }) => (
    <div data-testid="alert">{message}</div>
  ),
}));

vi.mock('../../components/searchResult/SearchResult', () => ({
  default: ({ pokemons, error }: { pokemons: Pokemon[]; error?: boolean }) => (
    <div data-testid="search-result">
      {error && <span>Error generated</span>}

      {pokemons.map((pokemon) => (
        <div key={pokemon.id}>{pokemon.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../../components/searchBar/SearchBar', () => ({
  default: ({
    query,
    onQueryChange,
    onSearch,
    onError,
  }: {
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
    onError: () => void;
  }) => (
    <div>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      <button onClick={onSearch}>Search</button>
      <button onClick={onError}>Generate error</button>
    </div>
  ),
}));

const pokemons: Pokemon[] = [
  {
    id: 1,
    name: 'pikachu',
    image: '',
  },
  {
    id: 2,
    name: 'pidgey',
    image: '',
  },
  {
    id: 3,
    name: 'bulbasaur',
    image: '',
  },
];

const renderSearchPage = () =>
  render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>
  );

const searchButton = () => screen.getByRole('button', { name: 'Search' });

const errorButton = () =>
  screen.getByRole('button', { name: 'Generate error' });

const searchInput = () => screen.getByRole('textbox');

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show loader while loading pokemons', () => {
    vi.mocked(pokemonService.getAll).mockReturnValue(new Promise(() => {}));

    renderSearchPage();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should load and display pokemons', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    renderSearchPage();

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('pidgey')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('should filter pokemons after search submit', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    renderSearchPage();

    await screen.findByText('pikachu');

    await user.type(searchInput(), 'pik');
    await user.click(searchButton());

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.queryByText('pidgey')).not.toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('should save normalized search query to localStorage', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    renderSearchPage();

    await screen.findByText('pikachu');

    await user.type(searchInput(), '  PIKACHU  ');
    await user.click(searchButton());

    expect(localStorage.getItem('query')).toBe(JSON.stringify('pikachu'));
  });

  it('should show error message when api fails', async () => {
    vi.mocked(pokemonService.getAll).mockRejectedValue(new Error('API error'));

    renderSearchPage();

    expect(await screen.findByTestId('alert')).toHaveTextContent('API error');

    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  it('should pass generated error to SearchResult', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    renderSearchPage();

    await screen.findByText('pikachu');

    await user.click(errorButton());

    expect(screen.getByText('Error generated')).toBeInTheDocument();
  });
});
