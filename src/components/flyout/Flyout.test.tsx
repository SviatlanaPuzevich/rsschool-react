import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Flyout from './Flyout';
import type { Pokemon } from '../../types.ts';

const mockStore = {
  pokemons: [] as Pokemon[],
  isLoading: false,
  error: null,
  fetchPokemons: vi.fn(),

  pokemonDetails: null,
  pokemonDetailsError: null,
  isDetailsLoading: false,
  fetchPokemonDetailsById: vi.fn(),

  selectedPokemons: [] as Array<Pokemon>,
  selectPokemon: vi.fn(),
  unselectPokemon: vi.fn(),
  resetSelected: vi.fn(),
};

vi.mock('../../stores/usePokemonStore', () => ({
  default: vi.fn((selector) => selector(mockStore)),
}));

const createPokemon = (id: number, name = `pokemon-${id}`) => ({
  id,
  name,
  image: `${name}.png`,
});

const createSelectedPokemons = (count: number) =>
  Array.from({ length: count }, (_, index) => createPokemon(index + 1));

describe('Flyout', () => {
  beforeEach(() => {
    mockStore.selectedPokemons = [];
    vi.clearAllMocks();
  });

  it('should not render when no pokemon selected', () => {
    const { container } = render(<Flyout />);

    expect(container.firstChild).toBeNull();
  });

  it('should render plural selected text', () => {
    mockStore.selectedPokemons = createSelectedPokemons(2);

    render(<Flyout />);

    expect(screen.getByText('2 selected pokemons')).toBeInTheDocument();
  });

  it('should render singular selected text', () => {
    mockStore.selectedPokemons = createSelectedPokemons(1);

    render(<Flyout />);

    expect(screen.getByText('1 selected pokemon')).toBeInTheDocument();
  });

  it('should call resetSelected on click', async () => {
    mockStore.selectedPokemons = createSelectedPokemons(2);

    const user = userEvent.setup();

    render(<Flyout />);

    await user.click(
      screen.getByRole('button', {
        name: /unselect all/i,
      })
    );

    expect(mockStore.resetSelected).toHaveBeenCalledOnce();
  });

  it('should render download button', () => {
    mockStore.selectedPokemons = createSelectedPokemons(2);

    render(<Flyout />);

    expect(
      screen.getByRole('button', {
        name: /download/i,
      })
    ).toBeInTheDocument();
  });
});
