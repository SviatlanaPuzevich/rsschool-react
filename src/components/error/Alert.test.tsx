import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Alert from './Alert.tsx';
import userEvent from '@testing-library/user-event';

describe('Alert Component', () => {
  it('should render the alert with correct message', () => {
    const handleOnClose = vi.fn();
    render(<Alert show={true} message="Show Alert" onClose={handleOnClose} />);

    const alertElement = screen.getByText(/show alert/i);

    expect(alertElement).toBeInTheDocument();
  });

  it('should call onClose handler when clicked', async () => {
    const user = userEvent.setup();
    const handleOnClose = vi.fn();

    render(<Alert show={true} message="Close alert" onClose={handleOnClose} />);

    const closeButton = screen.getByRole('button', { name: /Close alert/i });

    await user.click(closeButton);

    expect(handleOnClose).toHaveBeenCalledTimes(1);
  });

  it('should hide Alert component when show false', () => {
    const handleOnClose = vi.fn();

    render(
      <Alert show={false} message="Close alert" onClose={handleOnClose} />
    );

    const alertElement = screen.queryByText(/show alert/i);

    expect(alertElement).not.toBeInTheDocument();
  });
});
