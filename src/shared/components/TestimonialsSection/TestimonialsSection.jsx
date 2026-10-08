import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaGoogle, FaBuilding, FaGraduationCap } from 'react-icons/fa';
import api from '../../lib/api';
import SectionHeader from '../SectionHeader/SectionHeader';
import Button from '../Button/Button';
import './TestimonialsSection.css';

const TestimonialsSection = ({
  category = 'client', // 'client' | 'student' | 'all'
  title = 'What Our Clients Say',
  subtitle = 'Verified feedback from practicing partners and professionals',
  limit = 6,
  showGoogleCta = false,
}) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'all') {
          queryParams.append('category', category);
        }
        queryParams.append('limit', limit);

        const res = await api.get(`/testimonials?${queryParams.toString()}`);
        if (res.data.success && Array.isArray(res.data.data)) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        // Fallback or silent error: if none exists or offline, don't show empty block
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTestimonials();
  }, [category, limit]);

  // Never display "No testimonials yet" or unfinished empty states.
  // If loading or if there are no approved genuine testimonials, hide the testimonial section entirely.
  if (loading || testimonials.length === 0) {
    return null;
  }

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
    <section className="section testimonials-section">
      <div className="container">
        <SectionHeader
          label={category === 'student' ? 'Student Reviews' : 'Client Testimonials'}
          title={title}
          subtitle={subtitle}
        />

        <div className="testimonials-grid">
          {testimonials.map((item, index) => {
            const isClient = item.category === 'client';
            const contextBadge = isClient
              ? item.projectType || 'Architecture & BIM'
              : item.course || 'Software Training';

            return (
              <motion.div
                key={item._id || index}
                className="testimonial-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
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

        {/* GOOGLE REVIEW CTA (For Client Testimonials) */}
        {showGoogleCta && (() => {
          const googleReviewUrl = import.meta.env.VITE_GOOGLE_REVIEW_URL;
          return (
            <div className="testimonials-google-cta glass-card">
              <div className="testimonials-google-cta__content">
                <div className="testimonials-google-cta__icon">
                  <FaGoogle />
                </div>
                <div>
                  <h3>Worked With Us?</h3>
                  <p>
                    Your review helps other architecture and engineering firms discover Prema Design Studio.
                  </p>
                </div>
              </div>
              {googleReviewUrl ? (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="testimonials-google-cta__btn"
                >
                  <Button variant="primary" size="md">
                    LEAVE A GOOGLE REVIEW
                  </Button>
                </a>
              ) : (
                <a href="/feedback/client" className="testimonials-google-cta__btn">
                  <Button variant="primary" size="md">
                    LEAVE CLIENT FEEDBACK
                  </Button>
                </a>
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default TestimonialsSection;
