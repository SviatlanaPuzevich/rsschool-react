import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PokemonCardWrapper from './PokemonCardWrapper';
import usePokemonStore from '../../stores/usePokemonStore';

describe('PokemonCardWrapper', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      selectedPokemons: [],
    });
  });

  it('renders children and unchecked checkbox by default', () => {
    render(
      <PokemonCardWrapper id={1}>
        <div>Bulbasaur</div>
      </PokemonCardWrapper>
    );

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders checkbox as checked when pokemon is selected', () => {
    usePokemonStore.setState({
      selectedPokemons: [1],
    });

    render(
      <PokemonCardWrapper id={1}>
        <div>Bulbasaur</div>
      </PokemonCardWrapper>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('selects pokemon when checkbox is checked', async () => {
    const user = userEvent.setup();

    render(
      <PokemonCardWrapper id={1}>
        <div>Bulbasaur</div>
      </PokemonCardWrapper>
    );

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(usePokemonStore.getState().selectedPokemons).toContain(1);
    expect(checkbox).toBeChecked();
  });

  it('unselects pokemon when checkbox is unchecked', async () => {
    const user = userEvent.setup();

    usePokemonStore.setState({
      selectedPokemons: [1],
    });

    render(
      <PokemonCardWrapper id={1}>
        <div>Bulbasaur</div>
      </PokemonCardWrapper>
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(usePokemonStore.getState().selectedPokemons).not.toContain(1);
    expect(checkbox).not.toBeChecked();
  });

  it('works with string pokemon id', async () => {
    const user = userEvent.setup();

    render(
      <PokemonCardWrapper id="25">
        <div>Pikachu</div>
      </PokemonCardWrapper>
    );

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(usePokemonStore.getState().selectedPokemons).toContain('25');
    expect(checkbox).toBeChecked();
  });
});
