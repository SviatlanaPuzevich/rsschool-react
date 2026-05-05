import { Component } from 'react';
import SearchBar from './components/SearchBar.tsx';
import SearchResult from './components/SearchResult';
import { type Pokemon } from './types.ts';

interface AppState {
  query: string;
  pokemons: Pokemon[] | null;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    query: localStorage.getItem('query') || '',
    pokemons: [],
  };

  handleSearchSubmit = async () => {
    const queryState: string = this.state.query.trim().toLowerCase();

    if (!queryState) return;
    //save query to localstorage
    localStorage.setItem('query', this.state.query);

    try {
      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${queryState}`
      );
      console.log(pokemonResponse);

      if (!pokemonResponse.ok) {
        this.setState({
          query: '',
          pokemons: null,
        });
        throw new Error('Pokemon not found');
      }

      const pokemonData = await pokemonResponse.json();

      const abilitiesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${queryState}`
      );

      const abilities = await abilitiesResponse.json();

      const englishDescription = abilities.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );

      const pokemon: Pokemon = {
        name: pokemonData.name,
        image: pokemonData.sprites.front_default,
        abilities: englishDescription?.flavor_text || 'No description',
      };

      console.log(pokemon);

      this.setState({ ...this.state, pokemons: [pokemon] });
    } catch (error) {
      console.error(error);
    }
  };

  handleQueryChange = (value: string) => {
    this.setState({
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
          <SearchResult pokemons={this.state.pokemons} />
        </section>
      </>
    );
  }
}

export default App;
