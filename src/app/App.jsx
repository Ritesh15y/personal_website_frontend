import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthContext';
import { ThemeProvider } from './providers/ThemeContext';
import router from './routes';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
