import { useRouteError, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import './ErrorPage.css';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const status = error?.status || 500;
  const is404 = status === 404;

  return (
    <div className="error-page">
      {/* Animated grid floor */}
      <div className="error-grid" />

      {/* Floating golden dust particles */}
      <div className="error-particles">
        {[...Array(18)].map((_, i) => (
          <span key={i} className="particle" style={{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--size': `${2 + Math.random() * 3}px`,
            '--delay': `${Math.random() * 8}s`,
            '--duration': `${6 + Math.random() * 10}s`,
          }} />
        ))}
      </div>

      {/* Isometric Building Scene */}
      <div className="error-scene">
        <motion.div
          className="building"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Floor sections of the building */}
          <div className="building__floor building__floor--3">
            <div className="floor-face floor-face--front">
              <div className="window" />
              <div className="window" />
            </div>
            <div className="floor-face floor-face--side">
              <div className="window" />
            </div>
            <div className="floor-face floor-face--top" />
          </div>

          {/* Missing floor — dashed outline with glitch/pulse */}
          <motion.div
            className="building__floor building__floor--missing"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <div className="floor-face floor-face--front floor-face--ghost">
              <span className="missing-label">?</span>
            </div>
            <div className="floor-face floor-face--side floor-face--ghost" />
            <div className="floor-face floor-face--top floor-face--ghost" />
          </motion.div>

          <div className="building__floor building__floor--1">
            <div className="floor-face floor-face--front">
              <div className="window" />
              <div className="window" />
            </div>
            <div className="floor-face floor-face--side">
              <div className="window" />
            </div>
            <div className="floor-face floor-face--top" />
          </div>

          {/* Ground / Base */}
          <div className="building__base" />
        </motion.div>
      </div>

      {/* Content Card */}
      <motion.div
        className="error-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="error-content__label">
          {is404 ? 'FLOOR NOT FOUND' : 'STRUCTURAL FAILURE'}
        </div>

        <h1 className="error-content__code">
          {is404 ? '404' : '500'}
        </h1>

        <h2 className="error-content__title">
          {is404 ? "This section wasn't in the blueprint" : 'Something collapsed'}
        </h2>

        <p className="error-content__description">
          {is404
            ? "The page you're looking for doesn't exist. Perhaps it was never designed, or it was demolished during renovation."
            : (error?.message || "An unexpected structural failure occurred. Our engineers are investigating.")}
        </p>

        <div className="error-content__actions">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="error-btn"
          >
            <FaArrowLeft /> Go Back
          </Button>
          <Link to="/">
            <Button variant="primary" size="lg" className="error-btn">
              <FaHome /> Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
