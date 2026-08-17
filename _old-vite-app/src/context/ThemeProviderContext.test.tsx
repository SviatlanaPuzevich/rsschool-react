import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeProvider from './ContextThemeProvider.tsx';
import { useTheme } from '../hooks/useTheme';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <span>{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.dataset.theme = '';
  });

  it('should render default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('light')).toBeInTheDocument();
    expect(document.body.dataset.theme).toBe('light');
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.body.dataset.theme).toBe('dark');
  });

  it('should toggle theme', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: /toggle/i }));

    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.body.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
