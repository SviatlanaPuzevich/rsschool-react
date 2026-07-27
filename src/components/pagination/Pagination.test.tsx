import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location">{location.search}</div>;
};

import Pagination from './Pagination';
import styles from './pagination.module.css';


describe('Pagination component', () => {
  it('should not render pagination when count is 1', () => {
    render(
      <MemoryRouter>
        <Pagination count={1} />
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText('Pagination')
    ).not.toBeInTheDocument();
  });


  it('should render pagination buttons', () => {
    render(
      <MemoryRouter>
        <Pagination count={5} />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });


  it('should show current page from search params', () => {
    render(
      <MemoryRouter initialEntries={['/search?page=3']}>
        <Pagination count={5} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toHaveClass(
      styles.activeLink
    );

    expect(
      screen.getByText('3')
    ).toHaveAttribute(
      'aria-current',
      'page'
    );
  });


  it('should disable previous button on first page', () => {
    render(
      <MemoryRouter>
        <Pagination count={5} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText('Previous page')
    ).toBeDisabled();
  });


  it('should disable next button on last page', () => {
    render(
      <MemoryRouter initialEntries={['/search?page=5']}>
        <Pagination count={5} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText('Next page')
    ).toBeDisabled();
  });


  it('should navigate to next page', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/search?page=2']}>
        <Pagination count={5} />
        <LocationDisplay />
      </MemoryRouter>
    );

    await user.click(
      screen.getByLabelText('Next page')
    );

    expect(screen.getByTestId('location')).toHaveTextContent('?page=3');
  });


  it('should navigate to previous page', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/search?page=3']}>
        <Pagination count={5} />
        <LocationDisplay />
      </MemoryRouter>
    );

    await user.click(
      screen.getByLabelText('Previous page')
    );

    expect(screen.getByTestId('location')).toHaveTextContent('?page=2');
  });


  it('should remove page param when navigating to first page', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/search?page=2']}>
        <Pagination count={5} />
      </MemoryRouter>
    );

    await user.click(
      screen.getByText('1')
    );

    expect(window.location.search).toBe('');
  });


  it('should navigate when clicking page number', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Pagination count={5} />
        <LocationDisplay />
      </MemoryRouter>
    );

    await user.click(
      screen.getByText('4')
    );

    expect(screen.getByTestId('location')).toHaveTextContent('?page=4');
  });
});