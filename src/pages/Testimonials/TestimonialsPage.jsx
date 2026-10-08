import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaQuoteLeft,
  FaBuilding,
  FaGraduationCap,
  FaFilter,
  FaArrowRight,
  FaPen,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api from '../../shared/lib/api';
import './TestimonialsPage.css';

const CLIENT_SUBFILTERS = [
  { key: 'all', label: 'All Services' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'bim', label: 'BIM' },
  { key: 'structure', label: 'Structural BIM' },
  { key: 'mep', label: 'MEP' },
  { key: 'visualization', label: 'Visualization' },
];

const STUDENT_SUBFILTERS = [
  { key: 'all', label: 'All Courses' },
  { key: 'autocad', label: 'AutoCAD' },
  { key: 'revit', label: 'Revit' },
  { key: 'bim', label: 'BIM' },
  { key: '3ds max', label: '3ds Max' },
  { key: 'sketchup', label: 'SketchUp' },
];

const TestimonialsPage = () => {
  useDocumentTitle(
    'Testimonials & Verified Reviews | Prema Design Studio',
    'Explore verified client and student reviews from practicing architects, contractors, and academy trainees.'
  );

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'client' | 'student'
  const [clientSubfilter, setClientSubfilter] = useState('all');
  const [studentSubfilter, setStudentSubfilter] = useState('all');

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await api.get('/testimonials?limit=100');
        if (res.data.success && Array.isArray(res.data.data)) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  const filteredTestimonials = testimonials.filter((item) => {
    // 1. Primary category filter
    if (activeCategory === 'client' && item.category !== 'client') return false;
    if (activeCategory === 'student' && item.category !== 'student') return false;

    // 2. Client subfilter
    if (item.category === 'client' && clientSubfilter !== 'all') {
      const match =
        item.projectType?.toLowerCase().includes(clientSubfilter.toLowerCase()) ||
        item.project?.toLowerCase().includes(clientSubfilter.toLowerCase());
      if (!match) return false;
    }

    // 3. Student subfilter
    if (item.category === 'student' && studentSubfilter !== 'all') {
      const match = item.course?.toLowerCase().includes(studentSubfilter.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`testimonial-star ${i <= rating ? 'testimonial-star--active' : 'testimonial-star--inactive'}`}
        />
      );
    }
    return stars;
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="testimonials-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <div className="reviews-hero__mesh-bg" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero__label">
              {testimonials.length > 0 ? 'Verified Proof & Feedback' : 'Client & Student Feedback'}
            </span>
            <h1>
              Client &amp; Student <span className="text-accent">Reviews</span>
            </h1>
            <p className="page-hero__subtitle">
              {testimonials.length > 0
                ? 'Authentic feedback from architecture firms, general contractors, developers, and BIM academy graduates.'
                : "We're collecting genuine feedback from our clients and learners. Approved reviews will appear here."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section testimonials-body">
        <div className="container">
          {/* Top Category Filter Tabs (Only shown if approved testimonials exist) */}
          {testimonials.length > 0 && (
            <>
              <div className="testimonials-nav-tabs">
                <button
                  type="button"
                  className={`testimonials-nav-tab ${activeCategory === 'all' ? 'testimonials-nav-tab--active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Testimonials
                </button>
                <button
                  type="button"
                  className={`testimonials-nav-tab ${activeCategory === 'client' ? 'testimonials-nav-tab--active' : ''}`}
                  onClick={() => setActiveCategory('client')}
                >
                  <FaBuilding /> Client Reviews
                </button>
                <button
                  type="button"
                  className={`testimonials-nav-tab ${activeCategory === 'student' ? 'testimonials-nav-tab--active' : ''}`}
                  onClick={() => setActiveCategory('student')}
                >
                  <FaGraduationCap /> Student Reviews
                </button>
              </div>

              {/* Subfilters */}
              {activeCategory === 'client' && (
                <div className="testimonials-subfilters">
                  <span className="testimonials-subfilters__label">
                    <FaFilter /> Service:
                  </span>
                  <div className="testimonials-subfilters__chips">
                    {CLIENT_SUBFILTERS.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        className={`subfilter-chip ${clientSubfilter === f.key ? 'subfilter-chip--active' : ''}`}
                        onClick={() => setClientSubfilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeCategory === 'student' && (
                <div className="testimonials-subfilters">
                  <span className="testimonials-subfilters__label">
                    <FaFilter /> Software:
                  </span>
                  <div className="testimonials-subfilters__chips">
                    {STUDENT_SUBFILTERS.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        className={`subfilter-chip ${studentSubfilter === f.key ? 'subfilter-chip--active' : ''}`}
                        onClick={() => setStudentSubfilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Testimonial Cards Grid or Invitation Card */}
          {filteredTestimonials.length > 0 ? (
            <div className="testimonials-gallery-grid">
              {filteredTestimonials.map((item, index) => {
                const isClient = item.category === 'client';
                const contextBadge = isClient
                  ? item.projectType || 'Architecture & BIM'
                  : item.course || 'Software Training';

                return (
                  <motion.div
                    key={item._id || index}
                    className="testimonial-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="testimonial-card__header">
                      <div className="testimonial-card__stars">{renderStars(item.rating || 5)}</div>
                      <span className="testimonial-card__category-tag">
                        {isClient ? <FaBuilding /> : <FaGraduationCap />}
                        <span>{isClient ? 'Client Review' : 'Student Review'}</span>
                      </span>
                    </div>

                    <div className="testimonial-card__quote-wrap">
                      <FaQuoteLeft className="testimonial-card__quote-icon" />
                      <p className="testimonial-card__text">&ldquo;{item.testimonial}&rdquo;</p>
                      {item.learnedSkills && (
                        <div className="testimonial-card__extra">
                          <strong>Skills Mastered:</strong> {item.learnedSkills}
                        </div>
                      )}
                    </div>

                    <div className="testimonial-card__footer">
                      <div className="testimonial-card__author-info">
                        {item.photo?.url ? (
                          <img
                            src={item.photo.url}
                            alt={item.name}
                            className="testimonial-card__avatar-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="testimonial-card__avatar-initials"
                          style={{ display: item.photo?.url ? 'none' : 'flex' }}
                        >
                          {getInitials(item.name)}
                        </div>
                        <div className="testimonial-card__meta">
                          <h4 className="testimonial-card__name">{item.name}</h4>
                          <p className="testimonial-card__role">
                            {isClient
                              ? item.company
                                ? `${item.company} · ${contextBadge}`
                                : contextBadge
                              : `${contextBadge}${item.batchYear ? ` (${item.batchYear})` : ''}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (            /* Requirement: Clean, professional empty state when zero approved reviews */
            <motion.div
              className="reviews-empty-state glass-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="reviews-empty-state__badge">
                <FaStar /> Client &amp; Student Feedback
              </div>
              <h2 className="reviews-empty-state__title">Reviews Coming Soon</h2>
              <p className="reviews-empty-state__desc">
                We&apos;re collecting genuine feedback from our clients and learners. Approved reviews will appear here.
              </p>

              <div className="reviews-empty-state__actions">
                <div className="reviews-cta-group">
                  <Link to="/feedback/client">
                    <Button variant="primary" size="md">
                      <FaPen /> Share Client Experience
                    </Button>
                  </Link>
                  <Link to="/feedback/student">
                    <Button variant="outline" size="md">
                      <FaGraduationCap /> Share Student Experience
                    </Button>
                  </Link>
                </div>
                <div className="reviews-explore-group">
                  <Link to="/services">
                    <Button variant="ghost" size="sm">
                      Explore Our Services <FaArrowRight />
                    </Button>
                  </Link>
                  <Link to="/training">
                    <Button variant="ghost" size="sm">
                      Explore Training <FaArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Permanent Action Row to Leave Feedback */}
          {filteredTestimonials.length > 0 && (
            <div className="testimonials-submit-bar glass-card">
              <div className="testimonials-submit-bar__text">
                <FaPen className="text-accent" />
                <div>
                  <h4>Have You Worked or Trained With Us?</h4>
                  <p>Your honest review helps future partners and students understand our standards.</p>
                </div>
              </div>
              <div className="testimonials-submit-bar__btns">
                <Link to="/feedback/client">
                  <Button variant="primary" size="sm">
                    Client Feedback Form
                  </Button>
                </Link>
                <Link to="/feedback/student">
                  <Button variant="outline" size="sm">
                    Student Feedback Form
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
