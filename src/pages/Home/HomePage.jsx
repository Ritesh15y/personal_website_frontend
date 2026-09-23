import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaDraftingCompass,
  FaBuilding,
  FaCubes,
  FaProjectDiagram,
  FaPuzzlePiece,
  FaImage,
  FaArrowRight,
  FaCheckCircle,
  FaMedal,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import BeforeAfterSlider from '../../shared/components/BeforeAfterSlider/BeforeAfterSlider';
import api from '../../shared/lib/api';
import './HomePage.css';

const iconMap = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaCubes: <FaCubes />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaImage: <FaImage />,
};

const servicesStatic = [
  { icon: 'FaDraftingCompass', title: 'AutoCAD Drafting', desc: 'Precision 2D drafting and documentation for architectural and structural projects.' },
  { icon: 'FaBuilding', title: 'Revit Architecture', desc: 'Full BIM modeling for architectural design, documentation, and coordination.' },
  { icon: 'FaCubes', title: 'Revit Structure', desc: 'Structural BIM modeling with precise detailing and analysis-ready output.' },
  { icon: 'FaProjectDiagram', title: 'BIM Coordination', desc: 'Multi-discipline BIM coordination and clash detection for seamless delivery.' },
  { icon: 'FaPuzzlePiece', title: 'Revit Family Creation', desc: 'Custom parametric Revit families built to your specifications.' },
  { icon: 'FaImage', title: '3D Visualization', desc: 'Photorealistic 3D renders and walkthroughs using 3ds Max & V-Ray.' },
];

const featuredProjectsStatic = [
  {
    title: 'Modern Residential Villa',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    slug: 'modern-residential-villa',
  },
  {
    title: 'Corporate Office Tower',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    slug: 'corporate-office-tower',
  },
  {
    title: 'Luxury Apartment Interior',
    category: 'Interior',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    slug: 'luxury-apartment-interior',
  },
  {
    title: 'International School Campus',
    category: 'School',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    slug: 'international-school-campus',
  },
];

