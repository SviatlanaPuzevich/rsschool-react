import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchPage from './SearchPage';
import { pokemonService } from '../../services/pokemonService';

import { MemoryRouter } from 'react-router-dom';

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
  default: ({ pokemons, error }: { pokemons: unknown[]; error?: boolean }) => (
    <div data-testid="search-result">
      {error && <span>Error generated</span>}

      {pokemons.map((pokemon: Pokemon) => (
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
      <input value={query} onChange={(e) => onQueryChange(e.target.value)} />

      <button onClick={onSearch}>Search</button>

      <button onClick={onError}>Generate error</button>
    </div>
  ),
}));

const pokemons = [
  {
    id: 1,
    name: 'pikachu',
  },
  {
    id: 2,
    name: 'pidgey',
  },
  {
    id: 3,
    name: 'bulbasaur',
  },
];

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show loader while loading pokemons', () => {
    vi.mocked(pokemonService.getAll).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should load and display pokemons', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('should filter pokemons after search submit', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');

    await user.type(input, 'pik');

    await user.click(
      screen.getByRole('button', {
        name: 'Search',
      })
    );

    expect(screen.getByText('pikachu')).toBeInTheDocument();

    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('should save search query to localStorage', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    await user.type(screen.getByRole('textbox'), 'pikachu');

    await user.click(
      screen.getByRole('button', {
        name: 'Search',
      })
    );

    expect(localStorage.getItem('query')).toBe(JSON.stringify('pikachu'));
  });

  it('should show error message when api fails', async () => {
    vi.mocked(pokemonService.getAll).mockRejectedValue(new Error('API error'));

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('API error');
    });
  });

  it('should generate error in SearchResult', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonService.getAll).mockResolvedValue(pokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Generate error',
      })
    );

    expect(screen.getByText('Error generated')).toBeInTheDocument();
  });
});
