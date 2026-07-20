import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TypeTag from './TypeTag';

vi.mock('./type.tag.module.css', () => ({
  default: {
    tag: 'mocked-tag-class',
    fire: 'mocked-fire-class',
  },
}));

describe('TypeTag', () => {
  it('should render the type text correctly', () => {
    render(<TypeTag type="water" />);

    const tagElement = screen.getByText('water');
    expect(tagElement).toBeInTheDocument();
  });

  it('should apply the matching CSS module class based on type', () => {
    render(<TypeTag type="fire" />);

    const tagElement = screen.getByText('fire');

    expect(tagElement).toHaveClass('mocked-tag-class');
    expect(tagElement).toHaveClass('mocked-fire-class');
  });

  it('should not apply an additional type class if it does not exist in styles', () => {
    render(<TypeTag type="unknown-type" />);

    const tagElement = screen.getByText('unknown-type');

    expect(tagElement).toHaveClass('mocked-tag-class');
    expect(tagElement.className).toBe('mocked-tag-class ');
  });
});
