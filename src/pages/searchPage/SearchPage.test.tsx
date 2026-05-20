import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from './SearchPage';
import { pokemonService } from '../../services/pokemon.ts';
import { ERROR_MESSAGE } from '../../constants/messages.ts';
import type { Pokemon } from '../../types.ts';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/pokemon.ts', () => ({
  pokemonService: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../components/searchBar/SearchBar.tsx', () => ({
  default: ({
    query,
    onQueryChange,
    onSearch,
  }: {
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
  }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button data-testid="search-submit" onClick={onSearch}>
        Search
      </button>
    </div>
  ),
}));

vi.mock('../../components/searchResult/SearchResult.tsx', () => ({
  default: ({ pokemons }: { pokemons: Pokemon[] }) => (
    <div data-testid="search-result">Found {pokemons.length} pokemons</div>
  ),
}));

vi.mock('../../components/loader/Loader.tsx', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../components/error/Alert.tsx', () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error-alert">{message}</div>
  ),
}));

const mockPokemons: Pokemon[] = [
  { id: 1, name: 'bulbasaur', image: 'bulbasaur.png' },
  { id: 2, name: 'pikachu', image: 'pikachu.png' },
  { id: 3, name: 'charmander', image: 'charmander.png' },
];

describe('SearchPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should display loader on mount and switch to search results once data is fetched', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValueOnce(mockPokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('search-result')).toHaveTextContent(
      'Found 3 pokemons'
    );
  });

  // it('should initialize query from localStorage if it exists', async () => {
  //   localStorage.setItem('query', 'pika');
  //   vi.mocked(pokemonService.getAll).mockResolvedValueOnce(mockPokemons);
  //
  //   render(
  //     <MemoryRouter>
  //       <SearchPage />
  //     </MemoryRouter>
  //   );
  //
  //   const input = screen.getByTestId('search-input') as HTMLInputElement;
  //   expect(input.value).toBe('pika');
  //
  //   await waitFor(() => {
  //     expect(screen.getByTestId('search-result')).toHaveTextContent(
  //       'Found 1 pokemons'
  //     );
  //   });
  // });

  it('should update localStorage, trigger query filter, and navigate on search submission', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValueOnce(mockPokemons);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );

    const input = screen.getByTestId('search-input');
    const submitBtn = screen.getByTestId('search-submit');

    fireEvent.change(input, { target: { value: '  Bulba  ' } });
    fireEvent.click(submitBtn);

    expect(localStorage.getItem('query')).toBe('bulba');

    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/1'));

    expect(screen.getByTestId('search-result')).toHaveTextContent(
      'Found 1 pokemons'
    );
  });

  it('should catch API errors and display an Alert component', async () => {
    const errorMsg = 'Failed to fetch';
    vi.mocked(pokemonService.getAll).mockRejectedValueOnce(new Error(errorMsg));

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('error-alert')).toHaveTextContent(errorMsg);
    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  it('should display a fallback server error message when an unknown error is caught', async () => {
    vi.mocked(pokemonService.getAll).mockRejectedValueOnce(
      'Unknown string error'
    );

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('error-alert')).toHaveTextContent(
      ERROR_MESSAGE.SERVER_ERROR
    );
  });
});
