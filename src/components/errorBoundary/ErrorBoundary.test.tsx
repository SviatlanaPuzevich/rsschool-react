import { render, screen } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockInstance,
} from 'vitest';
import ErrorBoundary from './ErrorBoundary'; // Скорректируйте путь к файлу
import { ERROR_MESSAGE } from '../../constants/messages.ts';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  let consoleSpy: MockInstance;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Safe Content')).toBeInTheDocument();
    expect(
      screen.queryByText(ERROR_MESSAGE.BOUNDARY_ERROR)
    ).not.toBeInTheDocument();
  });

  it('should render fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(ERROR_MESSAGE.BOUNDARY_ERROR)).toBeInTheDocument();
  });

  it('should log the error to the console via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});
