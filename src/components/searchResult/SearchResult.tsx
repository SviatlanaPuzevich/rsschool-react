import { useState } from 'react';
import type { Pokemon } from '../../types.ts';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination.tsx';
import PokemonCard from '../pokemonCard/PokemonCard.tsx';
import {
  FIRST_PAGE,
  POKEMON_PAGE_SIZE,
  POKEMON_COLUMN_COUNT,
} from '../../constants/layout.ts';
import { SEARCH_RESULT } from '../../constants/messages.ts';

interface Props {
  pokemons: Pokemon[];
}

const SearchResult = ({ pokemons }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);

  if (pokemons.length === 0) {
    return <div>{SEARCH_RESULT.NOT_FOUND}</div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pagesCount = Math.ceil(
    pokemons.length / (POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT)
  );

  const startIndex =
    (currentPage - 1) * POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT;
  const currentPokemons = pokemons.slice(
    startIndex,
    startIndex + POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT
  );

  return (
    <>
      <h2>List of pokemons</h2>
      <div className={styles.container}>
        {currentPokemons.map((item: Pokemon) => (
          <PokemonCard pokemon={item} key={item.id} />
        ))}
      </div>
      <Pagination
        count={pagesCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default SearchResult;
