import React, { useState } from 'react';
import styles from './search.page.module.css';
import SearchBar from '../../components/searchBar/SearchBar.tsx';
import SearchResult from '../../components/searchResult/SearchResult.tsx';
import Alert from '../../components/error/Alert.tsx';
import Loader from '../../components/loader/Loader.tsx';
import { pokemonService } from '../../services/pokemonService.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useUpdateSearchParams } from '../../hooks/useUpdateSearchParams.ts';
import Flyout from '../../components/flyout/Flyout.tsx';
import { useQuery } from '@tanstack/react-query';

const SearchPage: React.FC = () => {
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
        pokemon.name.toLowerCase().startsWith(trimmedQuery)
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
        <h1>Find your pokemon</h1>

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
