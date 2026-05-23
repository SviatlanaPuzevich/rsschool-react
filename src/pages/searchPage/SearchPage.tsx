import { useEffect, useMemo, useState } from 'react';
import styles from './search.page.module.css';
import SearchBar from '../../components/searchBar/SearchBar.tsx';
import SearchResult from '../../components/searchResult/SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import Alert from '../../components/error/Alert.tsx';
import Loader from '../../components/loader/Loader.tsx';
import { useNavigate } from 'react-router-dom';
import { BASE_ROUTE } from '../../constants/routing.ts';
import usePokemonStore from '../../stores/usePokemonStore.ts';
import Flyout from '../../components/flyout/Flyout.tsx';

const SearchPage = () => {
  const pokemons = usePokemonStore((state) => state.pokemons);
  const isLoading = usePokemonStore((state) => state.isLoading);
  const error = usePokemonStore((state) => state.error);
  const fetchPokemons = usePokemonStore((state) => state.fetchPokemons);

  const [query, setQuery] = useState(localStorage.getItem('query') || '');
  const [searchQuery, setSearchQuery] = useState(query);
  const filteredPokemon = useMemo(() => {
    return searchQuery
      ? pokemons.filter((item: Pokemon) => item.name.startsWith(searchQuery))
      : pokemons;
  }, [pokemons, searchQuery]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const handleSearchSubmit = () => {
    const normalizedQuery = query.trim().toLowerCase();
    localStorage.setItem('query', normalizedQuery);
    setSearchQuery(normalizedQuery);
    navigate(BASE_ROUTE);
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Find your pokemon</h1>

        <SearchBar
          onQueryChange={setQuery}
          query={query}
          onSearch={handleSearchSubmit}
        />
        <section className={styles.result}>
          {isLoading && <Loader />}

          {error && <Alert message={error} />}

          {!isLoading && !error && <SearchResult pokemons={filteredPokemon} />}
        </section>
      </div>
      <Flyout />
    </>
  );
};

export default SearchPage;
