import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import { BASE_ROUTE, SEARCH } from '../../constants/routing';
import ThemeProvider from '../../context/ContextThemeProvider.tsx';

const renderWithRouter = (initialEntries = [`${BASE_ROUTE}${SEARCH}/1`]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={`${BASE_ROUTE}${SEARCH}/:page`} element={<ThemeProvider><Header /></ThemeProvider>} />
        <Route path="/about" element={<ThemeProvider><Header /></ThemeProvider>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  it('renders navigation links', () => {
    renderWithRouter([`${BASE_ROUTE}${SEARCH}/1`]);

    expect(
      screen.getByRole('link', { name: /pokemon search/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /about creators/i })
    ).toBeInTheDocument();
  });

  it('uses current page in search link href', () => {
    renderWithRouter([`${BASE_ROUTE}${SEARCH}/5`]);

    const searchLink = screen.getByRole('link', {
      name: /pokemon search/i,
    });

    expect(searchLink).toHaveAttribute('href', `${BASE_ROUTE}${SEARCH}/5`);
  });

  it('uses page 1 by default', () => {
    renderWithRouter([`${BASE_ROUTE}${SEARCH}/1`]);

    const searchLink = screen.getByRole('link', {
      name: /pokemon search/i,
    });

    expect(searchLink).toHaveAttribute('href', `${BASE_ROUTE}${SEARCH}/1`);
  });

  it('about link has correct href', () => {
    renderWithRouter([`${BASE_ROUTE}${SEARCH}/1`]);

    const aboutLink = screen.getByRole('link', {
      name: /about creators/i,
    });

    expect(aboutLink).toHaveAttribute('href', `${BASE_ROUTE}/about`);
  });
});
