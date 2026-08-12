import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import ThemeProvider from './context/ContextThemeProvider.tsx';
import './styles/theme.css';

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
