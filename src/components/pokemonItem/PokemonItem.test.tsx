import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonItem from './PokemonItem';
import { BASE_ROUTE, SEARCH } from '../../constants/routing';
import styles from './pokemon.item.module.css';

const renderComponent = (
  pokemon = { id: 25, name: 'pikachu', image: 'pikachu.png' },
  route = '/search/1'
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/search/:page"
          element={<PokemonItem pokemon={pokemon} />}
        />
        <Route
          path="/search/:page/:pokemonId"
          element={<PokemonItem pokemon={pokemon} />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('PokemonItem', () => {
  it('renders pokemon name and image', () => {
    renderComponent();

    expect(screen.getByText('pikachu')).toBeInTheDocument();

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', 'pikachu.png');
    expect(img).toHaveAttribute('alt', 'pikachu');
  });

  it('renders correct link', () => {
    renderComponent();

    const link = screen.getByRole('link', { name: /more details/i });

    expect(link).toHaveAttribute('href', `${BASE_ROUTE}${SEARCH}/1/25`);
  });

  it('does NOT apply selected class when pokemon is not selected', () => {
    const { container } = renderComponent(undefined, '/search/1');

    expect(container.firstChild).not.toHaveClass('selected');
  });

  it('applies selected class when pokemon is selected', () => {
    const { container } = renderComponent(
      { id: 25, name: 'pikachu', image: 'pikachu.png' },
      '/search/1/25'
    );

    expect(container.firstChild).toHaveClass(styles.selected);
  });
});
