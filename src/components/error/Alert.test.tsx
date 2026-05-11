import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Alert from './Alert.tsx';

describe('Alert Component', () => {
  it('should render the alert with correct message', () => {
    const handleOnClose = vi.fn();
    render(<Alert show={true} message="Show Alert" onClose={handleOnClose} />);

    const alertElement = screen.getByText(/show alert/i);

    expect(alertElement).toBeInTheDocument();
  });

  it('should call onClose handler when clicked', () => {
    const handleOnClose = vi.fn();

    render(<Alert show={true} message="Close alert" onClose={handleOnClose} />);

    const closeButton = screen.getByRole('button', { name: /Close alert/i });

    fireEvent.click(closeButton);

    expect(handleOnClose).toHaveBeenCalledTimes(1);
  });

  // it('should hide Alert component when close button clicked', () => {
  //     const handleOnClose = vi.fn();
  //
  //     render(<Alert show={true} message="Close alert" onClose={handleOnClose} />);
  //
  //     const alertElement = screen.getByText(/show alert/i);
  //
  //     expect(alertElement).toBeInTheDocument();
  //
  //     const closeButton = screen.getByRole('button', { name: /Close alert/i });
  //
  //     fireEvent.click(closeButton);
  //
  //     expect(alertElement).not.toBeInTheDocument();
  // });
});
