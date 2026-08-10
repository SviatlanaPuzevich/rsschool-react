import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SearchResult from './SearchResult';
import type { Pokemon } from '../../types';

const pokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    image: 'bulbasaur.png',
    abilities: '',
  },
  {
    id: 2,
    name: 'ivysaur',
    image: 'ivysaur.png',
    abilities: '',
  },
  {
    id: 25,
    name: 'pikachu',
    image: 'pikachu.png',
    abilities: '',
  },
  {
    id: 4,
    name: 'charmander',
    image: 'charmander.png',
    abilities: '',
  },
  {
    id: 5,
    name: 'charmeleon',
    image: 'charmeleon.png',
    abilities: '',
  },
  {
    id: 6,
    name: 'charizard',
    image: 'charizard.png',
    abilities: '',
  },
  {
    id: 7,
    name: 'squirtle',
    image: 'squirtle.png',
    abilities: '',
  },
];

const renderSearchResult = (
  initialEntry = '/search?page=1'
) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SearchResult pokemons={pokemons} />
    </MemoryRouter>
  );
};

describe('SearchResult', () => {
  it('should display first page of pokemons', () => {
    renderSearchResult();

    expect(screen.getByText('List of pokemons')).toBeInTheDocument();

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.getByText('charmeleon')).toBeInTheDocument();

    expect(screen.queryByText('charizard')).not.toBeInTheDocument();
    expect(screen.queryByText('squirtle')).not.toBeInTheDocument();
  });

  it('should display second page of pokemons', () => {
    renderSearchResult('/search?page=2');

    expect(screen.getByText('charizard')).toBeInTheDocument();
    expect(screen.getByText('squirtle')).toBeInTheDocument();

    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
  });

  it('should show choose a pokemon when no pokemon is selected', () => {
    renderSearchResult();

    expect(
      screen.getByText('Choose a pokemon')
    ).toBeInTheDocument();
  });

  it('should display selected pokemon details', async () => {
    renderSearchResult('/search?page=1&details=25');

    expect(
      await screen.findByRole('heading', {
        name: 'pikachu',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('#25')).toBeInTheDocument();

    expect(
      screen.getByText('static, lightning-rod')
    ).toBeInTheDocument();

    expect(screen.getByText('electric')).toBeInTheDocument();
  });


  it('should not select pokemon when details parameter is absent', () => {
    renderSearchResult('/search?page=1');

    const pikachuCard = screen.getByText('pikachu');

    expect(pikachuCard).not.toHaveClass('selected');
  });

  it('should display selected pokemon from current page', async () => {
    renderSearchResult('/search?page=2&details=6');

    expect(
      await screen.findByRole('heading', {
        name: 'pikachu',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('#6')).toBeInTheDocument();
  });

  it('should throw error when error prop is true', () => {
    expect(() =>
      render(
        <MemoryRouter initialEntries={['/search']}>
          <SearchResult pokemons={pokemons} error />
        </MemoryRouter>
      )
    ).toThrow('This error was generated');
  });

  it('should show message when pokemon list is empty', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <SearchResult pokemons={[]} />
      </MemoryRouter>
    );

    expect(
      screen.getByText('No such pokemon')
    ).toBeInTheDocument();
  });
});
