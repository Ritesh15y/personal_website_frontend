import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBuilding,
  FaGraduationCap,
  FaArrowRight,
  FaCheckCircle,
  FaDraftingCompass,
  FaLaptopCode,
  FaFileAlt,
  FaLayerGroup,
  FaPhoneAlt,
} from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import './GatewayPage.css';



const GatewayPage = () => {
  return (
    <div className="gateway-page">
      {/* Background ambient lighting */}
      <div className="gateway-ambient" />
      <div className="gateway-ambient gateway-ambient--left" />
      <div className="gateway-ambient gateway-ambient--right" />

      <div className="container gateway-container">
        {/* Header Hero */}
        <motion.div
          className="gateway-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="gateway-badge">
            <span>Welcome to Prema Design Studio</span>
          </div>
          <h1 className="gateway-title">
            Architecture, BIM Solutions <br />
            <span className="text-accent">& Professional Training</span>
          </h1>
          <p className="gateway-subtitle">
            We operate two dedicated divisions to best serve your needs. Choose your path below to enter
            our Design &amp; BIM Services hub or explore our Software Training Academy.
          </p>
        </motion.div>

        {/* Dual Paths Section */}
        <div className="gateway-doors">
          {/* DOOR 1: DESIGN & BIM SERVICES */}
          <motion.div
            className="gateway-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="gateway-card__bg">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                alt="Prema Design Studio - Design & BIM Services"
                className="gateway-card__img"
              />
              <div className="gateway-card__overlay" />
            </div>

            <div className="gateway-card__content">
              <div className="gateway-card__top">
                <div className="gateway-card__icon-box">
                  <FaBuilding />
                </div>
                <span className="gateway-card__eyebrow">Professional Consultancy Services</span>
              </div>

              <h2 className="gateway-card__title">
                Design &amp; BIM Services
              </h2>
              <p className="gateway-card__desc">
                High-precision 2D drafting, LOD 200–400 architectural and structural BIM modeling,
                multi-discipline clash detection, and photorealistic 3D CGI rendering.
              </p>

              {/* Explicit Target Audience */}
              <div className="gateway-card__audience">
                <span className="gateway-card__audience-title">
                  <FaDraftingCompass /> Tailored Specifically For:
                </span>
                <div className="gateway-card__audience-chips">
                  <span className="gateway-audience-chip">Architects</span>
                  <span className="gateway-audience-chip">Contractors</span>
                  <span className="gateway-audience-chip">Developers</span>
                  <span className="gateway-audience-chip">Interior Designers</span>
                  <span className="gateway-audience-chip">Engineering Firms</span>
                </div>
              </div>

              {/* Service Highlights */}
              <ul className="gateway-card__features">
                <li>
                  <FaCheckCircle /> AutoCAD 2D/3D &amp; Submission Drawings
                </li>
                <li>
                  <FaCheckCircle /> Revit Architecture &amp; Revit Structure BIM
                </li>
                <li>
                  <FaCheckCircle /> Navisworks Clash Detection &amp; Coordination
                </li>
                <li>
                  <FaCheckCircle /> 3ds Max + V-Ray Photorealistic Visualization
                </li>
              </ul>

              {/* Actions */}
              <div className="gateway-card__actions">
                <Link to="/services">
                  <Button variant="primary" size="lg" className="gateway-card__btn-main">
                    Enter Design &amp; BIM Hub <FaArrowRight />
                  </Button>
                </Link>
                <Link to="/portfolio" className="gateway-card__link-sub">
                  <FaLayerGroup /> Explore Client Portfolio
                </Link>
              </div>
            </div>
          </motion.div>

          {/* DOOR 2: TRAINING ACADEMY */}
          <motion.div
            className="gateway-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="gateway-card__bg">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80"
                alt="Prema Design Studio - Training Academy"
                className="gateway-card__img"
              />
              <div className="gateway-card__overlay" />
            </div>

            <div className="gateway-card__content">
              <div className="gateway-card__top">
                <div className="gateway-card__icon-box">
                  <FaGraduationCap />
                </div>
                <span className="gateway-card__eyebrow">Professional Academy</span>
              </div>

              <h2 className="gateway-card__title">
                Software Training
              </h2>
              <p className="gateway-card__desc">
                Project-based, mentor-led courses designed by practicing BIM engineers.
                Gain hands-on mastery in industry software and build a standout portfolio.
              </p>

              {/* Explicit Target Audience */}
              <div className="gateway-card__audience">
                <span className="gateway-card__audience-title">
                  <FaLaptopCode /> Tailored Specifically For:
                </span>
                <div className="gateway-card__audience-chips">
                  <span className="gateway-audience-chip">Architecture &amp; Civil Students</span>
                  <span className="gateway-audience-chip">Working Professionals</span>
                  <span className="gateway-audience-chip">Job Seekers</span>
                </div>
              </div>

              {/* Training Highlights */}
              <ul className="gateway-card__features">
                <li>
                  <FaCheckCircle /> AutoCAD 2D/3D Drafting Masterclass
                </li>
                <li>
                  <FaCheckCircle /> Revit Architecture &amp; Structure BIM Tracks
                </li>
                <li>
                  <FaCheckCircle /> SketchUp &amp; 3ds Max + V-Ray Renders
                </li>
                <li>
                  <FaCheckCircle /> Live Projects, EMI Plans &amp; Certificate
                </li>
              </ul>

              {/* Actions */}
              <div className="gateway-card__actions">
                <Link to="/training">
                  <Button variant="primary" size="lg" className="gateway-card__btn-main">
                    Enter Training Academy <FaArrowRight />
                  </Button>
                </Link>
                <Link to="/training/resources" className="gateway-card__link-sub">
                  <FaFileAlt /> Download Free Practice Resources
                </Link>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Quick Consultation Bar */}
        <motion.div
          className="gateway-help"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="gateway-help__text">
            <h3 className="gateway-help__title">Looking for a custom project quote or corporate batch?</h3>
            <p className="gateway-help__subtitle">
              Our BIM leads and instructors are available for direct consultations.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="outline" size="md">
              <FaPhoneAlt /> Contact Studio
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GatewayPage;
