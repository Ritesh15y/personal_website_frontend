import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import api from '../../shared/lib/api';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import './PortfolioPage.css';

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'school', label: 'School' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'interior', label: 'Interior' },
  { key: 'student-projects', label: 'Student Projects' },
];

const projectsData = [
  {
    title: 'Modern Residential Villa',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    slug: 'modern-residential-villa',
    software: ['Revit', '3ds Max', 'V-Ray'],
  },
  {
    title: 'Corporate Office Tower',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    slug: 'corporate-office-tower',
    software: ['Revit', 'Navisworks'],
  },
  {
    title: 'International School Campus',
    category: 'school',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    slug: 'international-school-campus',
    software: ['Revit', 'SketchUp'],
  },
  {
    title: 'Multi-Specialty Hospital',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&q=80',
    slug: 'multi-specialty-hospital',
    software: ['Revit', 'Navisworks'],
  },
  {
    title: 'Luxury Apartment Interior',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    slug: 'luxury-apartment-interior',
    software: ['3ds Max', 'V-Ray'],
  },
  {
    title: 'Student Villa Concept',
    category: 'student-projects',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    slug: 'student-villa-concept',
    software: ['Revit', '3ds Max'],
  },
  {
    title: 'Contemporary Beach House',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    slug: 'contemporary-beach-house',
    software: ['AutoCAD', 'SketchUp', 'V-Ray'],
  },
  {
    title: 'Retail Mall Design',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=600&q=80',
    slug: 'retail-mall-design',
    software: ['Revit', '3ds Max'],
  },
  {
    title: 'Modern Kitchen Interior',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    slug: 'modern-kitchen-interior',
    software: ['3ds Max', 'V-Ray', 'AutoCAD'],
  },
];

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?status=published');
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setProjects(res.data.data);
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

  useEffect(() => {
    let result = projects;
    if (activeFilter !== 'all') {
      result = projects.filter((p) => p.category === activeFilter);
    }
    setFilteredProjects(result);
  }, [activeFilter, projects]);

  if (loading) {
    return (
      <div className="portfolio-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
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
            <span className="hero__label">Our Work</span>
            <h1>
              Project <span className="text-accent">Portfolio</span>
            </h1>
            <p className="page-hero__subtitle">
              Explore our curated collection of architectural, structural, and
              interior design projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section">
        <div className="container">
          {/* Filter Bar */}
          <div className="portfolio-filter">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`portfolio-filter__btn ${activeFilter === cat.key ? 'portfolio-filter__btn--active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <motion.div className="portfolio-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const imageUrl = project.thumbnail?.url || project.images?.[0]?.url || project.image;
                return (
                  <motion.div
                    key={project._id || project.slug}
                    className="portfolio-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/portfolio/${project.slug}`} className="portfolio-card__link">
                      <div className="portfolio-card__image-wrapper">
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="portfolio-card__image"
                          loading="lazy"
                        />
                        <div className="portfolio-card__overlay">
                          <span className="portfolio-card__category">
                            {project.category.replace('-', ' ')}
                          </span>
                          <h3 className="portfolio-card__title">{project.title}</h3>
                          <div className="portfolio-card__tags">
                            {project.software && project.software.map((sw, i) => (
                              <span key={i} className="portfolio-card__tag">{sw}</span>
                            ))}
                          </div>
                          <span className="portfolio-card__view">
                            View Project <FaArrowRight />
                          </span>
                        </div>
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
