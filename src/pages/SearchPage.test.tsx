import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from './SearchPage';
import { vi } from 'vitest';

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

    expect(await screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      await screen.getByRole('button', { name: /search/i })
    ).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', async () => {
    localStorage.setItem('query', 'Pikachu');
    render(<SearchPage />);

    const input = (await screen.getByRole('textbox')) as HTMLInputElement;
    expect(input.value).toBe('Pikachu');
  });

  it('shows empty input when no saved term exists', async () => {
    render(<SearchPage />);

    const input = (await screen.getByRole('textbox')) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates input value when user types', async () => {
    render(<SearchPage />);
    const input = (await screen.getByRole('textbox')) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input.value).toBe('bulbasaur');
  });
});

describe('Error Boundary Component', async () => {
  it('catches and handles JavaScript errors in child components', async () => {
    render(<SearchPage />);

    const generateErrorButton = await screen.findByText(/Generate Exception/i);

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.click(generateErrorButton);

    expect(
      screen.getByText(/Here is test for error boundary/, {
        exact: false,
      })
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it('should log an error to the console', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<SearchPage />);
    const btn = screen.getByText(/Generate Exception/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
