import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import AboutPage from './AboutPage';

vi.mock('../../components/button/Button.tsx', () => ({
  default: ({ value, onClick }) => <button onClick={onClick}>{value}</button>,
}));

describe('AboutPage', () => {
  it('renders main text content', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Sup\. I’m Snorlax/i)).toBeInTheDocument();
  });

  it('renders avatar image with correct attributes', () => {
    render(<AboutPage />);

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('alt', 'Snorlax-programmer');
  });

  it('renders RS school button', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('button', { name: /go to rs school/i })
    ).toBeInTheDocument();
  });

  it('redirects to RS school on click', async () => {
    const user = userEvent.setup();

    delete window.location;
    window.location = { href: '' };

    render(<AboutPage />);

    const button = screen.getByRole('button', {
      name: /go to rs school/i,
    });

    await user.click(button);

    expect(window.location.href).toBe('https://rs.school/');
  });
});
