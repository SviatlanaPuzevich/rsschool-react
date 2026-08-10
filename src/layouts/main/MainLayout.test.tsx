import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';

vi.mock('./main.layout.module.css', () => ({
  default: {
    layout: 'mocked-layout-class',
  },
}));

vi.mock('../../components/header/Header.tsx', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

describe('MainLayout', () => {
  it('should render Header and content through Outlet correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<div data-testid="child-element">Test Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    const child = screen.getByTestId('child-element');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Test Content');
  });

  it('should apply correct CSS module class to the main wrapper div', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    const layoutWrapper = mainElement.parentElement;
    expect(layoutWrapper).toHaveClass('mocked-layout-class');
  });
});
