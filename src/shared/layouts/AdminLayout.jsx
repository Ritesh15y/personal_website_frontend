import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import {
  FaChartBar,
  FaEnvelope,
  FaBriefcase,
  FaWrench,
  FaFileAlt,
  FaSignOutAlt,
  FaHome,
  FaBookOpen,
} from 'react-icons/fa';
import './AdminLayout.css';

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: <FaChartBar /> },
  { path: '/admin/inquiries', label: 'Enquiries', icon: <FaEnvelope /> },
  { path: '/admin/portfolio', label: 'Portfolio', icon: <FaBriefcase /> },
  { path: '/admin/services', label: 'Services', icon: <FaWrench /> },
  { path: '/admin/resources', label: 'Resources', icon: <FaFileAlt /> },
  { path: '/admin/blog', label: 'Blogs', icon: <FaBookOpen /> },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link to="/admin" className="admin-sidebar__logo">
            <span>◆</span> StudioAdmin
          </Link>
          <span className="admin-sidebar__user">Logged: {user?.name}</span>
        </div>

        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__links">
            {adminLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/admin'}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__footer-btn">
            <FaHome /> <span>View Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-sidebar__footer-btn admin-sidebar__footer-btn--logout">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Admin Control Panel</h2>
          <div className="admin-header__right">
            <span>Welcome, <strong>{user?.name}</strong></span>
          </div>
        </header>
        <div className="admin-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
