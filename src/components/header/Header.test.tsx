import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import { BASE_ROUTE } from '../../constants/routing';

const renderWithRouter = (initialEntries = [`${BASE_ROUTE}/1`]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={`${BASE_ROUTE}/:page`} element={<Header />} />
        <Route path="/about" element={<Header />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  it('renders navigation links', () => {
    renderWithRouter([`${BASE_ROUTE}/1`]);

    expect(
      screen.getByRole('link', { name: /pokemon search/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /about creators/i })
    ).toBeInTheDocument();
  });

  it('uses current page in search link href', () => {
    renderWithRouter([`${BASE_ROUTE}/5`]);

    const searchLink = screen.getByRole('link', {
      name: /pokemon search/i,
    });

    expect(searchLink).toHaveAttribute('href', `${BASE_ROUTE}/5`);
  });

  it('uses page 1 by default', () => {
    renderWithRouter([`${BASE_ROUTE}/1`]);

    const searchLink = screen.getByRole('link', {
      name: /pokemon search/i,
    });

    expect(searchLink).toHaveAttribute('href', `${BASE_ROUTE}/1`);
  });
  //
  // it('keeps current page when pokemonId exists', () => {
  //   renderWithRouter([`${BASE_ROUTE}/5/40`]);
  //
  //   const searchLink = screen.getByRole('link', {
  //     name: /pokemon search/i,
  //   });
  //
  //   expect(searchLink).toHaveAttribute('href', `${BASE_ROUTE}/5`);
  // });
  //
  // it('about link has correct href', () => {
  //   renderWithRouter([`${BASE_ROUTE}/1`]);
  //
  //   const aboutLink = screen.getByRole('link', {
  //     name: /about creators/i,
  //   });
  //
  //   expect(aboutLink).toHaveAttribute('href', '/about');
  // });
});
