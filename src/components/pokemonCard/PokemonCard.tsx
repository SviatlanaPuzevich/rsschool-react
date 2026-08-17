import React from 'react';
import styles from './pokemon.card.module.css';
import type { Pokemon } from '@/types';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import usePokemonStore from '../../stores/usePokemonStore';

interface Props {
  pokemon: Pokemon;
  isSelected: boolean;
}

const PokemonCard: React.FC<Props> = ({ pokemon, isSelected }) => {
  const { setParam, deleteParam } = useUpdateSearchParams();
  const selectedPokemons = usePokemonStore((state) => state.selectedPokemons);
  const selectPokemon = usePokemonStore((state) => state.selectPokemon);
  const unselectPokemon = usePokemonStore((state) => state.unselectPokemon);

  const isChecked = selectedPokemons.includes(pokemon.id);

  const handleCheckPokemon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectPokemon(pokemon.id);
    } else {
      unselectPokemon(pokemon.id);
    }
  };

  const selectHandle = () => {
    if (isSelected) {
      deleteParam('details');
    } else {
      setParam('details', pokemon.id.toString());
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={selectHandle}
    >
      <div className={styles.wrapper}>
        <input
          type="checkbox"
          checked={isChecked}
          onClick={(e) => e.stopPropagation()}
          onChange={handleCheckPokemon}
        />
        <figure>
          <img src={pokemon.image} alt={pokemon.name} />
          <figcaption>{pokemon.name}</figcaption>
        </figure>
      </div>
    </div>
  );
};

export default PokemonCard;
