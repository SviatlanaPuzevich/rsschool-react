import { render, screen, waitFor } from '@testing-library/react';
import SearchPage from './SearchPage';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ERROR_MESSAGE, LOADING } from '../constants/messages.ts';

const mockPokemonData = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'Mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'pigeon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
  ],
};

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockPokemonData,
  });
  localStorage.clear();
});

describe('SearchBar Component', async () => {
  it('renders search input and search button', async () => {
    render(<SearchPage />);

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /search/i })
    ).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', async () => {
    localStorage.setItem('query', 'pikachu');
    render(<SearchPage />);

    const input = (await screen.findByRole('textbox')) as HTMLInputElement;

    expect(input.value).toBe('pikachu');
  });

  it('shows empty input when no saved term exists', async () => {
    render(<SearchPage />);

    const input = (await screen.findByRole('textbox')) as HTMLInputElement;

    expect(input.value).toBe('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const input = (await screen.findByRole('textbox')) as HTMLInputElement;

    await user.type(input, 'bulbasaur');

    expect(input.value).toBe('bulbasaur');
  });
});

describe('Error Boundary Component', async () => {
  it('catches and handles JavaScript errors in child components', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const generateErrorButton = await screen.findByText(/Generate Exception/i);

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await user.click(generateErrorButton);

    expect(
      await screen.findByText(ERROR_MESSAGE.BOUNDARY_ERROR)
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it('should log an error to the console', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<SearchPage />);
    const btn = screen.getByText(/Generate Exception/i);
    await user.click(btn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});

describe('Alert Component', async () => {
  it('shows error message when server request fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Server error'));

    render(<SearchPage />);

    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });
});

describe('On the search page', async () => {
  it('shows loading message while data is loading', () => {
    global.fetch = vi.fn(() => new Promise<Response>(() => {}));

    render(<SearchPage />);

    expect(screen.getByText(LOADING)).toBeInTheDocument();
  });
});
