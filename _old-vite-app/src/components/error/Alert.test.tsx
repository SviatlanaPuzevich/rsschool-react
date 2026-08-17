import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Alert from './Alert.tsx';
import userEvent from '@testing-library/user-event';

describe('Alert Component', () => {
  it('should render the alert with correct message', () => {
    render(<Alert show={true} message="Show Alert" />);

    const alertElement = screen.getByText(/show alert/i);

    expect(alertElement).toBeInTheDocument();
  });

  it('should be closed when clicked on close button', async () => {
    const user = userEvent.setup();

    render(<Alert show={true} message="Close alert" />);

    const closeButton = screen.getByRole('button', { name: /Close alert/i });
    await user.click(closeButton);
    const alertContent = screen.queryByText(/Close alert/i);

    expect(alertContent).not.toBeInTheDocument();
  });

  it('should hide Alert component when show false', () => {
    render(<Alert show={false} message="Close alert" />);

    const alertElement = screen.queryByText(/show alert/i);

    expect(alertElement).not.toBeInTheDocument();
  });
});
