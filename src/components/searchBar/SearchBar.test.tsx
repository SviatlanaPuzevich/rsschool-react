import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    query: '',
    onSearch: vi.fn(),
    onQueryChange: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input with correct initial value and placeholder', () => {
    render(<SearchBar {...defaultProps} query="Pikachu" />);

    const input = screen.getByPlaceholderText(
      'Enter pokemon name...'
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Pikachu');
  });

  it('should call onQueryChange when typing in the input field', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter pokemon name...');

    await user.type(input, 'a');

    expect(defaultProps.onQueryChange).toHaveBeenCalledWith('a');
    expect(defaultProps.onQueryChange).toHaveBeenCalledTimes(1);
  });

  it('should call onSearch when Search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);

    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onError when Generate Exception button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const errorButton = screen.getByRole('button', {
      name: 'Generate Exception',
    });
    await user.click(errorButton);

    expect(defaultProps.onError).toHaveBeenCalledTimes(1);
  });
});
