import React from 'react';
import styles from './search.page.module.css';
import SearchBar from '../../components/searchBar/SearchBar.tsx';
import SearchResult from '../../components/searchResult/SearchResult.tsx';
import type { Pokemon } from '../../types.ts';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary.tsx';
import Alert from '../../components/error/Alert.tsx';
import { buildURLToImage, getIdFromURL } from '../../utils/pokemonsHelper.ts';
import { ERROR_MESSAGE, LOADING } from '../../constants/messages.ts';

interface State {
  query: string;
  pokemons: Pokemon[];
  foundPokemons: Pokemon[];
  loaded: boolean;
  error: string | null;
  generateError: boolean;
  showError: boolean;
}

class SearchPage extends React.Component<object, State> {
  state: State = {
    query: localStorage.getItem('query') || '',
    pokemons: [],
    foundPokemons: [],
    loaded: false,
    generateError: false,
    error: null,
    showError: false,
  };

  async componentDidMount() {
    this.setState({
      loaded: false,
      error: null,
      showError: false,
    });
    const query: string = this.state.query.trim().toLowerCase();
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=1500'
      );

      const pokemonsData = await response.json();
      const pokemons: Pokemon[] = pokemonsData.results.map(
        (item: { name: string; url: string }) => {
          const id = getIdFromURL(item.url);
          const image = buildURLToImage(id);
          return {
            id,
            name: item.name,
            image,
            abilities: '',
          };
        }
      );
      const filteredPokemon = query
        ? pokemons.filter((item) => item.name.startsWith(query))
        : pokemons;
      this.setState({
        query,
        pokemons,
        foundPokemons: filteredPokemon,
        loaded: true,
      });
    } catch (e: unknown) {
      this.setState({
        loaded: true,
        showError: true,
        error: e instanceof Error ? e.message : ERROR_MESSAGE.NOT_LOADED,
      });
    }
  }

  handleSearchSubmit = () => {
    const query = this.state.query.trim().toLowerCase();
    localStorage.setItem('query', this.state.query);
    const filteredPokemon = query
      ? this.state.pokemons.filter((item) => item.name.startsWith(query))
      : this.state.pokemons;
    this.setState({ foundPokemons: filteredPokemon });
  };

  handleQueryChange = (value: string) => {
    this.setState({
      query: value,
    });
  };

  handleErrorGeneration = () => {
    this.setState({
      generateError: true,
    });
  };

  handleCloseAlert = () => {
    this.setState({
      showError: false,
      error: null,
    });
  };

  render() {
    const { query, loaded, error, foundPokemons, showError } = this.state;
    return (
      <div className={styles.container}>
        <h1>Find your pokemon</h1>
        <ErrorBoundary>
          <SearchBar
            onQueryChange={this.handleQueryChange}
            query={query}
            onSearch={this.handleSearchSubmit}
            onError={this.handleErrorGeneration}
          />
          <section className={styles.result}>
            {!loaded && <p>{LOADING}</p>}

            {showError && (
              <Alert
                message={error}
                show={showError}
                onClose={this.handleCloseAlert}
              />
            )}

            {loaded && !error && (
              <SearchResult
                pokemons={foundPokemons}
                error={this.state.generateError}
              />
            )}
          </section>
        </ErrorBoundary>
      </div>
    );
  }
}

export default SearchPage;
