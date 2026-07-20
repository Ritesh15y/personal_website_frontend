import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaBriefcase,
  FaWrench,
  FaFileAlt,
  FaArrowRight,
} from 'react-icons/fa';
import api from '../../shared/lib/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    inquiries: 0,
    unreadInquiries: 0,
    projects: 0,
    services: 0,
    resources: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inqRes, projRes, servRes, resRes] = await Promise.all([
          api.get('/inquiries'),
          api.get('/projects?status=all'),
          api.get('/services'),
          api.get('/resources?status=all'),
        ]);

        const inquiries = inqRes.data?.data || [];
        const unread = inquiries.filter((i) => !i.isRead).length;

        setStats({
          inquiries: inquiries.length,
          unreadInquiries: unread,
          projects: (projRes.data?.data || []).length,
          services: (servRes.data?.data || []).length,
          resources: (resRes.data?.data || []).length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Enquiries',
      count: stats.inquiries,
      subtext: `${stats.unreadInquiries} unread queries`,
      icon: <FaEnvelope />,
      color: 'blue',
      path: '/admin/inquiries',
    },
    {
      title: 'Portfolio Projects',
      count: stats.projects,
      subtext: 'Showcased items',
      icon: <FaBriefcase />,
      color: 'gold',
      path: '/admin/portfolio',
    },
    {
      title: 'Active Services',
      count: stats.services,
      subtext: 'Website offerings',
      icon: <FaWrench />,
      color: 'green',
      path: '/admin/services',
    },
    {
      title: 'Learning Resources',
      count: stats.resources,
      subtext: 'CAD & BIM materials',
      icon: <FaFileAlt />,
      color: 'red',
      path: '/admin/resources',
    },
  ];

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h3>Overview Metrics</h3>
        <p>Real-time analytics and management shortcuts.</p>
      </div>

      {/* Grid of stats */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card glass-card">
            <div className="stat-card__main">
              <div className="stat-card__info">
                <span className="stat-card__title">{card.title}</span>
                <span className="stat-card__count">{card.count}</span>
                <span className="stat-card__subtext">{card.subtext}</span>
              </div>
              <div className={`stat-card__icon stat-card__icon--${card.color}`}>
                {card.icon}
              </div>
            </div>
            <Link to={card.path} className="stat-card__action">
              <span>Manage Items</span> <FaArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick shortcuts block */}
      <div className="dashboard-shortcuts glass-card">
        <h4>Quick Actions</h4>
        <div className="shortcuts-grid">
          <Link to="/admin/portfolio?action=new" className="shortcut-btn">
            + Add New Project
          </Link>
          <Link to="/admin/resources?action=new" className="shortcut-btn">
            + Upload Practice File
          </Link>
          <Link to="/admin/services?action=new" className="shortcut-btn">
            + Add New Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
