import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component Integration', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/rsschool-react/');
  });

  it('should render the home page', async () => {
    render(<App />);

    const mainElement = await screen.findByText(/Find your pokemon/i);
    expect(mainElement).toBeInTheDocument();
  });
});
