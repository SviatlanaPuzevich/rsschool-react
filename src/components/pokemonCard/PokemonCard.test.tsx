import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import { pokemonService } from '../../services/pokemon';
import { BASE_ROUTE } from '../../constants/routing';
import {
  renderWithQueryClient,
  createTestQueryClient,
} from '../../utils/testUtils.tsx';

vi.mock('../../services/pokemon', () => ({
  pokemonService: {
    getById: vi.fn(),
  },
}));

vi.mock('./pokemon.card.module.css', () => ({
  default: {
    card: 'card',
    details: 'details',
    close: 'close',
  },
}));

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('PokemonCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    route = '/pokemons/1/25',
    queryClient = createTestQueryClient()
  ) => {
    return renderWithQueryClient(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/pokemons/:page/:pokemonId" element={<PokemonCard />} />

          <Route path="/pokemons/:page" element={<PokemonCard />} />
        </Routes>
      </MemoryRouter>,
      queryClient
    );
  };

  it('renders loader while loading', () => {
    vi.mocked(pokemonService.getById).mockReturnValue(new Promise(() => {}));

    renderComponent();

    expect(document.querySelector('audio')).not.toBeInTheDocument();
  });

  it('renders pokemon details', async (): Promise<void> => {
    vi.mocked(pokemonService.getById).mockResolvedValue({
      id: 25,
      name: 'pikachu',
      soundUrl: 'pikachu.mp3',
      imgUrl: 'pikachu.png',
      abilities: ['static', 'lightning-rod'],
      types: ['electric'],
      weight: 60,
      height: 4,
    });

    renderComponent();

    await waitFor(() => {
      screen.getByRole('heading', { name: /pikachu/i });
    });

    expect(screen.getByText(/static, lightning-rod/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/60/i)).toBeInTheDocument();
    expect(screen.getByText(/4/i)).toBeInTheDocument();

    const audio = document.querySelector('audio');

    expect(audio).toHaveAttribute('src', 'pikachu.mp3');
  });

  it('renders error message', async (): Promise<void> => {
    vi.mocked(pokemonService.getById).mockRejectedValue(
      new Error('Server error')
    );

    renderComponent('/pokemons/1/25');

    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });

  it('calls service with pokemonId', async (): Promise<void> => {
    vi.mocked(pokemonService.getById).mockResolvedValue({
      id: 25,
      name: 'pikachu',
      soundUrl: '',
      imgUrl: 'pikachu.png',
      abilities: ['v'],
      types: ['static', 'lightning-rod'],
      weight: 1,
      height: 1,
    });

    renderComponent();

    await waitFor(() => {
      expect(pokemonService.getById).toHaveBeenCalledWith('25');
    });
  });

  it('navigates back to page on close click', async () => {
    const user = userEvent.setup();
    vi.mocked(pokemonService.getById).mockResolvedValue({
      id: 25,
      name: 'pikachu',
      soundUrl: '',
      imgUrl: 'pikachu.png',
      abilities: [],
      types: ['static', 'lightning-rod'],
      weight: 1,
      height: 1,
    });

    renderComponent();

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', {
        name: /close pokemon card/i,
      })
    );

    expect(mockedNavigate).toHaveBeenCalledWith('..', { relative: 'path' });
  });
});
