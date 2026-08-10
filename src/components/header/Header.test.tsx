import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

vi.mock('./header.module.css', () => ({
  default: {
    header: 'mocked-header',
    nav: 'mocked-nav',
    link: 'mocked-link',
    activeLink: 'mocked-active-link',
  },
}));

describe('Header Component', () => {
  it('should render navigation links with correct text and attributes', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const searchLink = screen.getByRole('link', { name: /pokemon search/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');

    const aboutLink = screen.getByRole('link', { name: /about creators/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should apply active class to the Search link when URL is /search', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Header />
      </MemoryRouter>
    );

    const searchLink = screen.getByRole('link', { name: /pokemon search/i });
    const aboutLink = screen.getByRole('link', { name: /about creators/i });

    expect(searchLink).toHaveClass('mocked-link');
    expect(searchLink).toHaveClass('mocked-active-link');

    expect(aboutLink).toHaveClass('mocked-link');
    expect(aboutLink).not.toHaveClass('mocked-active-link');
  });

  it('should apply active class to the About link when URL is /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );

    const searchLink = screen.getByRole('link', { name: /pokemon search/i });
    const aboutLink = screen.getByRole('link', { name: /about creators/i });

    expect(aboutLink).toHaveClass('mocked-link');
    expect(aboutLink).toHaveClass('mocked-active-link');

    expect(searchLink).toHaveClass('mocked-link');
    expect(searchLink).not.toHaveClass('mocked-active-link');
  });
});
