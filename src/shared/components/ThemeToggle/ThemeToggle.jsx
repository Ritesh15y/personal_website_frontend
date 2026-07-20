import { useTheme } from '../../../app/providers/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';
import './ThemeToggle.css';

/**
 * ThemeToggle — animated sun/moon toggle button for switching themes.
 */
const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle__icon ${isDark ? 'theme-toggle__icon--active' : ''}`}>
        <HiSun size={18} />
      </span>
      <span className={`theme-toggle__icon ${!isDark ? 'theme-toggle__icon--active' : ''}`}>
        <HiMoon size={18} />
      </span>
    </button>
  );
};

export default ThemeToggle;
