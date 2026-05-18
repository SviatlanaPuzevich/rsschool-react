import { render, screen } from '@testing-library/react';
import Alert from './Alert.tsx';
import userEvent from '@testing-library/user-event';

describe('Alert Component', () => {
  it('should render the alert with correct message', () => {
    render(<Alert message="Show Alert" />);

    const alertElement = screen.getByText(/show alert/i);

    expect(alertElement).toBeInTheDocument();
  });

  it('should remove Alert component when clicked close', async () => {
    const user = userEvent.setup();
    render(<Alert message="Close alert" />);

    const alertElement = screen.getByText(/Close alert/i);
    const closeButton = screen.getByRole('button', { name: /Close alert/i });
    await user.click(closeButton);

    expect(alertElement).not.toBeInTheDocument();
  });
});
