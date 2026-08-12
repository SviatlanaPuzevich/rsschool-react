import React, { useEffect, useMemo, useState } from 'react';
import styles from './search.page.module.css';
import SearchBar from '../../components/searchBar/SearchBar.tsx';
import SearchResult from '../../components/searchResult/SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import Alert from '../../components/error/Alert.tsx';
import Loader from '../../components/loader/Loader.tsx';
import { pokemonService } from '../../services/pokemonService.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useUpdateSearchParams } from '../../hooks/useUpdateSearchParams.ts';
import Flyout from '../../components/flyout/Flyout.tsx';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('query', '');
  const [query, setQuery] = useState(searchQuery);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState(false);

  const { setParam, deleteParam } = useUpdateSearchParams();

  useEffect(() => {
    const fetchPokemons = async (): Promise<void> => {
      setLoaded(false);
      setError(null);

      try {
        const allPokemons = await pokemonService.getAll();
        setPokemons(allPokemons);
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : 'Can not load pokemons. Please try to reload'
        );
      } finally {
        setLoaded(true);
      }
    };

    fetchPokemons();
  }, []);

  const foundPokemons = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return pokemons;
    }

    return pokemons.filter((pokemon) => pokemon.name.startsWith(trimmedQuery));
  }, [pokemons, searchQuery]);

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
          {!loaded && <Loader />}

          {loaded && error && <Alert message={error} show />}

          {loaded && !error && (
            <SearchResult pokemons={foundPokemons} error={generateError} />
          )}
        </section>
      </div>
      <Flyout />
    </>
  );
};

export default SearchPage;
