'use client';

import React, { useState } from 'react';
import styles from './search.page.module.css';
import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemonService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import SearchBar from '@/components/searchBar/SearchBar';
import Loader from '@/components/loader/Loader';
import SearchResult from '@/components/searchResult/SearchResult';
import Alert from '@/components/error/Alert';
import Flyout from '@/components/flyout/Flyout';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useTranslations } from 'next-intl';

const SearchPage: React.FC = () => {
  const t = useTranslations('Search');
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('query', '');
  const [query, setQuery] = useState(searchQuery);

  const {
    data: pokemons = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['pokemons'],
    queryFn: () => pokemonService.getAll(),
    select: (pokemons) => {
      const trimmedQuery = searchQuery.trim().toLowerCase();
      if (!trimmedQuery) return pokemons;
      return pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(trimmedQuery),
      );
    },
  });

  const [generateError, setGenerateError] = useState(false);

  const { setParam, deleteParam } = useUpdateSearchParams();

  const handleQueryChange = (value: string): void => {
    setQuery(value);
  };

  const handleSearchSubmit = (): void => {
    setSearchQuery(query.trim().toLowerCase());
    setParam('page', '1');
    deleteParam('details');
  };

  const handleErrorGeneration = (): void => {
    setGenerateError(true);
  };

  return (
    <>
      <div className={styles.container}>
        <h1>{t('title')}</h1>

        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          onSearch={handleSearchSubmit}
          onError={handleErrorGeneration}
        />

        <section className={styles.result}>
          {isLoading && <Loader />}

          {isError && <Alert message={error.message} show />}

          {!isLoading && !isError && (
            <SearchResult pokemons={pokemons} error={generateError} />
          )}
        </section>
      </div>
      <Flyout />
    </>
  );
};

export default SearchPage;
