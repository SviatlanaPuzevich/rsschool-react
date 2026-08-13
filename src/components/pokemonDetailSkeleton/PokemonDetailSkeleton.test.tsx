import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PokemonDetailSkeleton from './PokemonDetailSkeleton';

describe('PokemonDetailSkeleton', () => {
  it('matches snapshot', () => {
    const { container } = render(<PokemonDetailSkeleton />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
