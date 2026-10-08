import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaDraftingCompass,
  FaBuilding,
  FaCubes,
  FaProjectDiagram,
  FaPuzzlePiece,
  FaImage,
  FaWrench,
  FaCheckCircle,
  FaArrowRight,
  FaMedal,
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import BeforeAfterSlider from '../../shared/components/BeforeAfterSlider/BeforeAfterSlider';
import TestimonialsSection from '../../shared/components/TestimonialsSection/TestimonialsSection';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api from '../../shared/lib/api';
import './ServicesPage.css';

const iconMap = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaCubes: <FaCubes />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaWrench: <FaWrench />,
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaImage: <FaImage />,
};

const servicesStatic = [
  {
    slug: 'architectural-design-documentation',
    icon: 'FaDraftingCompass',
    title: 'Architectural Design & Documentation',
    desc: 'From preliminary floor plans and concept design to comprehensive municipal permit packages and detailed tender documentation ready for construction.',
    features: ['Schematic Design to CD', 'Municipal Permit Drawings', 'Floor Plans & Sections', 'Elevations & Schedules', 'Site & Landscape Integration'],
  },
  {
    slug: 'autocad-drafting',
    icon: 'FaDraftingCompass',
    title: 'AutoCAD 2D/3D Drafting',
    desc: 'Precision 2D computer-aided drafting following standardized architectural layers, line weights, and scale setups for architectural and engineering sets.',
    features: ['Floor Plans & Site Layouts', 'Sections & Elevations', 'Construction Detail Sheets', 'As-Built Documentation', 'Drawing Package Assembly'],
  },
  {
    slug: 'revit-architecture',
    icon: 'FaBuilding',
    title: 'Revit Architecture BIM',
    desc: 'Comprehensive parametric BIM modeling from concept design through construction documentation, ensuring synchronized plans, sections, and material quantities.',
    features: ['LOD 200–400 Architecture Models', 'Drawing Sheet Generation', 'Parametric Family Integration', 'Automated Quantity Takeoffs', 'Design Development Iterations'],
  },
  {
    slug: 'revit-structure',
    icon: 'FaCubes',
    title: 'Revit Structure BIM',
    desc: 'Structural BIM modeling covering foundations to roof framing. Coordinated rebar detailing, structural steel layouts, and connection schedules.',
    features: ['RCC & Steel Structure Models', 'Footing & Foundation Modeling', 'Rebar Detailing & Schedules', 'Analysis-Ready Model Export', 'Multi-Discipline Alignment'],
  },
  {
    slug: 'mep-coordination',
    icon: 'FaWrench',
    title: 'MEP BIM / Coordination',
    desc: '3D modeling of mechanical HVAC, electrical routing, plumbing, and fire protection systems to eliminate spatial conflicts before site installation.',
    features: ['HVAC Duct & Pipe Modeling', 'Electrical Cable Tray Layouts', 'Plumbing & Drainage 3D', 'Plant Room Spatial Planning', 'Multi-Trade Integration'],
  },
  {
    slug: 'clash-detection',
    icon: 'FaProjectDiagram',
    title: 'Navisworks Clash Detection',
    desc: 'Multi-discipline model federation and automated clash detection to identify spatial conflicts early, avoiding costly rework during construction.',
    features: ['Multi-Discipline Model Merging', 'Hard & Soft Clash Reports', 'Resolution Tracking Matrix', 'Navisworks 4D Construction Simulation', 'Site Coordination Meetings'],
  },
  {
    slug: '3d-visualization',
    icon: 'FaImage',
    title: '3D Visualization / CGI',
    desc: 'High-end photorealistic visuals and architectural renders using SketchUp, 3ds Max, and V-Ray. Still renders, lighting studies, and walkthrough animations.',
    features: ['Exterior & Interior CGI Renders', 'Material & Texture Studies', 'Natural & Artificial Lighting Simulations', 'Walkthrough & Flyover Animations', 'Marketing Presentation Packages'],
  },
];


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const ServicesPage = () => {
  useDocumentTitle(
    'Design & BIM Services | Prema Design Studio',
    'Full-lifecycle architectural drafting, LOD 200–400 BIM modeling, clash coordination, and photorealistic CGI visualization engineered for AEC firms.'
  );

  const { serviceSlug } = useParams();
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const inquiryRef = useRef(null);

  // Inquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('BIM');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const scrollToInquiry = () => {
    inquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Deep linking scroll when serviceSlug is provided
  useEffect(() => {
    if (serviceSlug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(serviceSlug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      const slugToInterest = {
        'architectural-design-documentation': 'Architecture',
        'architectural-documentation': 'Architecture',
        'autocad-drafting': 'Architecture',
        'revit-architecture': 'BIM',
        'revit-structure': 'Structural BIM',
        'mep-coordination': 'MEP',
        'clash-detection': 'Clash Detection',
        '3d-visualization': '3D Visualization',
      };
      if (slugToInterest[serviceSlug.toLowerCase()]) {
        setInterest(slugToInterest[serviceSlug.toLowerCase()]);
      }

      return () => clearTimeout(timer);
    }
  }, [serviceSlug]);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const activeServices = res.data.data
            .filter((s) => s.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(activeServices);
        } else {
          setServices(servicesStatic);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(servicesStatic);
      } finally {
        setLoading(false);
      }

      try {
        const projectsRes = await api.get('/projects?status=published');
        if (projectsRes.data.success && projectsRes.data.data && projectsRes.data.data.length > 0) {
          const featured = projectsRes.data.data
            .filter((p) => p.featured === true && p.category !== 'student-projects')
            .slice(0, 4);
          const normalized = (featured.length > 0 ? featured : projectsRes.data.data.filter((p) => p.category !== 'student-projects').slice(0, 4)).map((p) => ({
            ...p,
            image: p.thumbnail?.url || p.images?.[0]?.url || p.image,
            category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Architecture',
          }));
          setFeaturedProjects(normalized);
        } else {
          setFeaturedProjects(featuredProjectsStatic);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        setFeaturedProjects(featuredProjectsStatic);
      }
    };

    fetchServicesData();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await api.post('/inquiries', {
        name,
        email,
        phone,
        type: 'project',
        subject: `Project Quote: ${interest}`,
        message,
      });
      if (res.data.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your project inquiry has been received. Our BIM lead will review your requirements and reach out promptly within 24–48 business hours.',
        });
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setSubmitStatus({
          success: false,
          message: res.data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Inquiry submission error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Failed to connect to server. Please try again or WhatsApp us.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="services-page">
      {/* ===== HERO SECTION ===== */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="Design and BIM Services"
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
            {/* Explicit Target Audience Strip */}
            <div className="page-hero__audience-strip">
              <span className="page-hero__audience-label">Dedicated Services For:</span>
              <span className="page-hero__audience-tag">Architects</span>
              <span className="page-hero__audience-tag">Contractors</span>
              <span className="page-hero__audience-tag">Developers</span>
              <span className="page-hero__audience-tag">Interior Designers</span>
              <span className="page-hero__audience-tag">Engineering Firms</span>
            </div>

            <h1>
              Design &amp; <span className="text-accent">BIM Services</span>
            </h1>
            <p className="page-hero__subtitle">
              End-to-end architectural drafting, LOD 200–400 BIM modeling, multi-discipline
              clash coordination, and photorealistic CGI visualization engineered for AEC excellence.
            </p>

            <div className="page-hero__actions">
              <Button variant="primary" size="lg" onClick={scrollToInquiry}>
                Get a Project Quote <FaArrowRight />
              </Button>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  Explore Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== DETAILED SERVICES LIST ===== */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="What We Deliver"
            title="Core Design &amp; BIM Solutions"
            subtitle="Explore our comprehensive drafting and modeling services built to international BIM standards"
          />

          {loading ? (
            <div className="text-center" style={{ padding: 'var(--space-12) 0', color: 'var(--color-text-secondary)' }}>
              <p>Loading services...</p>
            </div>
          ) : (
            <motion.div
              className="services-list"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {services.map((service, index) => {
                const serviceId = service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const isSelected = serviceSlug === serviceId;
                return (
                  <motion.div
                    key={service._id || index}
                    id={serviceId}
                    className={`service-detail ${index % 2 !== 0 ? 'service-detail--reverse' : ''} ${isSelected ? 'service-detail--highlighted' : ''}`}
                    variants={itemVariants}
                  >
                  <div className="service-detail__icon-col">
                    <div className="service-detail__icon">
                      {iconMap[service.icon] || <FaCubes />}
                    </div>
                    <span className="service-detail__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="service-detail__content">
                    <h3 className="service-detail__title">{service.title}</h3>
                    <p className="service-detail__desc">{service.desc || service.description}</p>
                    <ul className="service-detail__features">
                      {service.features &&
                        service.features.map((feature, i) => (
                          <li key={i}>
                            <FaCheckCircle className="text-accent" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          )}
        </div>
      </section>

      {/* ===== BLUEPRINT TO 3D TRANSFORMATION SHOWCASE ===== */}
      <section className="section services-showcase">
        <div className="container">
          <SectionHeader
            label="Demonstration Workflow"
            title="Blueprint to 3D Render Transformation"
            subtitle="An illustrative demonstration workflow showing how 2D drafting schematics translate into 3D architectural visualization."
          />
          <motion.div
            className="services-showcase__wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80"
              afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
              beforeLabel="Demonstration 2D CAD"
              afterLabel="3D Visualization Render"
              initialPosition={50}
              altText="Demonstration Workflow: 2D Blueprint to 3D Render comparison"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== DEMONSTRATION & CONCEPT PROJECTS ===== */}
      <section className="section services-projects">
        <div className="container">
          <SectionHeader
            label="Technical Portfolio"
            title="Demonstration &amp; Concept Capabilities"
            subtitle="Sample residential, commercial, interior, and institutional BIM modeling and visualization works"
          />

          <motion.div
            className="services-projects__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="project-card"
                variants={itemVariants}
              >
                <Link to={`/portfolio/${project.slug}`} className="project-card__image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card__image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="project-card__overlay">
                    <span className="project-card__category">Demonstration • {project.category}</span>
                    <h3 className="project-card__title">{project.title}</h3>
                    <span className="project-card__view">
                      View Project Details <FaArrowRight />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
            <Link to="/portfolio">
              <Button variant="outline">
                View All Projects <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY AEC FIRMS CHOOSE US ===== */}
      <section className="section services-why">
        <div className="container">
          <div className="services-why__grid">
            <motion.div
              className="services-why__image-col"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="services-why__image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                  alt="Architecture planning"
                  className="services-why__image"
                  loading="lazy"
                />
                <div className="services-why__image-accent" />
                <div className="services-why__badge">
                  <FaMedal className="services-why__badge-icon" />
                  <div>
                    <span className="services-why__badge-title">5 Years</span>
                    <span className="services-why__badge-sub">of Engineering Excellence</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="services-why__content"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-header__label">Why Partner With Us</span>
              <h2 style={{ marginTop: 'var(--space-3)' }}>
                Engineering Precision Meets <span className="text-accent">Architectural Vision</span>
              </h2>
              <div className="section-header__divider" style={{ marginTop: 'var(--space-4)' }} />
              <p className="services-why__text">
                Whether you need dedicated CAD drafting support, LOD 300–400 Revit models with Navisworks clash detection &amp; coordination,
                or photorealistic client walkthroughs, Prema Design Studio functions as your reliable
                back-office BIM partner.
              </p>
                <ul className="services-why__features">
                  <li><FaCheckCircle className="text-accent" /> Standardized LOD 100–400 BIM Workflows</li>
                  <li><FaCheckCircle className="text-accent" /> Deep Proficiency in AutoCAD, Revit, Navisworks &amp; 3ds Max</li>
                  <li><FaCheckCircle className="text-accent" /> Multi-Discipline Clash Detection &amp; Drawing Coordination</li>
                  <li><FaCheckCircle className="text-accent" /> Reliable Turnaround with Transparent Progress Reporting</li>
                  <li><FaCheckCircle className="text-accent" /> Dedicated Lead BIM Coordinator for Every Project</li>
                </ul>
              <Button variant="primary" size="lg" onClick={scrollToInquiry}>
                Get a Project Quote <FaArrowRight />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CLIENT TESTIMONIALS (AUTO-HIDES IF NONE APPROVED) ===== */}
      <TestimonialsSection
        category="client"
        title="What Our Clients Say"
        subtitle="Verified feedback from practicing architects, contractors, and engineering partners"
        showGoogleCta={true}
      />

      {/* ===== B2B PROJECT INQUIRY FORM ===== */}
      <section ref={inquiryRef} className="section services-inquiry">
        <div className="container">
          <div className="services-inquiry__grid">
            <motion.div
              className="services-inquiry__info-col"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-header__label">B2B Project Inquiry</span>
              <h3 style={{ marginTop: 'var(--space-3)' }}>
                Let&apos;s Build Your Next <span className="text-accent">Model</span> Together
              </h3>
              <p>
                Have an upcoming architectural project, require CAD drawing sets, Revit structural modeling,
                clash detection reports, or photorealistic marketing renders?
                <br /><br />
                Submit your project details below and our lead BIM coordinator will evaluate your scope
                and provide a tailored proposal and quotation typically within 24 to 48 business hours.
              </p>

              <ul className="services-why__features" style={{ margin: 0 }}>
                <li><FaCheckCircle className="text-accent" /> Prompt Scope &amp; Deliverables Review</li>
                <li><FaCheckCircle className="text-accent" /> Initial Technical BIM Consultation</li>
                <li><FaCheckCircle className="text-accent" /> Mutual NDA &amp; Intellectual Property Protection</li>
              </ul>
            </motion.div>

            <motion.div
              className="services-inquiry__form-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleInquirySubmit} className="services-inquiry__form">
                {submitStatus && (
                  <div
                    className={`services-inquiry__status-msg ${
                      submitStatus.success
                        ? 'services-inquiry__status-msg--success'
                        : 'services-inquiry__status-msg--error'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <div className="services-inquiry__form-row">
                  <div className="services-inquiry__form-group">
                    <label htmlFor="service-client-name">Full Name *</label>
                    <input
                      type="text"
                      id="service-client-name"
                      className="services-inquiry__input"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="services-inquiry__form-group">
                    <label htmlFor="service-client-email">Work Email *</label>
                    <input
                      type="email"
                      id="service-client-email"
                      className="services-inquiry__input"
                      placeholder="john@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="services-inquiry__form-row">
                  <div className="services-inquiry__form-group">
                    <label htmlFor="service-client-phone">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="service-client-phone"
                      className="services-inquiry__input"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="services-inquiry__form-group">
                    <label htmlFor="service-client-interest">I&apos;m interested in *</label>
                    <select
                      id="service-client-interest"
                      className="services-inquiry__select"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      required
                    >
                      <option value="Architecture">Architectural Documentation</option>
                      <option value="BIM">Revit Architecture BIM</option>
                      <option value="Structural BIM">Revit Structure BIM</option>
                      <option value="MEP">MEP BIM / Coordination</option>
                      <option value="Clash Detection">Navisworks Clash Detection</option>
                      <option value="3D Visualization">3D Visualization / CGI</option>
                    </select>
                  </div>
                </div>

                <div className="services-inquiry__form-group">
                  <label htmlFor="service-client-message">Project Description &amp; Requirements *</label>
                  <textarea
                    id="service-client-message"
                    rows="4"
                    className="services-inquiry__textarea"
                    placeholder="Specify drawing scale, required LOD level (200/300/400), software deliverables, timelines, or file format requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                  {submitting ? 'Submitting Project Scope...' : 'Get a Project Quote'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
