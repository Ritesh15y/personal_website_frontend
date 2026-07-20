import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthContext';
import router from './routes';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
