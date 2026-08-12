import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import styles from './header.module.css';

import Header from './Header';

vi.mock('../themeToggle/ThemeToggle.tsx', () => ({
  default: () => <button>Theme toggle</button>,
}));

describe('Header', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'About creators' }),
    ).toBeInTheDocument();
  });

  it('renders correct links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' }),
    ).toHaveAttribute('href', '/search');

    expect(
      screen.getByRole('link', { name: 'About creators' }),
    ).toHaveAttribute('href', '/about');
  });

  it('renders theme toggle', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: 'Theme toggle' }),
    ).toBeInTheDocument();
  });

  it('marks search link as active on search page', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Pokemon Search/i })).toHaveClass(
      styles.activeLink
    );
  });

  it('marks about link as active on about page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /About creators/i })).toHaveClass(styles.activeLink);
  });
});
