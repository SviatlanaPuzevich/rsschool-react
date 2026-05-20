import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import { BASE_ROUTE, SEARCH } from '../../constants/routing.ts';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NotFoundPage', () => {
  it('should render the image and the button correctly', () => {
    vi.mocked(useNavigate).mockReturnValue(vi.fn());

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const image = screen.getByRole('img', { name: /resourece not found/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('Gemini_Generated_NOT_FOUND.png')
    );

    const button = screen.getByRole('button', { name: /return to home/i });
    expect(button).toBeInTheDocument();
  });

  it('should navigate to the home route when the button is clicked', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /return to home/i });

    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`${BASE_ROUTE}${SEARCH}/1`);
  });
});
