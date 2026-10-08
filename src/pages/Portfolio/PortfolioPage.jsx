import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaBuilding, FaGraduationCap } from 'react-icons/fa';
import api from '../../shared/lib/api';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import './PortfolioPage.css';

const professionalCategories = [
  { key: 'all', label: 'All Demonstration & Concept' },
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'school', label: 'School / Campus' },
  { key: 'hospital', label: 'Healthcare' },
  { key: 'interior', label: 'Interior' },
];

const projectsData = [
  {
    title: 'Modern Residential Villa',
    category: 'residential',
    projectType: 'Concept Project',
    image: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586217/portfolio/file_quirjg.png',
    slug: 'modern-residential-villa',
    software: ['Revit', '3ds Max', 'V-Ray', 'AutoCAD'],
    isClientProject: false,
  },
  {
    title: 'Student Villa Concept',
    category: 'student-projects',
    projectType: 'Student Project',
    image: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586181/portfolio/file_udkygn.png',
    slug: 'student-villa-concept',
    software: ['Revit', '3ds Max', 'V-Ray'],
    isClientProject: false,
  },
];

const PortfolioPage = () => {
  useDocumentTitle(
    'Capabilities & Concept Portfolio | Prema Design Studio',
    'Explore our architectural BIM models, technical drafting samples, and CGI visualization demonstration work. All items are clearly classified as concept models, demonstration projects, or student academy work.'
  );

  const [projects, setProjects] = useState([]);
  const [portfolioTab, setPortfolioTab] = useState('all'); // 'all', 'client', 'concept', 'student'
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?status=published');
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const normalized = res.data.data.map((p) => ({
            ...p,
            isClientProject: p.isClientProject || p.projectType === 'Client Project',
            projectType: p.projectType || (p.category === 'student-projects' ? 'Student Project' : 'Demonstration Project'),
          }));
          setProjects(normalized);
        } else {
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(projectsData);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const hasVerifiedClientProjects = projects.some((p) => p.isClientProject);

  // Filter based on selected portfolio tab and category filter
  const displayedProjects = projects.filter((p) => {
    if (portfolioTab === 'all') {
      return true;
    }
    if (portfolioTab === 'client') {
      return p.isClientProject;
    }
    if (portfolioTab === 'concept') {
      if (p.category === 'student-projects' || p.isClientProject) return false;
      if (activeFilter === 'all') return true;
      return p.category === activeFilter;
    }
    if (portfolioTab === 'student') {
      return p.category === 'student-projects';
    }
    return true;
  });

  if (loading) {
    return (
      <div
        className="portfolio-page"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
            alt="Portfolio showcase"
            className="page-hero__image"
          />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero__label">Technical Capabilities</span>
            <h1>
              Project <span className="text-accent">Portfolio</span>
            </h1>
            <p className="page-hero__subtitle">
              Explore our architectural BIM models, technical drafting samples, and CGI visualization demonstration work.
              All items are transparently labeled as concept models, demonstration projects, or student academy work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Portfolio Content */}
      <section className="section">
        <div className="container">
          {/* Top-Level Structure Tabs */}
          <div className="portfolio-type-tabs">
            <button
              className={`portfolio-type-tab-btn ${portfolioTab === 'all' ? 'portfolio-type-tab-btn--active' : ''}`}
              onClick={() => {
                setPortfolioTab('all');
                setActiveFilter('all');
              }}
            >
              ALL
            </button>

            {hasVerifiedClientProjects && (
              <button
                className={`portfolio-type-tab-btn ${portfolioTab === 'client' ? 'portfolio-type-tab-btn--active' : ''}`}
                onClick={() => {
                  setPortfolioTab('client');
                  setActiveFilter('all');
                }}
              >
                <FaBuilding /> PROFESSIONAL / CLIENT WORK
              </button>
            )}

            <button
              className={`portfolio-type-tab-btn ${portfolioTab === 'concept' ? 'portfolio-type-tab-btn--active' : ''}`}
              onClick={() => {
                setPortfolioTab('concept');
                setActiveFilter('all');
              }}
            >
              <FaBuilding /> CONCEPT &amp; DEMONSTRATION
            </button>

            <button
              className={`portfolio-type-tab-btn ${portfolioTab === 'student' ? 'portfolio-type-tab-btn--active' : ''}`}
              onClick={() => {
                setPortfolioTab('student');
                setActiveFilter('all');
              }}
            >
              <FaGraduationCap /> STUDENT WORK
            </button>
          </div>

          {/* Sub-Filters for Concept & Demonstration */}
          {portfolioTab === 'concept' && (
            <div className="portfolio-filter" style={{ marginBottom: 'var(--space-10)' }}>
              {professionalCategories.map((cat) => (
                <button
                  key={cat.key}
                  className={`portfolio-filter__btn ${activeFilter === cat.key ? 'portfolio-filter__btn--active' : ''}`}
                  onClick={() => setActiveFilter(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {portfolioTab === 'student' && (
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
              Practical exercises modeled by students during hands-on software batches at Prema Design Studio.
            </div>
          )}

          {/* Project Grid */}
          <motion.div className="portfolio-grid" layout>
            <AnimatePresence mode="popLayout">
              {displayedProjects.map((project) => {
                const imageUrl = project.thumbnail?.url || project.images?.[0]?.url || project.image;
                const badgeLabel = project.projectType || (project.category === 'student-projects' ? 'Student Project' : 'Concept Project');
                return (
                  <motion.div
                    key={project._id || project.slug}
                    className="portfolio-card"
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/portfolio/${project.slug}`} className="portfolio-card__image-wrapper">
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="portfolio-card__image"
                        loading="lazy"
                      />
                      <div className="portfolio-card__overlay">
                        <span className="portfolio-card__category">{badgeLabel} • {project.category}</span>
                        <h3 className="portfolio-card__title">{project.title}</h3>
                        <span className="portfolio-card__view">
                          View Details <FaArrowRight />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
