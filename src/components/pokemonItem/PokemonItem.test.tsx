import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import PokemonItem from './PokemonItem';
import { BASE_ROUTE, SEARCH } from '../../constants/routing';
import styles from './pokemon.item.module.css';
import userEvent from '@testing-library/user-event';

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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('PokemonItem', () => {
  it('renders pokemon name, image and checkbox', () => {
    renderComponent();

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', 'pikachu.png');
    expect(img).toHaveAttribute('alt', 'pikachu');
  });


  it('navigates to correct URL on click', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    const user = userEvent.setup();

    renderComponent();

    const clickableElement = screen.getByText(/more details/i);

    await user.click(clickableElement);

    expect(mockNavigate).toHaveBeenCalledWith(`${BASE_ROUTE}${SEARCH}/1/25`);
  });

  it('does NOT apply selectedItem class when pokemon is not selected', () => {
    const { container } = renderComponent(undefined, '/search/1');

    expect(container.firstChild).not.toHaveClass('selectedItem');
  });

  it('applies selectedItem class when pokemon is selected', () => {
    const { container } = renderComponent(
      { id: 25, name: 'pikachu', image: 'pikachu.png' },
      '/search/1/25'
    );

    expect(container.firstChild).toHaveClass(styles.selectedItem);
  });
});
