import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import Button from '../../shared/components/Button/Button';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, go to admin dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="login-page">
      <div className="login-page__bg">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
          alt="Login Background"
          className="login-page__image"
        />
        <div className="login-page__overlay" />
      </div>

      <div className="login-page__container container">
        <form className="login-card glass-card animate-scale-in" onSubmit={handleSubmit}>
          <div className="login-card__header">
            <span className="login-card__logo-icon">◆</span>
            <h2>Studio Admin Login</h2>
            <p>Access the control panel to manage portfolio, services, and enquiries.</p>
          </div>

          {error && (
            <div className="login-card__error">
              {error}
            </div>
          )}

          <div className="login-card__group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@designstudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-card__group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="login-card__submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
