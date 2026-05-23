import styles from './flyout.module.css';
import usePokemonStore from '../../stores/usePokemonStore.ts';
import Button from '../button/Button.tsx';

const Flyout = () => {
  const selectedPokemon = usePokemonStore((state) => state.selectedPokemons);
  const reset = usePokemonStore((state) => state.resetSelected);

  if (selectedPokemon.length === 0) {
    return null;
  }

  const handleDownload = () => {};

  return (
    <div className={styles.flyout}>
      <span>{`${selectedPokemon.length} selected ${selectedPokemon.length > 1 ? 'pokemons' : 'pokemon'}`}</span>
      <Button onClick={reset} buttonType="primary" value="Unselect all" />
      <Button onClick={handleDownload} buttonType="primary" value="Download" />
    </div>
  );
};

export default Flyout;
