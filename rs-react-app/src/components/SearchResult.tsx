import { Component } from 'react';
import type { Pokemon } from '../types.ts';

interface Props {
  pokemons: Pokemon[] | null | undefined;
}

class SearchResult extends Component<Props> {
  render() {
    if (this.props.pokemons === null) {
      return <div>No such pokemon</div>;
    }

    if (this.props.pokemons.length === 0) {
      return <div>Try to search something</div>;
    }
    return (
      <ul>
        {this.props.pokemons.map((item: Pokemon) => (
          <li key={item.name}>
            {item.name}
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '200px', height: 'auto' }}
            />
            {item.abilities}
          </li>
        ))}
      </ul>
    );
  }
}

export default SearchResult;
