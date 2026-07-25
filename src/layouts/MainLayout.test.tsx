import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MainLayout from './MainLayout';

vi.mock('./main.layout.module.css', () => ({
  default: {
    container: 'mocked-container-class',
  },
}));

describe('MainLayout', () => {
  it('should render children elements correctly', () => {
    render(
      <MainLayout>
        <div data-testid="child-element">Test Content</div>
      </MainLayout>
    );

    const child = screen.getByTestId('child-element');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Test Content');
  });

  it('should apply correct CSS module class to the main tag', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');

    expect(mainElement).toHaveClass('mocked-container-class');
  });
});
