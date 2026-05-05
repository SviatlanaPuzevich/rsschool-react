import { Component } from 'react';
import SearchBar from './components/SearchBar.tsx';
import SearchResult from './components/SearchResult';
import { type Pokemon } from './types.ts';

interface AppState {
  query: string;
  pokemons: Pokemon[];
  foundPokemons: Pokemon[];
  loaded: boolean;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    query: localStorage.getItem('query') || '',
    pokemons: [],
    foundPokemons: [],
    loaded: false,
  };

  async componentDidMount() {
    const query: string = this.state.query.trim().toLowerCase();
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=1500'
      );

      const pokemonsData = await response.json();
      const pokemons: Pokemon[] = pokemonsData.results.map(
        (item: { name: string; url: string }) => {
          const parts = item.url.split('/');

          const id = parts[parts.length - 2];
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
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
    } catch (e) {
      console.error('Failed to fetch pokemons:', e);
      this.setState({ loaded: true });
    }
  }

  handleSearchSubmit = () => {
    const query = this.state.query.trim().toLowerCase();
    console.log(query);
    localStorage.setItem('query', this.state.query);
    const filteredPokemon = query
      ? this.state.pokemons.filter((item) => item.name.startsWith(query))
      : this.state.pokemons;
    this.setState({ ...this.state, foundPokemons: filteredPokemon });
  };

  handleQueryChange = (value: string) => {
    this.setState({
      ...this.state,
      query: value,
    });
  };

  render() {
    return (
      <>
        <h1>Pokemon search</h1>
        <SearchBar
          onQueryChange={this.handleQueryChange}
          query={this.state.query}
          onSearch={this.handleSearchSubmit}
        />
        <section>
          {this.state.loaded ? (
            <SearchResult pokemons={this.state.foundPokemons} />
          ) : (
            <div>Loading...</div>
          )}
        </section>
      </>
    );
  }
}

export default App;
