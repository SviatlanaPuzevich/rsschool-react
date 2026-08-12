import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location">{location.pathname}</div>;
};

describe('NotFoundPage', () => {
  it('should render not found image', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Resourece not found')).toBeInTheDocument();
  });

  it('should render return home button', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', {
        name: 'Return to home',
      })
    ).toBeInTheDocument();
  });

  it('should navigate to search page after button click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/404']}>
        <NotFoundPage />
        <LocationDisplay />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Return to home',
      })
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/search');
  });
});
