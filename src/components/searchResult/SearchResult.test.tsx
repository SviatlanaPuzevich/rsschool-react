import { render, screen } from '@testing-library/react';
import SearchResult from './SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import userEvent from '@testing-library/user-event';

describe('SearchResult element', () => {
  it('should render No such pokemon if there are no pokemons', () => {
    render(<SearchResult pokemons={[]} />);

    const paginationElement = screen.queryByText(/No such pokemon/i);

    expect(paginationElement).toBeInTheDocument();
  });
});

describe('Navigation buttons', () => {
  const mockPokemons: Pokemon[] = Array.from({ length: 45 }, (_, index) => ({
    id: index,
    name: `pokemon-${index + 1}`,
    image: `https://example.com/pokemon-${index + 1}.png`,
  }));

  it('should navigate between pages correct', async () => {
    const user = userEvent.setup();
    render(<SearchResult pokemons={mockPokemons} />);

    const nextButton = screen.getByRole('button', {
      name: /forward to next page/i,
    });
    const prevButton = screen.getByRole('button', {
      name: /back to previous page/i,
    });

    await user.click(nextButton);

    expect(screen.queryByText('pokemon-1')).not.toBeInTheDocument();

    expect(screen.getByText('pokemon-40')).toBeInTheDocument();

    await user.click(prevButton);

    expect(screen.queryByText('pokemon-1')).toBeInTheDocument();
  });
});
