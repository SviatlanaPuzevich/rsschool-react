import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pokemonService } from '../../services/pokemonService';
import PokemonDetail from './PokemonDetail';

vi.mock('../../services/pokemonService', () => ({
  pokemonService: {
    getById: vi.fn(),
  },
}));

const mockPokemon = {
  id: 1,
  name: 'charizard',
  soundUrl: 'https://example.com/charizard.mp3',
  types: ['Fire', 'Flying'],
  abilities: ['Blaze', 'Solar Power'],
  weight: 850,
  height: 17,
};

describe('PokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loader initially when pokemonId is provided', () => {
    vi.mocked(pokemonService.getById).mockReturnValue(new Promise(() => {}));

    render(<PokemonDetail pokemonId={1} />);

    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  it('should render pokemon details successfully', async () => {
    vi.mocked(pokemonService.getById).mockResolvedValue(mockPokemon);

    render(<PokemonDetail pokemonId={1} />);

    expect(screen.getByText('LOADING...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Blaze, Solar Power')).toBeInTheDocument();
    });

    expect(screen.getByText('850')).toBeInTheDocument();

    expect(screen.getByText('17')).toBeInTheDocument();

    const audio = document.querySelector('audio');

    expect(audio).toHaveAttribute('src', mockPokemon.soundUrl);
  });

  it('should render alert message when request fails', async () => {
    vi.mocked(pokemonService.getById).mockRejectedValue(
      new Error('Network Error')
    );

    render(<PokemonDetail pokemonId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
  });

  it('should refetch data when pokemonId changes', async () => {
    vi.mocked(pokemonService.getById).mockResolvedValue(mockPokemon);

    const { rerender } = render(<PokemonDetail pokemonId={1} />);

    await waitFor(() => {
      expect(pokemonService.getById).toHaveBeenCalledWith(1);
    });

    rerender(<PokemonDetail pokemonId={2} />);

    await waitFor(() => {
      expect(pokemonService.getById).toHaveBeenCalledWith(2);
    });

    expect(pokemonService.getById).toHaveBeenCalledTimes(2);
  });

  it('should render nothing if pokemonId is not provided', () => {
    const { container } = render(<PokemonDetail pokemonId={undefined} />);

    expect(container.firstChild).toBeNull();

    expect(pokemonService.getById).not.toHaveBeenCalled();
  });
});
