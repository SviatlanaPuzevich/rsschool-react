import { render, screen } from '@testing-library/react';
import Pagination from './Pagination.tsx';
import { vi } from 'vitest';

describe('Pagination element', () => {
  it('should not render if count of pages equals 1', () => {
    const handleChange = vi.fn();

    render(
      <Pagination count={1} currentPage={1} onPageChange={handleChange} />
    );

    const paginationElement = screen.queryByText('1');

    expect(paginationElement).not.toBeInTheDocument();
  });

  it('should render navigation buttons if count of pages more than one ', () => {
    const handleChange = vi.fn();

    render(
      <Pagination count={3} currentPage={2} onPageChange={handleChange} />
    );

    const navigationButtons = screen.getAllByRole('button');

    expect(navigationButtons).toHaveLength(2);
  });

  it('should render first 5 pages if count of pages more or equals 5 ', () => {
    const handleChange = vi.fn();

    render(
      <Pagination count={6} currentPage={2} onPageChange={handleChange} />
    );

    const paginationElements = screen.getAllByRole('link');

    expect(paginationElements).toHaveLength(5);
  });

  it('should render disabled forward button if the current page is the last page ', () => {
    const handleChange = vi.fn();

    render(
      <Pagination count={6} currentPage={6} onPageChange={handleChange} />
    );

    const nextButton = screen.getByRole('button', {
      name: /forward to next page/i,
    });

    expect(nextButton).toBeDisabled();
  });

  it('should render disabled back button if the current page is the first page ', () => {
    const handleChange = vi.fn();

    render(
      <Pagination count={20} currentPage={1} onPageChange={handleChange} />
    );

    const nextButton = screen.getByRole('button', {
      name: /back to previous page/i,
    });

    expect(nextButton).toBeDisabled();
  });
});
