import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import styles from './header.module.css';
import Header from './Header';
import { renderWithQueryClient } from '@/util/tests/testUtils';

const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('../themeToggle/ThemeToggle.tsx', () => ({
  default: () => <button>Theme toggle</button>,
}));

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders navigation links', () => {
    renderWithQueryClient(<Header />);

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'About creators' })
    ).toBeInTheDocument();
  });

  it('renders correct links', () => {
    renderWithQueryClient(<Header />);

    expect(
      screen.getByRole('link', { name: 'Pokemon Search' })
    ).toHaveAttribute('href', '/search');

    expect(
      screen.getByRole('link', { name: 'About creators' })
    ).toHaveAttribute('href', '/about');
  });

  it('renders theme toggle', () => {
    renderWithQueryClient(<Header />);

    expect(
      screen.getByRole('button', { name: 'Theme toggle' })
    ).toBeInTheDocument();
  });

  it('marks search link as active on search page', () => {
    mockUsePathname.mockReturnValue('/search');

    renderWithQueryClient(<Header />);

    expect(screen.getByRole('link', { name: /Pokemon Search/i })).toHaveClass(
      styles.activeLink
    );

    expect(
      screen.getByRole('link', { name: /About creators/i })
    ).not.toHaveClass(styles.activeLink);
  });

  it('marks about link as active on about page', () => {
    mockUsePathname.mockReturnValue('/about');

    renderWithQueryClient(<Header />);

    expect(screen.getByRole('link', { name: /About creators/i })).toHaveClass(
      styles.activeLink
    );

    expect(
      screen.getByRole('link', { name: /Pokemon Search/i })
    ).not.toHaveClass(styles.activeLink);
  });
});
