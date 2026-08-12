import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routerConfig } from './router';
import ThemeProvider from './context/ContextThemeProvider.tsx';

const renderRouter = (initialEntries: string[]) => {
  const memoryRouter = createMemoryRouter(routerConfig, {
    initialEntries,
    initialIndex: 0,
    basename: import.meta.env.BASE_URL || '/',
  });

  return render(
    <ThemeProvider>
      <RouterProvider router={memoryRouter} />
    </ThemeProvider>
  );
};

describe('App Routing', () => {
  it('should render SearchPage on root path (/)', async () => {
    renderRouter(['/']);

    const element = await screen.findByText(/Find your pokemon/i);
    expect(element).toBeInTheDocument();
  });

  it('should render SearchPage on /search path', async () => {
    renderRouter(['/search']);

    const element = await screen.findByText(/Find your pokemon/i);
    expect(element).toBeInTheDocument();
  });

  it('should render AboutPage on /about path', async () => {
    renderRouter(['/about']);

    const element = await screen.findByText(/I’m Snorlax/i);
    expect(element).toBeInTheDocument();
  });

  it('should render NotFoundPage on unknown path', async () => {
    renderRouter(['/unknown-path']);

    const button = await screen.findByRole('button', {
      name: /return to home/i,
    });
    expect(button).toBeInTheDocument();
  });
});
