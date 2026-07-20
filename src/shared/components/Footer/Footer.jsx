import { Link } from 'react-router-dom';
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Accent line */}
      <div className="footer__accent-line" />

      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">◆</span>
              Design<span className="text-accent">Studio</span>
            </Link>
            <p className="footer__tagline">
              Transforming architectural visions into reality through precision
              design, BIM excellence, and creative visualization.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="LinkedIn" className="footer__social-link">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Instagram" className="footer__social-link">
                <FaInstagram />
              </a>
              <a href="#" aria-label="YouTube" className="footer__social-link">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__column">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/training">Training Programs</Link></li>
              <li><Link to="/blog">Blog Insights</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__column">
            <h4 className="footer__heading">Services</h4>
            <ul className="footer__list">
              <li><Link to="/services">AutoCAD Drafting</Link></li>
              <li><Link to="/services">Revit Architecture</Link></li>
              <li><Link to="/services">Revit Structure</Link></li>
              <li><Link to="/services">3D Visualization</Link></li>
              <li><Link to="/services">BIM Coordination</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__column">
            <h4 className="footer__heading">Get in Touch</h4>
            <ul className="footer__contact-list">
              <li>
                <FaEnvelope className="footer__contact-icon" />
                <span>hello@designstudio.com</span>
              </li>
              <li>
                <FaPhoneAlt className="footer__contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <FaMapMarkerAlt className="footer__contact-icon" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>&copy; {currentYear} DesignStudio. All rights reserved.</p>
          <p className="footer__credit">
            Crafted with precision & passion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
