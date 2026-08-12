import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import styles from './pokemon.card.module.css';

import PokemonCard from './PokemonCard';
import type { Pokemon } from '../../types';

const pokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'pikachu.png',
  abilities: '',
};

const LocationDisplay = () => {
  const location = useLocation();

  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
};

const renderCard = (isSelected = false, initialEntry = '/search?page=2') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <PokemonCard pokemon={pokemon} isSelected={isSelected} />
      <LocationDisplay />
    </MemoryRouter>
  );
};

describe('PokemonCard', () => {
  it('should render pokemon name', () => {
    renderCard();

    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('should add details parameter when pokemon is not selected', async () => {
    const user = userEvent.setup();

    renderCard(false, '/search?page=2');

    await user.click(screen.getByText('pikachu'));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/search?page=2&details=25'
    );
  });

  it('should remove details parameter when selected pokemon is clicked', async () => {
    const user = userEvent.setup();

    renderCard(true, '/search?page=2&details=25');

    await user.click(screen.getByText('pikachu'));

    expect(screen.getByTestId('location')).toHaveTextContent('/search?page=2');

    expect(screen.getByTestId('location')).not.toHaveTextContent('details=25');
  });

  it('should preserve current page when selecting pokemon', async () => {
    const user = userEvent.setup();

    renderCard(false, '/search?page=3');

    await user.click(screen.getByText('pikachu'));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/search?page=3&details=25'
    );
  });

  it('should have selected class when pokemon is selected', () => {
    renderCard(true, '/search?page=2&details=25');

    const cardText = screen.getByText('pikachu');
    const cardContainer = cardText.closest('div');

    expect(cardContainer).toHaveClass(styles.selected);
  });

  it('should not have selected class when pokemon is not selected', () => {
    renderCard(false);

    const card = screen.getByText('pikachu');

    expect(card).not.toHaveClass('selected');
  });
});
