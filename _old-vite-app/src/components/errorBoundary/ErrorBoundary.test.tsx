import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ProblematicComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(
      screen.queryByText(/Here is test for error boundary/i)
    ).not.toBeInTheDocument();
  });

  it('should render error message and button when a child component crashes', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/Here is test for error boundary/i)
    ).toBeInTheDocument();
    expect(screen.queryByText('Normal Content')).not.toBeInTheDocument();
  });

  it('should call window.location.reload when reload button is clicked', async () => {
    const user = userEvent.setup();

    const reloadMock = vi.fn();
    vi.stubGlobal('location', { reload: reloadMock });

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', {
      name: /Back to application/i,
    });
    await user.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });
});