const stats = [
  { number: 50, suffix: '+', label: 'Projects Completed' },
  { number: 6, suffix: '+', label: 'Software Expertise' },
  { number: 200, suffix: '+', label: 'Students Trained' },
  { number: 5, suffix: '+', label: 'Years Experience' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// Animated number counter hook
function useCounter(target, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

// Single stat item with counter
const StatItem = ({ stat, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(stat.number, 1600, inView);

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      variants={itemVariants}
      style={{ '--stat-index': index }}
    >
      <span className="stat-item__number">
        {count}{stat.suffix}
      </span>
      <span className="stat-item__label">{stat.label}</span>
    </motion.div>
  );
};

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const inquiryFormRef = useRef(null);

  // Quick Inquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('project');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const scrollToInquiry = () => {
    inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const servicesRes = await api.get('/services');
        if (servicesRes.data.success && servicesRes.data.data && servicesRes.data.data.length > 0) {
          const activeServices = servicesRes.data.data
            .filter((s) => s.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .slice(0, 6);
          const normalized = activeServices.map((s) => ({
            ...s,
            desc: s.shortDescription || s.description,
          }));
          setServices(normalized);
        } else {
          setServices(servicesStatic);
        }
      } catch (error) {
        console.error('Error fetching home services:', error);
        setServices(servicesStatic);
      }

      try {
        const projectsRes = await api.get('/projects?status=published');
        if (projectsRes.data.success && projectsRes.data.data && projectsRes.data.data.length > 0) {
          const featured = projectsRes.data.data
            .filter((p) => p.featured === true)
            .slice(0, 4);
          const normalized = featured.map((p) => ({
            ...p,
            image: p.thumbnail?.url || p.images?.[0]?.url || p.image,
            category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
          }));
          if (normalized.length > 0) {
            setFeaturedProjects(normalized);
          } else {
            const firstFour = projectsRes.data.data.slice(0, 4).map((p) => ({
              ...p,
              image: p.thumbnail?.url || p.images?.[0]?.url || p.image,
              category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            }));
            setFeaturedProjects(firstFour);
          }
        } else {
          setFeaturedProjects(featuredProjectsStatic);
        }
      } catch (error) {
        console.error('Error fetching home projects:', error);
        setFeaturedProjects(featuredProjectsStatic);
      }
    };
    fetchHomeData();
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
        type,
        subject: subject || `Quick Project Request (${type})`,
        message,
      });
      if (res.data.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your project inquiry has been received. We will get back to you shortly.',
        });
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
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
        message: error.response?.data?.message || 'Failed to connect to server. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home">
      {/* ===== HERO SECTION ===== */}
      <section className="hero grain-overlay">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80"
            alt="Architectural design"
            className="hero__bg-image"
          />
          <div className="hero__overlay" />
        </div>

        <div className="hero__content container">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="hero__label">Architecture · Structure · Interior</span>
            <h1 className="hero__title">
              We Design Spaces
              <br />
              That <span className="text-accent">Inspire</span>
            </h1>
            <p className="hero__subtitle">
              From concept to construction — delivering precision drafting, BIM
              modeling, and photorealistic visualization for architects, builders,
              and design firms.
            </p>

            <div className="hero__actions">
              <Button variant="primary" size="lg" onClick={scrollToInquiry}>
                Start a Project <FaArrowRight />
              </Button>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View Our Work
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="hero__scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span>Scroll</span>
            <div className="hero__scroll-line" />
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="section home-services">
        <div className="container">
          <SectionHeader
            label="What We Do"
            title="Our Services"
            subtitle="Comprehensive design and BIM solutions across the entire project lifecycle"
          />

          <motion.div
            className="home-services__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card glass-card"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                {/* Background number */}
                <span className="service-card__bg-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="service-card__icon">
                  {iconMap[service.icon]}
                </div>
                <h4 className="service-card__title">{service.title}</h4>
                <p className="service-card__desc">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
            <Link to="/services">
              <Button variant="outline">
                Explore All Services <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="section home-projects">
        <div className="container">
          <SectionHeader
            label="Our Work"
            title="Featured Projects"
            subtitle="Showcasing our best architectural, structural, and interior design work"
          />

          <motion.div
            className="home-projects__grid"
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
                style={{ willChange: 'opacity, transform' }}
              >
                <Link to={`/portfolio/${project.slug}`} className="project-card__link">
                  <div className="project-card__image-wrapper" style={{ backgroundColor: '#f0f0f0' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-card__image"
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="500"
                    />
                    <div className="project-card__overlay">
                      <span className="project-card__category">{project.category}</span>
                      <h3 className="project-card__title">{project.title}</h3>
                      <span className="project-card__view">
                        View Project <FaArrowRight />
                      </span>
                    </div>
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

      {/* ===== BLUEPRINT TO 3D TRANSFORMATION SHOWCASE ===== */}
      <section className="section home-comparison">
        <div className="container">
          <SectionHeader
            label="Interactive Showcase"
            title="From Blueprint to Reality"
            subtitle="Drag the interactive slider below to explore how 2D AutoCAD drafting seamlessly transforms into photorealistic 3D architectural renders."
          />
          <motion.div
            className="home-comparison__wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80"
              afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
              beforeLabel="2D Blueprint / CAD"
              afterLabel="3D Photorealistic Render"
              initialPosition={50}
              altText="Modern Villa Blueprint to 3D Render comparison"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT / WHY US ===== */}
      <section className="section home-about">
        <div className="container">
          <div className="home-about__grid">
            <motion.div
              className="home-about__image-col"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="home-about__image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                  alt="Architecture planning"
                  className="home-about__image"
                  loading="lazy"
                />
                <div className="home-about__image-accent" />
                {/* Floating glass badge */}
                <div className="home-about__badge glass-card">
                  <FaMedal className="home-about__badge-icon" />
                  <div>
                    <span className="home-about__badge-title">5 Years</span>
                    <span className="home-about__badge-sub">of Excellence</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="home-about__content"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-header__label">Why Choose Us</span>
              <h2 style={{ marginTop: 'var(--space-3)' }}>Design Meets <span className="text-accent">Precision</span></h2>
              <div className="section-header__divider" style={{ marginTop: 'var(--space-4)' }} />
              <p className="home-about__text">
                We combine creative architectural vision with technical BIM expertise
                to deliver projects that stand out. Whether you're an architect
                needing reliable drafting support, a firm looking for BIM coordination,
                or a student eager to master industry software — we're here for you.
              </p>
              <ul className="home-about__features">
                <li><FaCheckCircle className="text-accent" /> Industry-Standard BIM Workflows</li>
                <li><FaCheckCircle className="text-accent" /> Expert in AutoCAD, Revit, 3ds Max & V-Ray</li>
                <li><FaCheckCircle className="text-accent" /> 50+ Projects Delivered Successfully</li>
                <li><FaCheckCircle className="text-accent" /> Professional Training Programs</li>
                <li><FaCheckCircle className="text-accent" /> On-Time, Quality-First Approach</li>
              </ul>
              <Button variant="primary" size="lg" onClick={scrollToInquiry}>
                Start a Project <FaArrowRight />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="home-stats">
        <div className="container">
          <motion.div
            className="home-stats__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== QUICK INQUIRY FORM ===== */}
      <section ref={inquiryFormRef} className="section home-inquiry">
        <div className="container">
          <div className="home-inquiry__grid">
            <motion.div
              className="home-inquiry__info-col"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-header__label">Get In Touch</span>
              <h3 style={{ marginTop: 'var(--space-3)' }}>
                Let's Build Something <span className="text-accent">Great</span> Together
              </h3>
              <p>
                Have an upcoming architectural project, need drafting support, BIM coordination, or custom Revit families? Or interested in joining one of our training batches?
                <br /><br />
                Fill out the quick form here, and our design team will analyze your requirements and get back to you with a free consultation and project quote within 24 hours.
              </p>
              
              <ul className="home-about__features" style={{ margin: 0 }}>
                <li><FaCheckCircle className="text-accent" /> 24-Hour Project Review</li>
                <li><FaCheckCircle className="text-accent" /> Free Design Consultation</li>
                <li><FaCheckCircle className="text-accent" /> Direct Communication with BIM Lead</li>
              </ul>
            </motion.div>

            <motion.div
              className="home-inquiry__form-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleInquirySubmit} className="home-inquiry__form">
                {submitStatus && (
                  <div className={`home-inquiry__status-msg ${submitStatus.success ? 'home-inquiry__status-msg--success' : 'home-inquiry__status-msg--error'}`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <div className="home-inquiry__form-row">
                  <div className="home-inquiry__form-group">
                    <label htmlFor="client-name">Full Name *</label>
                    <input
                      type="text"
                      id="client-name"
                      className="home-inquiry__input"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="home-inquiry__form-group">
                    <label htmlFor="client-email">Email Address *</label>
                    <input
                      type="email"
                      id="client-email"
                      className="home-inquiry__input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="home-inquiry__form-row">
                  <div className="home-inquiry__form-group">
                    <label htmlFor="client-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="client-phone"
                      className="home-inquiry__input"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="home-inquiry__form-group">
                    <label htmlFor="project-type">I'm interested in *</label>
                    <select
                      id="project-type"
                      className="home-inquiry__select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="project">Design / BIM Services</option>
                      <option value="training">Software Training batches</option>
                      <option value="general">Other inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="home-inquiry__form-group">
                  <label htmlFor="project-subject">Subject</label>
                  <input
                    type="text"
                    id="project-subject"
                    className="home-inquiry__input"
                    placeholder="e.g. Revit structural model request"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="home-inquiry__form-group">
                  <label htmlFor="project-message">Project Description / Message *</label>
                  <textarea
                    id="project-message"
                    rows="4"
                    className="home-inquiry__textarea"
                    placeholder="Describe your design needs, floor plans scale, software choice, or course preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Sending Request...' : 'Send Inquiry Request'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRAINING CTA ===== */}
      <section className="section home-cta">
        <div className="container">
          <motion.div
            className="home-cta__card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Ambient glow orb behind card */}
            <div className="home-cta__glow" />
            <div className="home-cta__content">
              <span className="section-header__label">Training Programs</span>
              <h2 style={{ marginTop: 'var(--space-3)' }}>
                Learn From <span className="text-accent">Industry Experts</span>
              </h2>
              <p>
                Master AutoCAD, Revit, SketchUp, 3ds Max & V-Ray with our
                hands-on training programs. Online and offline batches available
                for beginners to advanced learners.
              </p>
              <div className="home-cta__actions">
                <Link to="/training">
                  <Button variant="primary" size="lg">
                    Explore Training <FaArrowRight />
                  </Button>
                </Link>
                <Link to="/contact?type=training">
                  <Button variant="outline" size="lg">
                    Enquire Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
