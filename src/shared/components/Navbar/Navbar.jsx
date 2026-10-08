import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/training', label: 'Training' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/blog', label: 'Blog' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Detect scroll for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/favicon.png" alt="Prema Design Studio" className="navbar__logo-img" />
          <span className="navbar__logo-text">
            Prema Design<span className="text-accent">Studio</span>
          </span>
        </Link>

        {/* Clean Desktop Navigation with Generous Spacing */}
        <ul className="navbar__links">
          {navItems.map((item) => (
            <li key={item.path} className="navbar__item">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Right Actions: Theme Toggle + "LET'S TALK" CTA */}
        <div className="navbar__actions">
          <ThemeToggle />
          <Link to="/contact" className="navbar__cta">
            Let&apos;s Talk
          </Link>
        </div>

        {/* Mobile Toggle & Theme Button */}
        <div className="navbar__mobile-actions">
          <ThemeToggle />
          <button
            className="navbar__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="navbar__mobile-links">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              <li style={{ marginTop: 'var(--space-2)' }}>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="navbar__mobile-cta"
                >
                  Let&apos;s Talk
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
