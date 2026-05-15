import { render, screen } from '@testing-library/react';
import SearchResult from './SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import userEvent from '@testing-library/user-event';
import {
  POKEMON_NUMBER_ON_PAGE,
  POKEMON_COLUMN_COUNT,
} from '../../constants/layout.ts';
import { SEARCH_RESULT } from '../../constants/messages.ts';

describe('SearchResult element', () => {
  it('should render No such pokemon if there are no pokemons', () => {
    render(<SearchResult pokemons={[]} />);

    const paginationElement = screen.queryByText(SEARCH_RESULT.NOT_FOUND);

    expect(paginationElement).toBeInTheDocument();
  });
});

describe('Navigation buttons', () => {
  const countPokemons = 2 * POKEMON_NUMBER_ON_PAGE * POKEMON_COLUMN_COUNT;
  const mockPokemons: Pokemon[] = Array.from(
    { length: countPokemons },
    (_, index) => ({
      id: index,
      name: `pokemon-${index + 1}`,
      image: `https://example.com/pokemon-${index + 1}.png`,
    })
  );

  it('should navigate between pages correct', async () => {
    const pokemonNameOnFirstPage = 'pokemon-1';
    const pokemonNameOnSecondPage = `pokemon-${POKEMON_NUMBER_ON_PAGE * POKEMON_COLUMN_COUNT + 1}`;
    const user = userEvent.setup();
    render(<SearchResult pokemons={mockPokemons} />);

    const nextButton = screen.getByRole('button', {
      name: /forward to next page/i,
    });
    const prevButton = screen.getByRole('button', {
      name: /back to previous page/i,
    });

    await user.click(nextButton);

    expect(screen.queryByText(pokemonNameOnFirstPage)).not.toBeInTheDocument();

    expect(screen.getByText(pokemonNameOnSecondPage)).toBeInTheDocument();

    await user.click(prevButton);

    expect(screen.queryByText(pokemonNameOnFirstPage)).toBeInTheDocument();
  });
});
