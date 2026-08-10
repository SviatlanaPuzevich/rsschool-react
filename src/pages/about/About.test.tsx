import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('should render avatar image', () => {
    render(<AboutPage />);

    expect(screen.getByAltText('Snorlax-programmer')).toBeInTheDocument();
  });

  it('should render about information', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Human Bottleneck/i)).toBeInTheDocument();

    expect(screen.getByText(/Tech Stack:/i)).toBeInTheDocument();
  });

  it('should render RS school button', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('button', {
        name: 'Go to RS school',
      })
    ).toBeInTheDocument();
  });

  it('should redirect to RS school on button click', async () => {
    const user = userEvent.setup();

    const hrefSetter = vi.fn();

    Object.defineProperty(window, 'location', {
      value: {
        set href(value: string) {
          hrefSetter(value);
        },
      },
      writable: true,
    });

    render(<AboutPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'Go to RS school',
      })
    );

    expect(hrefSetter).toHaveBeenCalledWith('https://rs.school/');
  });
});
