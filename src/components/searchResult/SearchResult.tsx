import React from 'react';
import type { Pokemon } from '../../types.ts';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination.tsx';
import PokemonCard from '../pokemonCard/PokemonCard.tsx';
import { useSearchParams } from 'react-router-dom';

interface Props {
  pokemons: Pokemon[];
  error?: boolean;
}

const PAGE_SIZE = 5;
const POKEMON_COLUMN_COUNT = 3;

const SearchResult: React.FC<Props> = ({ pokemons, error }) => {
  const [searchParams] = useSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const pagesCount = Math.ceil(
    pokemons.length / (PAGE_SIZE * POKEMON_COLUMN_COUNT)
  );

  if (error) {
    throw new Error('This error was generated');
  }

  if (pokemons.length === 0) {
    return <div>No such pokemon</div>;
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const currentPokemons = pokemons.slice(startIndex, endIndex);

  return (
    <>
      <h2>List of pokemons</h2>
      <div className={styles['container']}>
        {currentPokemons.map((item: Pokemon) => (
          <PokemonCard pokemon={item} key={item.id} />
        ))}
      </div>
      <Pagination
        count={pagesCount}
      />
    </>
  );
};

export default SearchResult;
