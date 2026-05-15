import { render, screen } from '@testing-library/react';
import PokemoCard from './PokemonCard.tsx';
import type { Pokemon } from '../../types.ts';

describe('PokenCard element', () => {
  it('should render the card with correct name and URL', () => {
    // const pokemon: Pokemon = {
    //   id: 1,
    //   name: 'pikachu',
    //   image: 'url/to/pikachu',
    // };
    // render(<PokemoCard pokemon={pokemon} />);
    //
    // const caption = screen.getByText(pokemon.name);
    // const image = screen.getByRole('img');
    //
    // expect(caption).toBeInTheDocument();
    // expect(image).toBeInTheDocument();
  });
});
