import usePokemonStore from '../../stores/usePokemonStore.ts';
import type { ReactNode } from 'react';
import styles from './pokemon.card.wrapper.module.css';

interface Props {
  id: string | number;
  children: ReactNode;
}

const PokemonCardWrapper: React.FC<Props> = ({ children, id }: Props) => {
  const selectedPokemons = usePokemonStore((state) => state.selectedPokemons);
  const selectPokemon = usePokemonStore((state) => state.selectPokemon);
  const unselectPokemon = usePokemonStore((state) => state.unselectPokemon);

  const isSelected = selectedPokemons.includes(id);
  const handleCheckPkemon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectPokemon(id);
    } else {
      unselectPokemon(id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckPkemon}
      />
      {children}
    </div>
  );
};

export default PokemonCardWrapper;
