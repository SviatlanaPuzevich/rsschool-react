import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Pagination from './Pagination';
import {BASE_ROUTE, SEARCH} from '../../constants/routing';

const renderWithRouter = (
  ui: React.ReactElement,
  route = `${BASE_ROUTE}${SEARCH}/1`
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={`${BASE_ROUTE}${SEARCH}/:page`} element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Pagination', () => {
  it('returns null when count <= 1', () => {
    const { container } = renderWithRouter(<Pagination count={1} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders pagination links for small range', () => {
    renderWithRouter(<Pagination count={3} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders correct range around current page (middle)', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/5`);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders correct range near start', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/2`);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders correct range near end', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/9`);

    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('prev link points to previous page', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/5`);

    const prev = screen.getByText('<');

    expect(prev).toHaveAttribute('href', `${BASE_ROUTE}${SEARCH}/4`);
  });

  it('next link points to next page', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/5`);

    const next = screen.getByText('>');

    expect(next).toHaveAttribute('href', `${BASE_ROUTE}${SEARCH}/6`);
  });

  it('prev is disabled on first page', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/1`);

    const prev = screen.getByText('<');

    expect(prev.className).toMatch(/disabled/);
  });

  it('next is disabled on last page', () => {
    renderWithRouter(<Pagination count={10} />, `${BASE_ROUTE}${SEARCH}/10`);

    const next = screen.getByText('>');

    expect(next.className).toMatch(/disabled/);
  });
});
