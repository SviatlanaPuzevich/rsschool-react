import { createBrowserRouter, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/main/MainLayout.tsx';
import SearchPage from '../pages/searchPage/SearchPage.tsx';
import AboutPage from '../pages/about/AboutPage.tsx';
import NotFoundPage from '../pages/notFound/NotFoundPage.tsx';
import EmptyLayout from '../layouts/empty/EmptyLayout.tsx';
import ErrorBoundary from '../components/errorBoundary/ErrorBoundary.tsx';

export const routerConfig = [
  {
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <SearchPage />,
          },
          {
            path: 'search',
            element: <SearchPage />,
          },
          {
            path: 'about',
            element: <AboutPage />,
          },
        ],
      },
      {
        element: <EmptyLayout />,
        children: [
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routerConfig, {
  basename: import.meta.env.BASE_URL,
});
