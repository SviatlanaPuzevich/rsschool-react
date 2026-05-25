import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeToggle from './ThemeToggle';

const toggleTheme = vi.fn();

const mockUseTheme = vi.fn();

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dark button when theme is light', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', {
        name: /dark/i,
      })
    ).toBeInTheDocument();
  });

  it('should render light button when theme is dark', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme,
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', {
        name: /light/i,
      })
    ).toBeInTheDocument();
  });

  it('should call toggleTheme on click', async () => {
    const user = userEvent.setup();

    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    expect(toggleTheme).toHaveBeenCalledOnce();
  });
});
