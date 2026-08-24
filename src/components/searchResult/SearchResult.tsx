import React from 'react';
import type { Pokemon } from '@/types';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination';
import PokemonCard from '../pokemonCard/PokemonCard';
import PokemonDetail from '../pokemonDetail/PokemonDetail';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useTranslations } from 'next-intl';

interface Props {
  pokemons: Pokemon[];
  error?: boolean;
}

const PAGE_SIZE = 5;

const SearchResult: React.FC<Props> = ({ pokemons, error }) => {
  const { searchParams } = useUpdateSearchParams();
  const t = useTranslations('Search');
  const tErrors = useTranslations('Errors');

  const selectedPokemonId = searchParams.get('details')
    ? Number(searchParams.get('details'))
    : null;

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const pagesCount = Math.ceil(pokemons.length / PAGE_SIZE);

  if (error) {
    throw new Error(tErrors('generated'));
  }

  if (pokemons.length === 0) {
    return <div>{t('noResults')}</div>;
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const currentPokemons = pokemons.slice(startIndex, endIndex);

  return (
    <>
      <h2>{t('results')}</h2>
      <div className={styles.container}>
        <div className={styles.list}>
          {currentPokemons.map((item: Pokemon) => (
            <PokemonCard
              key={item.id}
              pokemon={item}
              isSelected={selectedPokemonId === item.id}
            />
          ))}
        </div>

        <div>
          {selectedPokemonId ? (
            <PokemonDetail id={selectedPokemonId} />
          ) : (
            <div>{t('choosePokemon')}</div>
          )}
        </div>
      </div>
      <Pagination count={pagesCount} />
    </>
  );
};

export default SearchResult;
