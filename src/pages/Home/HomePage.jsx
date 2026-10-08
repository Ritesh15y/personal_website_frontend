import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBuilding,
  FaGraduationCap,
  FaDraftingCompass,
  FaCubes,
  FaProjectDiagram,
  FaLaptopCode,
  FaImage,
  FaCheckCircle,
  FaArrowRight,
  FaMapMarkerAlt,
  FaWrench,
  FaCreditCard,
  FaAward,
  FaUsers,
  FaPhoneAlt,
  FaStar,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api from '../../shared/lib/api';
import './HomePage.css';

// Verified Concept and Student demonstration projects matching production database
const verifiedFallbackProjects = [
  {
    title: 'Modern Residential Villa',
    category: 'residential',
    projectType: 'Concept Project',
    scope: 'Architectural Revit BIM, Construction Documentation & 3D CGI Renders',
    description: 'An architectural concept villa featuring open floor plans, parametric Revit BIM modeling, and photorealistic 3D visualization.',
    software: ['Revit', '3ds Max', 'V-Ray', 'AutoCAD'],
    thumbnail: { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586217/portfolio/file_quirjg.png' },
    slug: 'modern-residential-villa',
  },
  {
    title: 'Student Villa Concept',
    category: 'student-projects',
    projectType: 'Student Project',
    scope: 'Passive solar layout, spatial planning, and residential BIM modeling',
    description: 'A conceptual villa modeling project developed by students during practical BIM training at Prema Design Studio.',
    software: ['Revit', '3ds Max', 'V-Ray'],
    thumbnail: { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586181/portfolio/file_udkygn.png' },
    slug: 'student-villa-concept',
  },
];

// Client-friendly Design & BIM Services
const b2bServices = [
  {
    icon: <FaDraftingCompass />,
    title: 'Architectural Design & Documentation',
    desc: 'From initial floor plans to complete municipal submission drawings and construction drawing packages ready for the jobsite.',
  },
  {
    icon: <FaDraftingCompass />,
    title: 'AutoCAD 2D/3D Drafting',
    desc: 'High-precision computer-aided drafting following standardized architectural layers, sheet setups, and accurate dimensioning.',
  },
  {
    icon: <FaBuilding />,
    title: 'Revit Architecture BIM',
    desc: 'Intelligent 3D building information models from schematic design through detailed design development and quantity takeoffs.',
  },
  {
    icon: <FaCubes />,
    title: 'Revit Structure BIM',
    desc: 'Accurate concrete framing, foundation footings, structural steel layouts, and rebar scheduling coordinated with architecture.',
  },
  {
    icon: <FaWrench />,
    title: 'MEP BIM / Coordination',
    desc: '3D integration of mechanical, electrical, and plumbing routes to eliminate spatial routing conflicts early.',
  },
  {
    icon: <FaProjectDiagram />,
    title: 'Navisworks Clash Detection',
    desc: 'Comprehensive multi-discipline interference checks and issue tracking before construction crews mobilize on site.',
  },
  {
    icon: <FaImage />,
    title: '3D Visualization / CGI',
    desc: 'Photorealistic architectural exterior renders, interior visualizations, and immersive client walkthrough animations.',
  },
];

// Training Academy Courses
const trainingCourses = [
  {
    title: 'AutoCAD 2D & 3D Drafting',
    software: 'AutoCAD',
    duration: '4 Weeks',
    desc: 'Master professional drawing setups, layering conventions, site plans, and municipal drawing sets with hands-on drafting exercises.',
    badge: 'Foundation',
  },
  {
    title: 'Revit Architecture BIM',
    software: 'Revit',
    duration: '6 Weeks',
    desc: 'Build complete BIM models with parametric walls, roofs, custom components, schedules, and drawing sheet generation.',
    badge: 'Most Popular',
  },
  {
    title: 'Revit Structure BIM',
    software: 'Revit',
    duration: '5 Weeks',
    desc: 'Model RCC and steel structures with accurate foundation layouts, rebar detailing schedules, and structural documentation.',
    badge: 'Specialized',
  },
  {
    title: 'Comprehensive BIM Workflows',
    software: 'Revit + Navisworks',
    duration: '8 Weeks',
    desc: 'Multi-discipline project coordination, clash detection reports, and collaborative BIM execution standards.',
    badge: 'Career Track',
  },
  {
    title: 'SketchUp 3D Modeling',
    software: 'SketchUp',
    duration: '4 Weeks',
    desc: 'Fast-paced architectural concept modeling, space planning, custom furniture modeling, and presentation graphics.',
    badge: 'Essential',
  },
  {
    title: '3ds Max + V-Ray Masterclass',
    software: '3ds Max + V-Ray',
    duration: '8 Weeks',
    desc: 'Photorealistic architectural materials, HDRI environment lighting, camera composition, and post-production rendering.',
    badge: 'Advanced',
  },
];



const HomePage = () => {
  useDocumentTitle(
    'Prema Design Studio — Architecture, BIM & Professional Training',
    'One studio. Two paths — professional Design & BIM services and project-based software training. Serving clients globally from Gurugram, India.'
  );

  const enquiryFormRef = useRef(null);
  const [testimonialTab, setTestimonialTab] = useState('clients');
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Dynamic projects state synchronized with database/portfolio
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch verified published projects from the unified API data source
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?status=published');
        if (isMounted && res.data?.success && res.data.data?.length > 0) {
          setProjects(res.data.data);
        } else if (isMounted) {
          setProjects(verifiedFallbackProjects);
        }
      } catch (err) {
        console.error('Failed to load projects on homepage:', err);
        if (isMounted) setProjects(verifiedFallbackProjects);
      } finally {
        if (isMounted) setLoadingProjects(false);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch approved public testimonials
  useEffect(() => {
    let isMounted = true;
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials?limit=8');
        if (isMounted && res.data?.success) {
          const items = res.data.data || [];
          setApprovedTestimonials(items);
          const clients = items.filter((t) => t.category === 'client');
          const students = items.filter((t) => t.category === 'student');
          if (clients.length === 0 && students.length > 0) {
            setTestimonialTab('students');
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials on homepage:', err);
      } finally {
        if (isMounted) setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lead Generation Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Architecture',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const scrollToEnquiry = (preselectedInterest) => {
    if (preselectedInterest) {
      setFormData((prev) => ({ ...prev, interest: preselectedInterest }));
    }
    enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const type = formData.interest === 'Training' ? 'training' : 'project';
      const res = await api.post('/inquiries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: type,
        subject: `Enquiry: ${formData.interest}`,
        message: formData.message,
      });

      if (res.data.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your enquiry has been received. Our team will contact you promptly within 24–48 business hours.',
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          interest: 'Architecture',
          message: '',
        });
      } else {
        setSubmitStatus({
          success: false,
          message: res.data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Enquiry error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Unable to submit enquiry. Please try again or WhatsApp us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      {/* ========================================================
          1. HERO / GATEWAY — TWO SPECIALIZED ARMS
          ======================================================== */}
      <section className="hero-gateway">
        <div className="hero-gateway__ambient" />
        <div className="container">
          <motion.div
            className="hero-gateway__header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-gateway__badge">
              <span>Prema Design Studio</span>
            </div>
            <h1 className="hero-gateway__title">
              Architecture, BIM &amp; <br />
              <span className="text-accent">Professional Training</span>
            </h1>
            <p className="hero-gateway__subtitle">
              One studio. Two paths — professional Design &amp; BIM services and project-based software training.
            </p>
          </motion.div>

          {/* The Two Distinct Cards */}
          <div className="hero-gateway__cards">
            {/* Card A: DESIGN & BIM SERVICES */}
            <motion.div
              className="gateway-door-card"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <div className="gateway-door-card__bg">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80"
                  alt="Design and BIM Services"
                  className="gateway-door-card__img"
                />
                <div className="gateway-door-card__overlay" />
              </div>

              <div className="gateway-door-card__content">
                <span className="gateway-door-card__tag">
                  <FaBuilding /> Division 01
                </span>
                <h2 className="gateway-door-card__title">Design &amp; BIM Services</h2>
                <p className="gateway-door-card__desc">
                  Full-lifecycle architectural drafting, LOD 200–400 BIM modeling, clash coordination, and photorealistic CGI visualization engineered for AEC firms.
                </p>

                <div className="gateway-door-card__audience">
                  <span className="gateway-door-card__audience-label">Designed Specifically For:</span>
                  <div className="gateway-door-card__chips">
                    <span className="gateway-door-chip">Architects</span>
                    <span className="gateway-door-chip">Contractors</span>
                    <span className="gateway-door-chip">Developers</span>
                    <span className="gateway-door-chip">Interior Designers</span>
                    <span className="gateway-door-chip">Engineering Firms</span>
                  </div>
                </div>

                <div className="gateway-door-card__cta">
                  <Link to="/services">
                    <Button variant="primary" size="lg" className="gateway-door-card__btn">
                      EXPLORE DESIGN &amp; BIM <FaArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card B: TRAINING ACADEMY */}
            <motion.div
              className="gateway-door-card"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <div className="gateway-door-card__bg">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&q=80"
                  alt="Software Training Academy"
                  className="gateway-door-card__img"
                />
                <div className="gateway-door-card__overlay" />
              </div>

              <div className="gateway-door-card__content">
                <span className="gateway-door-card__tag">
                  <FaGraduationCap /> Division 02
                </span>
                <h2 className="gateway-door-card__title">Training Academy</h2>
                <p className="gateway-door-card__desc">
                  Project-based, mentor-led courses in AutoCAD, Revit BIM, SketchUp, and 3ds Max. Learn from practicing engineers and build job-ready portfolios.
                </p>

                <div className="gateway-door-card__audience">
                  <span className="gateway-door-card__audience-label">Programs Tailored For:</span>
                  <div className="gateway-door-card__chips">
                    <span className="gateway-door-chip">Architecture &amp; Civil Students</span>
                    <span className="gateway-door-chip">Working Professionals</span>
                    <span className="gateway-door-chip">Job Seekers</span>
                  </div>
                </div>

                <div className="gateway-door-card__cta">
                  <Link to="/training">
                    <Button variant="primary" size="lg" className="gateway-door-card__btn">
                      EXPLORE TRAINING <FaArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. DESIGN & BIM SERVICES OVERVIEW
          ======================================================== */}
      <section className="home-division-services">
        <div className="container">
          <SectionHeader
            label="Professional Division"
            title="Design &amp; BIM Services"
            subtitle="Reliable, high-precision architectural drafting and BIM modeling for construction and design firms"
          />

          <div className="division-services__audience-badge">
            <span style={{ fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wider)', color: 'var(--color-accent)' }}>
              Trusted Partner For
            </span>
            <div className="division-services__chips">
              <span className="gateway-door-chip">Architects</span>
              <span className="gateway-door-chip">General Contractors</span>
              <span className="gateway-door-chip">Real Estate Developers</span>
              <span className="gateway-door-chip">Interior Designers</span>
              <span className="gateway-door-chip">Engineering Firms</span>
            </div>
          </div>

          <div className="division-services__grid">
            {b2bServices.map((svc, i) => (
              <div key={i} className="division-service-item">
                <div className="division-service-item__icon">{svc.icon}</div>
                <h4>{svc.title}</h4>
                <p>{svc.desc}</p>
              </div>
            ))}
          </div>

          <div className="division-services__action-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToEnquiry('BIM')}
            >
              Get a Project Quote <FaArrowRight />
            </Button>
            <Link to="/services">
              <Button variant="outline" size="lg">
                View Full Services Breakdown
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. TRAINING ACADEMY OVERVIEW
          ======================================================== */}
      <section className="home-division-training">
        <div className="container">
          <SectionHeader
            label="Education Division"
            title="Professional Training Academy"
            subtitle="Hands-on software training taught by working BIM engineers with real construction drawings"
          />

          {/* Key Training Pillars */}
          <div className="division-training__features">
            <div className="division-training__feature-card">
              <FaLaptopCode className="division-training__feature-icon" />
              <h5>Project-Based Learning</h5>
              <p>Work directly on practical architectural drawings and real building models.</p>
            </div>
            <div className="division-training__feature-card">
              <FaCreditCard className="division-training__feature-icon" />
              <h5>Flexible EMI Options</h5>
              <p>Transparent pricing with monthly installment learning options available.</p>
            </div>
            <div className="division-training__feature-card">
              <FaAward className="division-training__feature-icon" />
              <h5>Course Completion Certificate</h5>
              <p>Certificate of completion awarded upon comprehensive project and portfolio review.</p>
            </div>
            <div className="division-training__feature-card">
              <FaUsers className="division-training__feature-icon" />
              <h5>Online &amp; Studio Batches</h5>
              <p>Join interactive live online sessions or attend in-person at our Gurugram studio.</p>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="division-courses__grid">
            {trainingCourses.map((c, i) => (
              <div key={i} className="division-course-card">
                <div className="division-course-card__header">
                  <span className="division-course-card__software">{c.software}</span>
                  <span className="division-course-card__duration">{c.duration}</span>
                </div>
                <h4>{c.title}</h4>
                <p className="division-course-card__desc">{c.desc}</p>
                <div className="division-course-card__footer">
                  <span className="division-course-card__badge">
                    <FaCheckCircle /> {c.badge}
                  </span>
                  <Link
                    to="/training"
                    style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    View Curriculum &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="division-services__action-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToEnquiry('Training')}
            >
              Discuss Training <FaArrowRight />
            </Button>
            <Link to="/training">
              <Button variant="outline" size="lg">
                View All Courses &amp; Fees
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. EXPLORE OUR DESIGN & BIM CAPABILITIES
          ======================================================== */}
      <section className="home-selected-projects">
        <div className="container">
          <SectionHeader
            label="Technical Capabilities"
            title="Explore Our Design &amp; BIM Capabilities"
            subtitle="Demonstration architectural BIM models, technical documentation, and CGI visualization sample works"
          />

          <div className="selected-projects__grid">
            {projects.map((project, idx) => {
              const projectImg = project.thumbnail?.url || project.images?.[0]?.url || project.image;
              const projectTypeBadge = project.projectType || (project.category === 'student-projects' ? 'Student Project' : 'Concept Project');
              const categoryFormatted = project.category ? project.category.replace('-', ' ') : 'Design';
              return (
                <div key={project.slug || idx} className="selected-project-card">
                  <Link to={`/portfolio/${project.slug}`} className="selected-project-card__image-wrap">
                    <img
                      src={projectImg}
                      alt={project.title}
                      className="selected-project-card__img"
                      loading="lazy"
                    />
                    <span className="selected-project-card__category-badge">{projectTypeBadge} • {categoryFormatted}</span>
                  </Link>

                  <div className="selected-project-card__info">
                    <div className="selected-project-card__header">
                      <h3 className="selected-project-card__title">{project.title}</h3>
                      {project.location ? (
                        <span className="selected-project-card__location">
                          <FaMapMarkerAlt /> {project.location}
                        </span>
                      ) : null}
                    </div>

                    <p className="selected-project-card__scope">
                      <strong>Scope:</strong> {project.scope || project.description}
                    </p>

                    <div className="selected-project-card__meta-bar">
                      <div className="selected-project-card__software-pills">
                        {project.software?.map((sw, sIdx) => (
                          <span key={sIdx} className="project-software-pill">
                            {sw}
                          </span>
                        ))}
                      </div>
                      <Link to={`/portfolio/${project.slug}`} className="selected-project-card__view-link">
                        Project Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/portfolio">
              <Button variant="outline" size="lg">
                VIEW ALL PROJECTS &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. TESTIMONIALS (TRUSTED BY CLIENTS & LEARNERS)
          ======================================================== */}
      {!loadingTestimonials && approvedTestimonials.length > 0 && (() => {
        const clientItems = approvedTestimonials.filter((t) => t.category === 'client');
        const studentItems = approvedTestimonials.filter((t) => t.category === 'student');
        const displayedItems = (testimonialTab === 'clients' ? clientItems : studentItems).slice(0, 4);

        if (displayedItems.length === 0 && (clientItems.length > 0 || studentItems.length > 0)) {
          // Fallback tab if active tab has no items
          const alternateTab = testimonialTab === 'clients' ? 'students' : 'clients';
          const alternateItems = (alternateTab === 'clients' ? clientItems : studentItems).slice(0, 4);
          if (alternateItems.length === 0) return null;
        }

        return (
          <section className="home-testimonials">
            <div className="container">
              <SectionHeader
                label="Verified Feedback"
                title="Client &amp; Student Feedback"
                subtitle="Authentic experiences from professional consultancy partners and trained modelers"
              />

              {clientItems.length > 0 && studentItems.length > 0 && (
                <div className="testimonials-tabs">
                  <button
                    type="button"
                    className={`testimonials-tab-btn ${testimonialTab === 'clients' ? 'testimonials-tab-btn--active' : ''}`}
                    onClick={() => setTestimonialTab('clients')}
                  >
                    Professional Clients ({clientItems.length})
                  </button>
                  <button
                    type="button"
                    className={`testimonials-tab-btn ${testimonialTab === 'students' ? 'testimonials-tab-btn--active' : ''}`}
                    onClick={() => setTestimonialTab('students')}
                  >
                    Trained Students ({studentItems.length})
                  </button>
                </div>
              )}

              <div className="testimonials-grid">
                {displayedItems.map((item) => (
                  <div key={item._id || item.id} className="testimonial-card">
                    <div
                      className="testimonial-card__stars"
                      style={{
                        display: 'flex',
                        gap: '4px',
                        color: 'var(--color-accent, #C8A96E)',
                        marginBottom: 'var(--space-3)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="testimonial-card__quote">&ldquo;{item.testimonial}&rdquo;</p>
                    <div className="testimonial-card__author">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="testimonial-card__avatar testimonial-card__avatar-img"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="testimonial-card__avatar"
                        style={{ display: item.photo ? 'none' : 'flex' }}
                      >
                        {(item.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="testimonial-card__meta">
                        <h5>{item.name}</h5>
                        <p>
                          {item.category === 'client'
                            ? [item.company, item.projectType || item.project].filter(Boolean).join(' • ') || 'Design & BIM Client'
                            : [item.course, item.batchYear].filter(Boolean).join(' • ') || 'Training Student'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 'var(--space-8)',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-4)',
                  flexWrap: 'wrap',
                }}
              >
                <Link to="/testimonials">
                  <Button variant="outline" size="md">
                    View All Reviews &rarr;
                  </Button>
                </Link>
                <Link to={testimonialTab === 'clients' ? '/feedback/client' : '/feedback/student'}>
                  <Button variant="ghost" size="md">
                    {testimonialTab === 'clients' ? 'Submit Client Feedback' : 'Share Student Experience'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ========================================================
          7. LEAD GENERATION / ENQUIRY SECTION
          ======================================================== */}
      <section ref={enquiryFormRef} className="home-enquiry-section">
        <div className="container">
          <div className="home-enquiry__grid">
            <div className="home-enquiry__info">
              <span className="section-header__label">Direct Enquiry</span>
              <h3>
                Let&apos;s Discuss Your <br />
                <span className="text-accent">Project or Training Needs</span>
              </h3>
              <p>
                Whether you need dedicated architectural BIM production support for an upcoming project,
                or wish to register for an upcoming software training batch, our leads in Gurugram
                are available for direct technical consultation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  <FaCheckCircle className="text-accent" /> Prompt review within 24–48 business hours
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  <FaCheckCircle className="text-accent" /> Direct communication with practicing BIM lead
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  <FaCheckCircle className="text-accent" /> Gurugram studio offline or interactive live online
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>
                <FaPhoneAlt /> Call or WhatsApp: <a href="tel:+917355705074" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>+91 7355705074</a>
              </div>
            </div>

            <div className="home-enquiry__form-card">
              <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                {submitStatus && (
                  <div
                    className={`enquiry-form__status ${
                      submitStatus.success ? 'enquiry-form__status--success' : 'enquiry-form__status--error'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <div className="enquiry-form__row">
                  <div className="enquiry-form__group">
                    <label htmlFor="enquiry-name">Full Name *</label>
                    <input
                      id="enquiry-name"
                      name="name"
                      type="text"
                      className="enquiry-form__input"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="enquiry-form__group">
                    <label htmlFor="enquiry-phone">Phone / WhatsApp *</label>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      className="enquiry-form__input"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="enquiry-form__row">
                  <div className="enquiry-form__group">
                    <label htmlFor="enquiry-email">Email Address *</label>
                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      className="enquiry-form__input"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="enquiry-form__group">
                    <label htmlFor="enquiry-interest">I&apos;m interested in *</label>
                    <select
                      id="enquiry-interest"
                      name="interest"
                      className="enquiry-form__select"
                      value={formData.interest}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="BIM">BIM</option>
                      <option value="Structural BIM">Structural BIM</option>
                      <option value="MEP">MEP</option>
                      <option value="3D Visualization">3D Visualization</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                </div>

                <div className="enquiry-form__group">
                  <label htmlFor="enquiry-message">Short Project / Course Requirement *</label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    rows="3"
                    className="enquiry-form__textarea"
                    placeholder="Briefly describe your drawing scale, required BIM software, deadline, or training course preference..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
