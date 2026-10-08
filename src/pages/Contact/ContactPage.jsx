import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPaperPlane,
} from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api from '../../shared/lib/api';
import './ContactPage.css';

const ContactPage = () => {
  useDocumentTitle(
    'Contact & Direct Consultation | Prema Design Studio',
    'Submit project drawings for quote or discuss professional software training programs with our leads in Gurugram, India.'
  );

  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'BIM',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interestParam = searchParams.get('interest') || searchParams.get('type');
    const validInterests = {
      architecture: 'Architecture',
      bim: 'BIM',
      structural: 'Structural BIM',
      mep: 'MEP',
      visualization: '3D Visualization',
      training: 'Training',
      project: 'BIM',
    };

    if (interestParam && validInterests[interestParam.toLowerCase()]) {
      setFormData((prev) => ({
        ...prev,
        interest: validInterests[interestParam.toLowerCase()],
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

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

      if (res.data?.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your enquiry has been received. Our team will contact you within 24 hours.',
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          interest: 'BIM',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to submit enquiry right now. Please try again or WhatsApp us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = 'https://wa.me/917355705074?text=Hi%20Prema%20Design%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20services%20or%20training.';

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt="Contact Prema Design Studio"
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
            <span className="hero__label">Direct Enquiry</span>
            <h1>Let&apos;s <span className="text-accent">Talk</span></h1>
            <p className="page-hero__subtitle">
              Get in touch for a project quote or to discuss our professional software training programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Studio Direct Communication</h3>
              <p className="contact-info__text">
                Speak directly with our BIM leads and course instructors. We review drawing sets,
                technical scopes, and student inquiries with prompt review within 24–48 business hours.
              </p>

              <div className="contact-info__items">
                <div className="contact-info__item">
                  <div className="contact-info__icon">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p>
                      <a href="mailto:hello@premadesignstudio.in" style={{ color: 'inherit', textDecoration: 'none' }}>
                        hello@premadesignstudio.in
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h5>Phone &amp; WhatsApp</h5>
                    <p>
                      <a href="tel:+917355705074" style={{ color: 'inherit', textDecoration: 'none' }}>
                        +91 7355705074
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h5>Studio Location</h5>
                    <p>Gurugram, Haryana, India | Serving clients globally</p>
                  </div>
                </div>
              </div>

              <div className="contact-info__socials">
                <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" aria-label="YouTube"><FaYoutube /></a>
                <a href={whatsappUrl} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
              </div>
            </motion.div>

            {/* Simple, Mobile-Friendly Enquiry Form */}
            <motion.form
              className="contact-form glass-card"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Submit Your Enquiry</h3>

              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form__group">
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form__group">
                  <label htmlFor="interest">I&apos;m interested in *</label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
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

              <div className="contact-form__group">
                <label htmlFor="message">Short Project / Course Requirement *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Describe your design needs, floor plans scale, software choice, or course preferences..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status.message && (
                <div className={`contact-form__status contact-form__status--${status.type}`}>
                  {status.message}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="contact-form__submit"
              >
                {loading ? 'Submitting...' : <>Submit Enquiry <FaPaperPlane /></>}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
