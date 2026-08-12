import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';

vi.mock('./button.module.css', () => ({
  default: {
    button: 'mocked-button',
    primary: 'mocked-primary',
    customClass: 'mocked-custom',
  },
}));

describe('Button Component', () => {
  it('should render button with correct text and basic attributes', () => {
    const mockOnClick = vi.fn();
    render(
      <Button
        text="Click me"
        onClick={mockOnClick}
        buttonType="primary"
        ariaLabel="Submit Form"
      />
    );

    const button = screen.getByRole('button', { name: 'Submit Form' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<Button text="Click" onClick={mockOnClick} buttonType="default" />);

    const button = screen.getByRole('button', { name: 'Click' });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should apply buttonType class if className prop is missing', () => {
    render(<Button text="Btn" onClick={vi.fn()} buttonType="primary" />);

    const button = screen.getByRole('button', { name: 'Btn' });
    expect(button).toHaveClass('mocked-button');
    expect(button).toHaveClass('mocked-primary');
    expect(button).not.toHaveClass('mocked-custom');
  });

  it('should apply custom className instead of buttonType class if provided', () => {
    render(
      <Button
        text="Btn"
        onClick={vi.fn()}
        buttonType="primary"
        className="customClass"
      />
    );

    const button = screen.getByRole('button', { name: 'Btn' });
    expect(button).toHaveClass('mocked-button');
    expect(button).toHaveClass('customClass');
    expect(button).not.toHaveClass('mocked-primary');
  });
});
