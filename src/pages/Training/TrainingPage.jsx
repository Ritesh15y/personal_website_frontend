import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaLaptop,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaUserGraduate,
  FaDownload,
  FaFileAlt,
  FaSearch,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import api from '../../shared/lib/api';
import './TrainingPage.css';

const courses = [
  {
    title: 'AutoCAD — 2D & 3D',
    software: 'AutoCAD',
    duration: '4 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner to Advanced',
    topics: [
      'Interface & Navigation',
      '2D Drafting Tools & Commands',
      'Layers, Blocks & Templates',
      'Dimensioning & Annotation',
      'Plotting & Sheet Setup',
      '3D Modeling Basics',
    ],
  },
  {
    title: 'Revit Architecture',
    software: 'Revit',
    duration: '6 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner to Advanced',
    topics: [
      'Revit Interface & Project Setup',
      'Walls, Floors, Roofs & Ceilings',
      'Doors, Windows & Components',
      'Sections, Elevations & Details',
      'Schedules & Quantity Takeoffs',
      'Rendering & Walkthroughs',
    ],
  },
  {
    title: 'Revit Structure',
    software: 'Revit',
    duration: '5 Weeks',
    mode: 'Online & Offline',
    level: 'Intermediate',
    topics: [
      'Structural Project Setup',
      'Columns, Beams & Framing',
      'Foundation & Slab Modeling',
      'Rebar Detailing',
      'Structural Documentation',
      'Coordination with Architecture',
    ],
  },
  {
    title: 'SketchUp + V-Ray',
    software: 'SketchUp',
    duration: '4 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner',
    topics: [
      'SketchUp Interface & Tools',
      '3D Modeling Techniques',
      'Materials & Textures',
      'Scenes & Animations',
      'V-Ray Setup & Rendering',
      'Post-Production Tips',
    ],
  },
  {
    title: '3ds Max + V-Ray Visualization',
    software: '3ds Max',
    duration: '8 Weeks',
    mode: 'Online & Offline',
    level: 'Intermediate to Advanced',
    topics: [
      '3ds Max Interface & Modeling',
      'Interior & Exterior Modeling',
      'Material Editor & V-Ray Materials',
      'Lighting Setup (HDRI, IES)',
      'Camera & Composition',
      'Post-Production in Photoshop',
    ],
  },
];

const categories = [
  { key: 'all', label: 'All Resources' },
  { key: 'autocad', label: 'AutoCAD' },
  { key: 'revit', label: 'Revit' },
  { key: 'sketchup', label: 'SketchUp' },
  { key: '3dsmax', label: '3ds Max' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TrainingPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        if (res.data.success) {
          setResources(res.data.data);
          setFilteredResources(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Filter & Search Handler
  useEffect(() => {
    let result = resources;

    if (activeFilter !== 'all') {
      result = result.filter((res) => res.category === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(
        (res) =>
          res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(result);
  }, [activeFilter, searchTerm, resources]);

  const handleDownload = async (id, fileUrl, fileName) => {
    try {
      // Trigger download count increment on backend
      await api.post(`/resources/${id}/download`);
      
      // Update local state count
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
      );

      // Trigger standard file download in browser
      const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${serverBaseUrl}${fileUrl}`;
      
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download trigger failed', error);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="training-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80"
            alt="Training programs"
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
            <span className="hero__label">Learn & Grow</span>
            <h1>Training <span className="text-accent">Programs</span></h1>
            <p className="page-hero__subtitle">
              Master industry-standard design software with hands-on training
              from experienced professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Train With Us */}
      <section className="section training-why">
        <div className="container">
          <SectionHeader
            label="Why Us"
            title="Learn From Industry Practitioners"
            subtitle="Our training is rooted in real-world project experience, not just theory"
          />
          <div className="training-why__grid">
            {[
              { icon: <FaUserGraduate />, title: 'Project-Based Learning', desc: 'Work on real architectural & structural projects during training.' },
              { icon: <FaLaptop />, title: 'Online & Offline Modes', desc: 'Flexible learning options — attend from anywhere or join in-person.' },
              { icon: <FaChartLine />, title: 'Industry-Ready Skills', desc: 'Curriculum aligned with what firms actually need on the job.' },
              { icon: <FaClock />, title: 'Flexible Scheduling', desc: 'Weekend and evening batches available for working professionals.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="training-why__card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="training-why__icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Listings */}
      <section className="section training-courses">
        <div className="container">
          <SectionHeader
            label="Courses"
            title="Available Programs"
            subtitle="Choose the course that matches your goals and skill level"
          />

          <motion.div
            className="training-courses__list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={index}
                className="course-card glass-card"
                variants={itemVariants}
              >
                <div className="course-card__header">
                  <h3 className="course-card__title">{course.title}</h3>
                  <div className="course-card__meta">
                    <span className="course-card__badge">{course.level}</span>
                  </div>
                </div>

                <div className="course-card__details">
                  <div className="course-card__info">
                    <FaClock className="text-accent" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="course-card__info">
                    <FaLaptop className="text-accent" />
                    <span>{course.mode}</span>
                  </div>
                </div>

                <div className="course-card__topics">
                  <h5>What You'll Learn</h5>
                  <ul>
                    {course.topics.map((topic, i) => (
                      <li key={i}>
                        <FaCheckCircle className="text-accent" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/contact?type=training&subject=${encodeURIComponent(course.title)}`}>
                  <Button variant="outline" className="course-card__btn">
                    Enquire Now <FaArrowRight />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PRACTICE RESOURCES SECTION ===== */}
      <section className="section training-resources">
        <div className="container">
          <SectionHeader
            label="Library"
            title="Practice Resources"
            subtitle="Download free architectural plans, parametric BIM models, and V-Ray render files to practice your skills"
          />

          {/* Search and Filters */}
          <div className="resources-filter-bar flex-between">
            <div className="resources-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`res-filter-btn ${activeFilter === cat.key ? 'res-filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="resources-search flex">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search practice files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '30vh' }}>
              <div className="loader" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="resources-empty-state glass-card text-center">
              <p className="text-muted">No practice files match the criteria. Check back soon!</p>
            </div>
          ) : (
            <motion.div
              className="resources-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {filteredResources.map((res) => (
                <motion.div
                  key={res._id}
                  className="res-card glass-card"
                  variants={itemVariants}
                >
                  <div className="res-card__header flex-between">
                    <span className="res-card__cat-badge">{res.category}</span>
                    <span className="res-card__size">{formatBytes(res.fileSize)}</span>
                  </div>

                  <div className="res-card__body">
                    <div className="res-card__title-row flex">
                      <FaFileAlt className="res-file-icon text-accent" />
                      <h4>{res.title}</h4>
                    </div>
                    <p>{res.description}</p>
                  </div>

                  <div className="res-card__footer flex-between">
                    <span className="res-downloads-count">Downloads: {res.downloadCount || 0}</span>
                    <button
                      onClick={() => handleDownload(res._id, res.fileUrl, res.fileName)}
                      className="res-download-btn flex-center"
                      title="Download drawing file"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section training-cta">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Can't Find What You're Looking For?</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto var(--space-8)' }}>
              We offer customized training programs tailored to your team's needs.
              Reach out and let's discuss.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Contact Us <FaArrowRight />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
