import React from 'react';
import styles from './pokemon.card.module.css';
import type { Pokemon } from '../../types.ts';
import PokemonDetail from '../pokemonDetail/PokemonDetail.tsx';

interface Props {
  pokemon: Pokemon;
}

class PokemonCard extends React.Component<Props> {
  render() {
    const { pokemon } = this.props;
    return (
      <div className={styles.item}>
        <figure className={styles.imgContainer}>
          <img
            className={styles.pokemonImg}
            src={pokemon.image}
            alt={pokemon.name}
          />
          <figcaption className={styles.caption}>{pokemon.name}</figcaption>
        </figure>
        <PokemonDetail pokemonId={pokemon.id} />
      </div>
    );
  }
}

export default PokemonCard;
