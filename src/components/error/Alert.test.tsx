import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Alert from './Alert.tsx';
import userEvent from '@testing-library/user-event';

describe('Alert Component', () => {
  it('should render the alert with correct message', () => {
    render(<Alert message="Show Alert" />);

    const alertElement = screen.getByText(/show alert/i);

    expect(alertElement).toBeInTheDocument();
  });

  it('should call onClose handler when clicked', async () => {
    const user = userEvent.setup();
    const handleOnClose = vi.fn();

    render(<Alert message="Close alert" />);

    const closeButton = screen.getByRole('button', { name: /Close alert/i });

    await user.click(closeButton);

    expect(handleOnClose).toHaveBeenCalledTimes(1);
  });

  it('should hide Alert component when show false', () => {
    render(<Alert message="Close alert" />);

    const alertElement = screen.queryByText(/show alert/i);

    expect(alertElement).not.toBeInTheDocument();
  });
});
