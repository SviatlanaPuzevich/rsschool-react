import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import styles from './header.module.css';
import Header from './Header';
import { renderWithQueryClient } from '../../util/tests/testUtils.tsx';

vi.mock('../themeToggle/ThemeToggle.tsx', () => ({
  default: () => <button>Theme toggle</button>,
}));

describe('Header', () => {
  it('renders navigation links', () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'About creators' })
    ).toBeInTheDocument();
  });

  it('renders correct links', () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' })
    ).toHaveAttribute('href', '/search');

    expect(
      screen.getByRole('link', { name: 'About creators' })
    ).toHaveAttribute('href', '/about');
  });

  it('renders theme toggle', () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: 'Theme toggle' })
    ).toBeInTheDocument();
  });

  it('marks search link as active on search page', () => {
    renderWithQueryClient(
      <MemoryRouter initialEntries={['/search']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Pokemon Search/i })).toHaveClass(
      styles.activeLink
    );
  });

  it('marks about link as active on about page', () => {
    renderWithQueryClient(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /About creators/i })).toHaveClass(
      styles.activeLink
    );
  });
});
