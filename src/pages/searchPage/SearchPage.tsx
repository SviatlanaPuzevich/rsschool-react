import { useEffect, useMemo, useState } from 'react';
import styles from './search.page.module.css';
import SearchBar from '../../components/searchBar/SearchBar.tsx';
import SearchResult from '../../components/searchResult/SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import Alert from '../../components/error/Alert.tsx';
import { ERROR_MESSAGE, LOADING } from '../../constants/messages.ts';
import { pokemonService } from '../../services/pokemon.ts';

const SearchPage = () => {
  const [query, setQuery] = useState<string>(
    localStorage.getItem('query') || ''
  );
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem('query') || ''
  );
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const filteredPokemon = useMemo(() => {
    return searchQuery
      ? pokemons.filter((item: Pokemon) => item.name.startsWith(searchQuery))
      : pokemons;
  }, [pokemons, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoaded(false);
      try {
        const allPokemons = await pokemonService.getAll();

        setPokemons(allPokemons);
        setLoaded(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : ERROR_MESSAGE.SERVER_ERROR);
        setLoaded(true);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = () => {
    const normalizedQuery = query.trim().toLowerCase();
    localStorage.setItem('query', normalizedQuery);
    setSearchQuery(normalizedQuery);
  };

  return (
    <div className={styles.container}>
      <h1>Find your pokemon</h1>

      <SearchBar
        onQueryChange={setQuery}
        query={query}
        onSearch={handleSearchSubmit}
      />
      <section className={styles.result}>
        {!loaded && <p>{LOADING}</p>}

        {error && <Alert message={error} />}

        {loaded && !error && <SearchResult pokemons={filteredPokemon} />}
      </section>
    </div>
  );
};

export default SearchPage;
