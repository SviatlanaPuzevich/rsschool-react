import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Button from './Button.tsx';

describe('Button Component', () => {
  it('should render the button with correct value', () => {
    render(<Button value="Click me" onClick={() => {}} buttonType="primary" />);

    const buttonElement = screen.getByText(/click me/i);

    expect(buttonElement).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button buttonType="primary" value="Submit" onClick={handleClick} />
    );

    const buttonElement = screen.getByText(/submit/i);

    await user.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
