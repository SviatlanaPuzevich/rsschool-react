import styles from './flyout.module.css';
import usePokemonStore from '../../stores/usePokemonStore';
import Button from '../button/Button';

const Flyout = () => {
  const selectedPokemon = usePokemonStore((state) => state.selectedPokemons);
  const reset = usePokemonStore((state) => state.resetSelected);
  const downloadSelectedPokemons = usePokemonStore(
    (state) => state.downloadSelectedPokemons
  );
  const isDownloading = usePokemonStore((state) => state.isDownloading);

  if (selectedPokemon.length === 0) {
    return null;
  }

  return (
    <div className={styles.flyout}>
      <span>{`${selectedPokemon.length} selected ${selectedPokemon.length > 1 ? 'pokemons' : 'pokemon'}`}</span>
      <Button onClick={reset} buttonType="primary" text="Unselect all" />
      <Button
        text={isDownloading ? 'Downloading...' : 'Download'}
        buttonType="primary"
        onClick={downloadSelectedPokemons}
        disabled={isDownloading}
      />
    </div>
  );
};

export default Flyout;
