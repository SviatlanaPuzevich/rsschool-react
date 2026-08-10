import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx'; // Импортируем готовый роутер

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
