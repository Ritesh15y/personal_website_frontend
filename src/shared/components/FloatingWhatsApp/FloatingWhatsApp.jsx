import { FaWhatsapp } from 'react-icons/fa';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const phoneNumber = '917355705074';
  const message = encodeURIComponent(
    'Hi Prema Design Studio, I would like to inquire about your Design & BIM Services / Software Training.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with Prema Design Studio on WhatsApp"
    >
      <FaWhatsapp className="floating-whatsapp__icon" aria-hidden="true" />
      <span className="floating-whatsapp__tooltip" role="tooltip">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
