import { Link } from 'react-router-dom';
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = 'https://wa.me/917355705074?text=Hi%20Prema%20Design%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20services%20or%20training.';

  return (
    <footer className="footer">
      {/* Gold accent border line */}
      <div className="footer__accent-line" />

      <div className="container">
        <div className="footer__grid">
          {/* Column 1: Prema Design Studio Brand */}
          <div className="footer__col footer__brand">
            <Link to="/" className="footer__logo">
              <img src="/favicon.png" alt="Prema Design Studio" className="footer__logo-img" />
              <span>
                Prema Design<span className="footer__logo-gradient">Studio</span>
              </span>
            </Link>
            <p className="footer__tagline">
              One studio. Two specialized divisions — professional Design &amp; BIM services
              for industry leaders and project-based software training for emerging talent.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="LinkedIn" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Instagram" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="#" aria-label="YouTube" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href={whatsappUrl} aria-label="WhatsApp" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Column 2: Design & BIM Services */}
          <div className="footer__col">
            <h4 className="footer__heading">Design &amp; BIM Services</h4>
            <ul className="footer__list">
              <li><Link to="/services">Architectural Documentation</Link></li>
              <li><Link to="/services">AutoCAD 2D/3D Drafting</Link></li>
              <li><Link to="/services">Revit Architecture BIM</Link></li>
              <li><Link to="/services">Revit Structure BIM</Link></li>
              <li><Link to="/services">MEP &amp; Clash Detection</Link></li>
              <li><Link to="/services">3D Visualization &amp; CGI</Link></li>
            </ul>
          </div>

          {/* Column 3: Training Academy */}
          <div className="footer__col">
            <h4 className="footer__heading">Training Academy</h4>
            <ul className="footer__list">
              <li><Link to="/training">AutoCAD Drafting</Link></li>
              <li><Link to="/training">Revit Architecture (BIM)</Link></li>
              <li><Link to="/training">Revit Structure</Link></li>
              <li><Link to="/training">SketchUp + V-Ray</Link></li>
              <li><Link to="/training">3ds Max Masterclass</Link></li>
              <li><Link to="/training/resources">Practice Resources</Link></li>
            </ul>
          </div>

          {/* Column 4: Studio */}
          <div className="footer__col">
            <h4 className="footer__heading">Studio</h4>
            <ul className="footer__list">
              <li><Link to="/about">About Studio</Link></li>
              <li><Link to="/portfolio">Demonstration Portfolio</Link></li>
              <li><Link to="/reviews">Client &amp; Student Reviews</Link></li>
              <li><Link to="/feedback/client">Client Feedback Form</Link></li>
              <li><Link to="/feedback/student">Student Feedback Form</Link></li>
              <li><Link to="/blog">Blog &amp; Insights</Link></li>
              <li><Link to="/contact">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__contact-list">
              <li>
                <FaEnvelope className="footer__contact-icon" />
                <a href="mailto:hello@premadesignstudio.in" className="footer__contact-link">
                  hello@premadesignstudio.in
                </a>
              </li>
              <li>
                <FaPhoneAlt className="footer__contact-icon" />
                <a href="tel:+917355705074" className="footer__contact-link">
                  +91 7355705074
                </a>
              </li>
              <li>
                <FaWhatsapp className="footer__contact-icon" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer__contact-link">
                  WhatsApp Consultation
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className="footer__contact-icon" />
                <span>Gurugram, Haryana, India | Serving clients globally</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>&copy; {currentYear} Prema Design Studio. All rights reserved.</p>
          <p className="footer__credit">
            One Brand · Design &amp; BIM Services &amp; Professional Training Academy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
