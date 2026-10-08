import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBuilding,
  FaGraduationCap,
  FaCheckCircle,
  FaShieldAlt,
  FaAward,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import './AboutPage.css';

const AboutPage = () => {
  useDocumentTitle(
    'About Studio & Academy | Prema Design Studio',
    'Uniting professional architectural BIM production services with rigorous software education under one unified standard of excellence. Gurugram, India.'
  );

  return (
    <div className="about-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80"
            alt="Prema Design Studio Architecture"
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
            <span className="hero__label">One Brand · Two Specialized Arms</span>
            <h1>About <span className="text-accent">Prema Design Studio</span></h1>
            <p className="page-hero__subtitle">
              We unite professional architectural BIM production services with
              rigorous, practitioner-led software education under one unified standard of excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Story */}
      <section className="about-intro">
        <div className="container">
          <div className="about-intro__grid">
            <motion.div
              className="about-intro__content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-header__label">Our Foundation</span>
              <h2>
                Crafting Built Environments &amp; <br />
                <span className="text-accent">Empowering Practitioners</span>
              </h2>
              <p className="about-intro__lead">
                Headquartered in Gurugram, India, Prema Design Studio operates as a specialized design consultancy and technical education studio serving clients globally.
              </p>
              <p className="about-intro__text">
                Rather than treating architectural production and professional training as separate ventures,
                we believe the highest quality BIM training comes directly from working practitioners, and the
                highest quality design services emerge from a team dedicated to continuous mastery of modern technology.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: 'var(--space-6)', fontSize: 'var(--fs-sm)' }}>
                <FaMapMarkerAlt />
                <span>Gurugram, Haryana, India | Serving clients globally</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/services">
                  <Button variant="primary" size="md">
                    Explore Design &amp; BIM
                  </Button>
                </Link>
                <Link to="/training">
                  <Button variant="outline" size="md">
                    Explore Training Academy
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="about-intro__image-wrapper"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                alt="Architectural BIM Modeling Workstation"
                className="about-intro__img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two Specialized Arms */}
      <section className="about-divisions">
        <div className="container">
          <SectionHeader
            label="Our Architecture"
            title="Two Specialized Divisions"
            subtitle="Built to deliver uncompromising focus to both client partners and learning professionals"
          />

          <div className="about-divisions__grid">
            {/* Division 1 */}
            <div className="about-division-card">
              <span className="about-division-card__tag">Division 01</span>
              <h3>Design &amp; BIM Services</h3>
              <p>
                Our production team delivers high-precision 2D AutoCAD drafting, LOD 200–400 architectural and structural BIM modeling, Clash Detection &amp; Coordination in Navisworks, and photorealistic 3D visualization using 3ds Max and V-Ray.
              </p>
              <div className="about-division-card__audience">
                <span className="about-division-card__audience-label">Dedicated Partner For:</span>
                <div className="about-division-card__chips">
                  <span className="about-division-card__chip">Architects</span>
                  <span className="about-division-card__chip">Contractors</span>
                  <span className="about-division-card__chip">Developers</span>
                  <span className="about-division-card__chip">Interior Designers</span>
                  <span className="about-division-card__chip">Engineering Firms</span>
                </div>
              </div>
              <Link to="/contact?type=project">
                <Button variant="primary" size="md" style={{ width: '100%', justifyContent: 'center' }}>
                  Get a Project Quote &rarr;
                </Button>
              </Link>
            </div>

            {/* Division 2 */}
            <div className="about-division-card">
              <span className="about-division-card__tag">Division 02</span>
              <h3>Professional Training Academy</h3>
              <p>
                Our academy offers project-based learning in AutoCAD, Revit Architecture, Revit Structure, SketchUp, and 3ds Max. Taught entirely by working BIM engineers, with flexible scheduling and installment options.
              </p>
              <div className="about-division-card__audience">
                <span className="about-division-card__audience-label">Dedicated Programs For:</span>
                <div className="about-division-card__chips">
                  <span className="about-division-card__chip">Architecture Students</span>
                  <span className="about-division-card__chip">Civil Engineering Students</span>
                  <span className="about-division-card__chip">Working Professionals</span>
                  <span className="about-division-card__chip">Job Seekers</span>
                </div>
              </div>
              <Link to="/contact?type=training">
                <Button variant="primary" size="md" style={{ width: '100%', justifyContent: 'center' }}>
                  Discuss Training &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="about-values">
        <div className="container">
          <SectionHeader
            label="How We Work"
            title="Our Principles of Practice"
            subtitle="The core values that guide both our client deliveries and our student mentorship"
          />

          <div className="about-values__grid">
            <div className="about-value-item">
              <FaShieldAlt className="about-value-item__icon" />
              <h4>Production-Grade Standards</h4>
              <p>
                We adhere to strict BIM naming standards, clean layering protocols, and accurate LOD modeling that construction teams can actually build from.
              </p>
            </div>

            <div className="about-value-item">
              <FaAward className="about-value-item__icon" />
              <h4>Practitioner Mentorship</h4>
              <p>
                Every instructor is an active BIM professional working on real projects daily, ensuring curriculum stays relevant to genuine job requirements.
              </p>
            </div>

            <div className="about-value-item">
              <FaCheckCircle className="about-value-item__icon" />
              <h4>Prompt Turnaround</h4>
              <p>
                We respect project timelines. Through structured coordination reports and clear communication, we ensure projects and training batches run predictably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Team & Delivery Structure */}
      <section className="about-delivery section">
        <div className="container">
          <SectionHeader
            label="Studio Structure"
            title="How Our Technical Team Delivers"
            subtitle="Grounded execution without administrative layers — direct access to working BIM technologists"
          />

          <div className="about-delivery__grid">
            <div className="about-delivery-card">
              <h4>Lead-Coordinated Pods</h4>
              <p>
                Each project or training batch is led by a practicing BIM technologist with active production modeling experience. You collaborate directly with the engineers drafting your sheets.
              </p>
            </div>
            <div className="about-delivery-card">
              <h4>Strict Drawing Integrity</h4>
              <p>
                We enforce multi-discipline peer reviews for all CAD and Revit models before delivery. Model files arrive clean, purged, and ready for tender or municipal submissions.
              </p>
            </div>
            <div className="about-delivery-card">
              <h4>Dual-Discipline Synergy</h4>
              <p>
                Because our team actively designs and models commercial, residential, and healthcare facilities, academy trainees learn real-world trade coordination instead of academic exercises.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
