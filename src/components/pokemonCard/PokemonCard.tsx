import React from 'react';
import styles from './pokemon.card.module.css';
import type { Pokemon } from '../../types.ts';
import PokemonDetail from '../pokemonDetail/PokemonDetail.tsx';

interface Props {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<Props> = ({ pokemon }) => {
  return (
    <div className={styles.item}>
      <figure>
        <img src={pokemon.image} alt={pokemon.name} />
        <figcaption>{pokemon.name}</figcaption>
      </figure>
      <PokemonDetail pokemonId={pokemon.id} />
    </div>
  );
};

export default PokemonCard;
