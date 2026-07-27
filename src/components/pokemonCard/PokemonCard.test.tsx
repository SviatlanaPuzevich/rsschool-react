import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../../types.ts';

vi.mock('../pokemonDetail/PokemonDetail.tsx', () => ({
  default: ({ pokemonId }: { pokemonId: number }) => (
    <div data-testid="mock-pokemon-detail">Detail ID: {pokemonId}</div>
  ),
}));

describe('PokemonCard Component', () => {
  const mockPokemon: Pokemon = {
    id: 25,
    name: 'Pikachu',
    image: 'https://githubusercontent.com',
  };

  it('should render pokemon name and image correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const caption = screen.getByText('Pikachu');
    expect(caption).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockPokemon.image);
    expect(image).toHaveAttribute('alt', 'Pikachu');
  });

  it('should pass correct pokemonId to PokemonDetail component', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const detailComponent = screen.getByTestId('mock-pokemon-detail');
    expect(detailComponent).toBeInTheDocument();

    expect(detailComponent).toHaveTextContent('Detail ID: 25');
  });
});
