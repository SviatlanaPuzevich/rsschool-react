import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnQueryChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the input field and buttons correctly', () => {
    render(
      <SearchBar
        query="Pika"
        onSearch={mockOnSearch}
        onQueryChange={mockOnQueryChange}
      />
    );

    const input = screen.getByPlaceholderText(
      /enter pokemon name/i
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Pika');

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate exception/i })
    ).toBeInTheDocument();
  });

  it('should call onQueryChange when user types in the input', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        query=""
        onSearch={mockOnSearch}
        onQueryChange={mockOnQueryChange}
      />
    );

    const input = screen.getByPlaceholderText(/enter pokemon name\.\.\./i);

    await user.type(input, 'm');

    expect(mockOnQueryChange).toHaveBeenCalledTimes(1);
    expect(mockOnQueryChange).toHaveBeenCalled();
  });

  it('should call onSearch when the Search button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        query="Bulbasaur"
        onSearch={mockOnSearch}
        onQueryChange={mockOnQueryChange}
      />
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when "Generate Exception" button is clicked', async () => {
    const user = userEvent.setup();

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <SearchBar
        query=""
        onSearch={mockOnSearch}
        onQueryChange={mockOnQueryChange}
      />
    );

    const exceptionButton = screen.getByRole('button', {
      name: /generate exception/i,
    });

    await expect(async () => {
      await user.click(exceptionButton);
    }).rejects.toThrow('This error was generated');

    consoleSpy.mockRestore();
  });
});
