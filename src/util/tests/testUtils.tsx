import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const renderWithQueryClient = (
  ui: React.ReactElement,
  queryClient = createTestQueryClient()
) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
