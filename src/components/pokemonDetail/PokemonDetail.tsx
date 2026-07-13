import { Component } from 'react';
import styles from './pokemon.detail.module.css';
import type { PokemonDetails } from '../../types.ts';
import { pokemonService } from '../../services/pokemonService.ts';
import Alert from '../error/Alert.tsx';
import Loader from '../loader/Loader.tsx';
import TypeTag from '../typeTag/TypeTag.tsx';

interface PokemonDetailProps {
  pokemonId: number | undefined;
}

interface PokemonDetailState {
  details: PokemonDetails | null;
  loaded: boolean;
  error: string | null;
}

export class PokemonDetail extends Component<
  PokemonDetailProps,
  PokemonDetailState
> {
  state: PokemonDetailState = {
    details: null,
    loaded: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: PokemonDetailProps) {
    if (this.props.pokemonId !== prevProps.pokemonId) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    const { pokemonId } = this.props;
    if (!pokemonId) return;

    this.setState({ loaded: false, error: null });

    try {
      const details = await pokemonService.getById(pokemonId);
      this.setState({ details, loaded: true });
    } catch (e: unknown) {
      this.setState({
        error: e instanceof Error ? e.message : 'Cannot load details',
        loaded: true,
      });
    }
  };

  render() {
    const { details, loaded, error } = this.state;

    if (error) {
      return <Alert message={error} show={true} />;
    }

    if (!loaded) {
      return <Loader />;
    }

    if (!details) {
      return null;
    }

    return (
      <div className={styles.details}>
        {details.soundUrl && (
          <audio className={styles.audio} controls src={details.soundUrl} />
        )}
        <div>
          {details.types.map((type) => (
            <TypeTag key={type} type={type.toLowerCase()} />
          ))}
        </div>
        <div>
          <b>Abilities:</b> <i>{details.abilities.join(', ')}</i>
        </div>
        <div>
          <b>Weight:</b> <i>{details.weight}</i>
        </div>
        <div>
          <b>Height:</b> <i>{details.height}</i>
        </div>
      </div>
    );
  }
}

export default PokemonDetail;
