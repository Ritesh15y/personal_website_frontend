import { motion } from 'framer-motion';
import {
  FaDraftingCompass,
  FaBuilding,
  FaCubes,
  FaProjectDiagram,
  FaPuzzlePiece,
  FaImage,
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import './ServicesPage.css';

const iconMap = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaCubes: <FaCubes />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaImage: <FaImage />,
};

const servicesData = [
  {
    icon: 'FaDraftingCompass',
    title: 'AutoCAD Drafting',
    desc: 'Precision 2D drafting and documentation for architectural and structural projects. We follow industry-standard layering conventions and produce drawings ready for submission and construction.',
    features: ['Floor Plans & Site Plans', 'Sections & Elevations', 'Construction Details', 'As-Built Documentation', 'Drawing Set Coordination'],
  },
  {
    icon: 'FaBuilding',
    title: 'Revit Architecture',
    desc: 'Comprehensive Revit architectural models from concept design through construction documentation. Our BIM models ensure accuracy, coordination, and efficiency at every stage.',
    features: ['BIM Modeling from Concept to CD', 'Architectural Documentation', 'Design Development Models', 'Quantity Takeoffs', 'Clash-Free Coordination'],
  },
  {
    icon: 'FaCubes',
    title: 'Revit Structure',
    desc: 'Structural BIM modeling covering foundations to roof structures. Models integrate seamlessly with architectural and MEP disciplines, complete with rebar detailing and steel connections.',
    features: ['RCC & Steel Structure Modeling', 'Foundation & Footing Details', 'Rebar Detailing & Schedules', 'Structural Analysis Integration', 'Multi-Discipline Coordination'],
  },
  {
    icon: 'FaProjectDiagram',
    title: 'BIM Coordination',
    desc: 'We bring architectural, structural, and MEP models together for comprehensive clash detection and resolution, saving time and costs before reaching the construction site.',
    features: ['Multi-Discipline Model Merge', 'Clash Detection & Reports', 'Issue Resolution Tracking', 'Navisworks Simulation', '4D/5D BIM Support'],
  },
  {
    icon: 'FaPuzzlePiece',
    title: 'Revit Family Creation',
    desc: 'Custom parametric Revit families that follow BIM standards. From furniture to complex MEP equipment, our families are lightweight, parametric, and production-ready.',
    features: ['Parametric Component Design', 'LOD 100-500 Families', 'Custom Parameters & Types', 'Shared Parameter Integration', 'Family Standards Compliance'],
  },
  {
    icon: 'FaImage',
    title: '3D Visualization',
    desc: 'Stunning photorealistic visuals using 3ds Max and V-Ray. From still renders to animated walkthroughs, our visualizations help clients experience spaces before they are built.',
    features: ['Photorealistic Exterior Renders', 'Interior Visualization', 'Animated Walkthroughs', 'Material & Lighting Studies', 'VR Ready Output'],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServicesPage = () => {
  return (
    <div className="services-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
            alt="Services background"
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
            <span className="hero__label">What We Offer</span>
            <h1>Our <span className="text-accent">Services</span></h1>
            <p className="page-hero__subtitle">
              End-to-end design and BIM solutions tailored for architects,
              engineers, and design firms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section">
        <div className="container">
          <motion.div
            className="services-list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {servicesData.map((service, index) => (
              <motion.div
                key={index}
                className={`service-detail glass-card ${index % 2 !== 0 ? 'service-detail--reverse' : ''}`}
                variants={itemVariants}
              >
                <div className="service-detail__icon-col">
                  <div className="service-detail__icon">
                    {iconMap[service.icon]}
                  </div>
                  <span className="service-detail__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="service-detail__content">
                  <h3 className="service-detail__title">{service.title}</h3>
                  <p className="service-detail__desc">{service.desc}</p>
                  <ul className="service-detail__features">
                    {service.features.map((feature, i) => (
                      <li key={i}>
                        <FaCheckCircle className="text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section services-cta">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Have a Project in Mind?</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto var(--space-8)' }}>
              Let's discuss how we can help bring your vision to life with
              our design and BIM expertise.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get in Touch <FaArrowRight />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
