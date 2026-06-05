import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import SearchPage from './SearchPage';
import { pokemonService } from '../../services/pokemon';
import type { Pokemon } from '../../types';
import {
  renderWithQueryClient,
} from '../../utils/testUtils.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/pokemon', () => ({
  pokemonService: {
    getAll: vi.fn(),
  },
}));

const mockPokemons: Pokemon[] = [
  { id: 1, name: 'bulbasaur', image: 'bulbasaur.png' },
  { id: 2, name: 'pikachu', image: 'pikachu.png' },
  { id: 3, name: 'charmander', image: 'charmander.png' },
];

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders pokemons after loading', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(mockPokemons);

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('initializes query from localStorage', async () => {
    localStorage.setItem('query', JSON.stringify('pika'));

    vi.mocked(pokemonService.getAll).mockResolvedValue(mockPokemons);

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = await screen.findByRole('textbox');

    expect(input).toHaveValue('pika');

    await screen.findByText('pikachu');

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('updates query and navigates on search', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(mockPokemons);

    const user = userEvent.setup();

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = await screen.findByRole('textbox');

    await user.type(input, 'Bulba');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(JSON.parse(localStorage.getItem('query'))).toBe('bulba');

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('shows api error message', async () => {
    vi.mocked(pokemonService.getAll).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/failed to fetch/i)).toBeInTheDocument();
  });

  it('shows fallback error message', async () => {
    vi.mocked(pokemonService.getAll).mockRejectedValue(
      new Error('unknown error')
    );

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('unknown error')).toBeInTheDocument();
  });

  it('reuses cached data between navigations without refetching', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(mockPokemons);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 5 * 60 * 1000 },
      },
    });

    const { unmount } = renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>,
      queryClient
    );

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(pokemonService.getAll).toHaveBeenCalledTimes(1);

    unmount();

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>,
      queryClient
    );

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    expect(pokemonService.getAll).toHaveBeenCalledTimes(1);
  });

  it('refetches data when the invalidate cache button is clicked', async () => {
    vi.mocked(pokemonService.getAll).mockResolvedValue(mockPokemons);

    const user = userEvent.setup();

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(pokemonService.getAll).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole('button', { name: /invalidate cache/i })
    );

    await waitFor(() =>
      expect(pokemonService.getAll).toHaveBeenCalledTimes(2)
    );
  });

  it('keeps checked pokemon selected after page change', async () => {
    const generatedPokemons = Array.from({ length: 30 }, (_, i) => i + 1).map(
      (i) => {
        return {
          id: i,
          name: `pokemon-${i}`,
          image: `${i}.png`,
        };
      }
    );
    vi.mocked(pokemonService.getAll).mockResolvedValue(generatedPokemons);

    const user = userEvent.setup();

    renderWithQueryClient(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const checkbox = await screen.findByTestId('checkbox-2');

    await user.click(checkbox);

    expect(checkbox).toBeChecked();

    await user.click(screen.getByText('>'));

    await user.click(screen.getByText('<'));

    expect(screen.getByTestId('checkbox-2')).toBeChecked();
  });
});
