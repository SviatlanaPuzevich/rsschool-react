import React from 'react';
import type { Pokemon } from '../../types.ts';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination.tsx';
import PokemonCard from '../pokemonCard/PokemonCard.tsx';
import PokemonDetail from '../pokemonDetail/PokemonDetail.tsx';
import { useUpdateSearchParams } from '../../hooks/useUpdateSearchParams.ts';

interface Props {
  pokemons: Pokemon[];
  error?: boolean;
}

const PAGE_SIZE = 5;

const SearchResult: React.FC<Props> = ({ pokemons, error }) => {
  const { searchParams } = useUpdateSearchParams();

  const selectedPokemonId = searchParams.get('details')
    ? Number(searchParams.get('details'))
    : null;

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const pagesCount = Math.ceil(pokemons.length / PAGE_SIZE);

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
      <div className={styles.container}>
        <div className={styles.list}>
          {currentPokemons.map((item: Pokemon) => (
            <PokemonCard
              pokemon={item}
              key={item.id}
              isSelected={selectedPokemonId === item.id}
            />
          ))}
        </div>

        <div>
          {selectedPokemonId ? (
            <PokemonDetail id={selectedPokemonId} />
          ) : (
            <div>Choose a pokemon</div>
          )}
        </div>
      </div>
      <Pagination count={pagesCount} />
    </>
  );
};

export default SearchResult;
