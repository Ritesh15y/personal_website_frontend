import { motion } from 'framer-motion';
import './SectionHeader.css';

const SectionHeader = ({ label, title, subtitle, centered = true }) => {
  return (
    <motion.div
      className={`section-header ${centered ? 'section-header--centered' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {label && (
        <span className="section-header__label">{label}</span>
      )}
      <h2 className="section-header__title">{title}</h2>
      <div className="section-header__divider" />
      {subtitle && (
        <p className="section-header__subtitle">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
