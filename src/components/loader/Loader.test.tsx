import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Loader from './Loader';

it('should render loading text correctly', () => {
  render(<Loader />);

  const loadingElement = screen.getByText('LOADING...');

  expect(loadingElement).toBeInTheDocument();
});
