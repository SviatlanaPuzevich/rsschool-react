import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { delay, http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import PokemonDetail from './PokemonDetail';
import { server } from '../../mocks/server';
import { renderWithQueryClient } from '../../util/tests/testUtils.tsx';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location">{location.search}</div>;
};

const renderPokemonDetail = (
  id = 25,
  initialEntry = '/search?page=2&details=25'
) => {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={[initialEntry]}>
      <PokemonDetail id={id} />
      <LocationDisplay />
    </MemoryRouter>
  );
};

describe('PokemonDetail', () => {
  it('should show skeleton while pokemon details are loading', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/:id', async () => {
        await delay(100);
        return HttpResponse.json({
          id: 25,
          name: 'pikachu',
          height: 4,
          weight: 60,
          cries: {
            latest: 'pikachu.mp3',
          },
          abilities: [],
          types: [],
          sprites: {
            front_default: null,
            back_default: null,
            front_shiny: null,
            back_shiny: null,
          },
          stats: [],
        });
      })
    );

    renderPokemonDetail();

    expect(document.querySelector('[class*="bone"]')).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'pikachu' })
    ).not.toBeInTheDocument();
  });

  it('should load and display pokemon details', async () => {
    renderPokemonDetail();

    expect(
      await screen.findByRole('heading', { name: 'pikachu' })
    ).toBeInTheDocument();

    expect(screen.getByText('#25')).toBeInTheDocument();

    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6 kg')).toBeInTheDocument();

    expect(screen.getByText('static, lightning-rod')).toBeInTheDocument();
  });

  it('should display pokemon types', async () => {
    renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('should display all pokemon sprites', async () => {
    renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    expect(screen.getByRole('img', { name: 'pikachu front' })).toHaveAttribute(
      'src',
      'pikachu-front.png'
    );

    expect(screen.getByRole('img', { name: 'pikachu back' })).toHaveAttribute(
      'src',
      'pikachu-back.png'
    );

    expect(
      screen.getByRole('img', { name: 'pikachu shiny front' })
    ).toHaveAttribute('src', 'pikachu-front-shiny.png');

    expect(
      screen.getByRole('img', { name: 'pikachu shiny back' })
    ).toHaveAttribute('src', 'pikachu-back-shiny.png');
  });

  it('should display pokemon cry', async () => {
    const { container } = renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    const audioElement = container.querySelector('audio');
    expect(audioElement).toBeInTheDocument();
    expect(audioElement).toHaveAttribute('src', 'pikachu.mp3');
  });

  it('should display pokemon base stats', async () => {
    renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    expect(screen.getByText('Base stats')).toBeInTheDocument();

    expect(screen.getByText('hp')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();

    expect(screen.getByText('attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();

    expect(screen.getByText('defense')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();

    expect(screen.getByText('special-attack')).toBeInTheDocument();
    expect(screen.getByText('special-defense')).toBeInTheDocument();

    expect(screen.getByText('speed')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('should render progress bars with correct values', async () => {
    renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    const hpProgress = screen.getByRole('progressbar', {
      name: 'hp 35',
    });

    expect(hpProgress).toHaveAttribute('aria-valuenow', '35');
    expect(hpProgress).toHaveAttribute('aria-valuemin', '0');
    expect(hpProgress).toHaveAttribute('aria-valuemax', '255');

    const speedProgress = screen.getByRole('progressbar', {
      name: 'speed 90',
    });

    expect(speedProgress).toHaveAttribute('aria-valuenow', '90');
  });

  it('should show error when pokemon details cannot be loaded', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/:id', () => {
        return new HttpResponse(null, {
          status: 500,
        });
      })
    );

    renderPokemonDetail();

    const closeButton = await screen.findByRole('button', {
      name: /close alert/i,
    });
    expect(closeButton).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'pikachu' })
    ).not.toBeInTheDocument();
  });

  it('should remove details parameter when close button is clicked', async () => {
    const user = userEvent.setup();

    renderPokemonDetail();

    await screen.findByRole('heading', { name: 'pikachu' });

    expect(screen.getByTestId('location')).toHaveTextContent(
      '?page=2&details=25'
    );

    await user.click(
      screen.getByRole('button', {
        name: '×',
      })
    );

    expect(screen.getByTestId('location')).toHaveTextContent('?page=2');
    expect(screen.getByTestId('location')).not.toHaveTextContent('details=25');
  });
});
