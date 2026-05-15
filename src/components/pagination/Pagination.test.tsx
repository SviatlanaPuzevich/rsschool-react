import { render, screen } from '@testing-library/react';
import Pagination from './Pagination.tsx';

describe('Pagination element', () => {
  it('should not render if count of pages equals 1', () => {
    render(<Pagination count={1} />);

    const paginationElement = screen.queryByText('1');

    expect(paginationElement).not.toBeInTheDocument();
  });

  it('should render navigation buttons if count of pages more than one ', () => {
    render(<Pagination count={3} />);

    const navigationButtons = screen.getAllByRole('button');

    expect(navigationButtons).toHaveLength(2);
  });

  it('should render first 5 pages if count of pages more or equals 5 ', () => {
    render(<Pagination count={6} />);

    const paginationElements = screen.getAllByRole('link');

    expect(paginationElements).toHaveLength(5);
  });

  it('should render disabled forward button if the current page is the last page ', () => {
    render(<Pagination count={6} />);

    const nextButton = screen.getByRole('button', {
      name: /forward to next page/i,
    });

    expect(nextButton).toBeDisabled();
  });

  it('should render disabled back button if the current page is the first page ', () => {
    render(<Pagination count={20} />);

    const nextButton = screen.getByRole('button', {
      name: /back to previous page/i,
    });

    expect(nextButton).toBeDisabled();
  });
});
