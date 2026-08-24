import type { ReactNode } from 'react';
import './styles/normalize.css';
import './styles/globals.css';
import './styles/theme.css';

/**
 * The `<html>`/`<body>` tags live in `app/[locale]/layout.tsx`, because only
 * there the active locale is known (needed for `<html lang>`). This root layout
 * only exists for routes outside of the `[locale]` segment (e.g. the global
 * not-found page) and therefore just passes children through.
 */
const RootLayout = ({ children }: { children: ReactNode }) => children;

export default RootLayout;
