'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ThemeProvider from '../context/ContextThemeProvider';
import { makeQueryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
