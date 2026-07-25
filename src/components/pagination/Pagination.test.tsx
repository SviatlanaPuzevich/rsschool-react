import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('does not render when count is less than or equal to 1', () => {
    const { container } = render(
      <Pagination count={1} currentPage={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders pages and highlights current page', () => {
    render(<Pagination count={10} currentPage={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '5' })).toBeInTheDocument();

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      '3'
    );
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination count={10} currentPage={3} onPageChange={onPageChange} />
    );

    await user.click(screen.getByRole('link', { name: '5' }));

    expect(onPageChange).toHaveBeenCalledWith(5);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination count={10} currentPage={3} onPageChange={onPageChange} />
    );

    await user.click(
      screen.getByRole('button', {
        name: /forward to next page/i,
      })
    );

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination count={10} currentPage={3} onPageChange={onPageChange} />
    );

    await user.click(
      screen.getByRole('button', {
        name: /back to previous page/i,
      })
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination count={10} currentPage={1} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('button', {
        name: /back to previous page/i,
      })
    ).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination count={10} currentPage={10} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('button', {
        name: /forward to next page/i,
      })
    ).toBeDisabled();
  });

  it('shows last five pages when current page is near the end', () => {
    render(<Pagination count={10} currentPage={9} onPageChange={vi.fn()} />);

    expect(screen.getByRole('link', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '10' })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: '5' })).not.toBeInTheDocument();
  });
});
