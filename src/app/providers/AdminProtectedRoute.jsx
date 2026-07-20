import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex-center"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-accent)',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div className="loader" />
        <p style={{ letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', fontSize: 'var(--fs-xs)' }}>
          Verifying Credentials...
        </p>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
