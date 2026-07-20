import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import SearchPage from './SearchPage';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';


describe('SearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads and displays pokemons', async () => {
    render(<SearchPage />);

    expect(screen.getByText('LOADING...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('uses query from localStorage', async () => {
    localStorage.setItem('query', 'pika');

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('filters pokemons after search', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, 'bulb');
    await user.click(
      screen.getByRole('button', {
        name: /search/i,
      }),
    );

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
    expect(localStorage.getItem('query')).toBe('bulb');
  });


  it('shows alert when api fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return HttpResponse.error();
      }),
    );

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
