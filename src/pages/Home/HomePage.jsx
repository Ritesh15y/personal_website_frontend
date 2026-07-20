import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaDraftingCompass,
  FaBuilding,
  FaCubes,
  FaProjectDiagram,
  FaPuzzlePiece,
  FaImage,
  FaArrowRight,
  FaCheckCircle,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import './HomePage.css';

const iconMap = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaCubes: <FaCubes />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaImage: <FaImage />,
};

const services = [
  { icon: 'FaDraftingCompass', title: 'AutoCAD Drafting', desc: 'Precision 2D drafting and documentation for architectural and structural projects.' },
  { icon: 'FaBuilding', title: 'Revit Architecture', desc: 'Full BIM modeling for architectural design, documentation, and coordination.' },
  { icon: 'FaCubes', title: 'Revit Structure', desc: 'Structural BIM modeling with precise detailing and analysis-ready output.' },
  { icon: 'FaProjectDiagram', title: 'BIM Coordination', desc: 'Multi-discipline BIM coordination and clash detection for seamless delivery.' },
  { icon: 'FaPuzzlePiece', title: 'Revit Family Creation', desc: 'Custom parametric Revit families built to your specifications.' },
  { icon: 'FaImage', title: '3D Visualization', desc: 'Photorealistic 3D renders and walkthroughs using 3ds Max & V-Ray.' },
];

const featuredProjects = [
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
  { number: '50+', label: 'Projects Completed' },
  { number: '6+', label: 'Software Expertise' },
  { number: '200+', label: 'Students Trained' },
  { number: '5+', label: 'Years Experience' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const HomePage = () => {
  return (
    <div className="home">
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
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
              <Link to="/portfolio">
                <Button variant="primary" size="lg">
                  View Our Work <FaArrowRight />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Our Services
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
              >
                <Link to={`/portfolio/${project.slug}`} className="project-card__link">
                  <div className="project-card__image-wrapper">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-card__image"
                      loading="lazy"
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
              <h2>Design Meets <span className="text-accent">Precision</span></h2>
              <div className="section-header__divider" />
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
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Start a Project <FaArrowRight />
                </Button>
              </Link>
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
              <motion.div
                key={index}
                className="stat-item"
                variants={itemVariants}
              >
                <span className="stat-item__number">{stat.number}</span>
                <span className="stat-item__label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
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
            <div className="home-cta__content">
              <span className="section-header__label">Training Programs</span>
              <h2>
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
                <Link to="/contact">
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
