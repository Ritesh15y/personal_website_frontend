import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  FaCreditCard,
  FaTag,
  FaGraduationCap,
  FaBriefcase,
  FaBookOpen,
} from 'react-icons/fa';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import Button from '../../shared/components/Button/Button';
import CoursePaymentModal from '../../shared/components/CoursePaymentModal/CoursePaymentModal';
import TestimonialsSection from '../../shared/components/TestimonialsSection/TestimonialsSection';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api, { SERVER_BASE_URL } from '../../shared/lib/api';
import './TrainingPage.css';

const courses = [
  {
    slug: 'autocad',
    title: 'AutoCAD — 2D & 3D Drafting',
    software: 'AutoCAD',
    duration: '4 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner to Advanced',
    price: 8999,
    originalPrice: 12000,
    discount: '25% OFF',
    emiOption: 'EMI from ₹3,100/mo',
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
    slug: 'revit-architecture',
    title: 'Revit Architecture (BIM)',
    software: 'Revit',
    duration: '6 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner to Advanced',
    price: 12499,
    originalPrice: 16500,
    discount: '24% OFF',
    popularBadge: 'Most Popular',
    emiOption: 'EMI from ₹4,300/mo',
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
    slug: 'revit-structure',
    title: 'Revit Structure (BIM Detailing)',
    software: 'Revit',
    duration: '5 Weeks',
    mode: 'Online & Offline',
    level: 'Intermediate',
    price: 11999,
    originalPrice: 15000,
    discount: '20% OFF',
    emiOption: 'EMI from ₹4,100/mo',
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
    slug: 'sketchup',
    title: 'SketchUp + V-Ray Photorealistic',
    software: 'SketchUp',
    duration: '4 Weeks',
    mode: 'Online & Offline',
    level: 'Beginner',
    price: 7999,
    originalPrice: 10500,
    discount: '24% OFF',
    emiOption: 'EMI from ₹2,750/mo',
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
    slug: '3ds-max',
    title: '3ds Max + V-Ray Masterclass',
    software: '3ds Max',
    duration: '8 Weeks',
    mode: 'Online & Offline',
    level: 'Intermediate to Advanced',
    price: 16999,
    originalPrice: 22000,
    discount: '23% OFF',
    popularBadge: 'Top Rated',
    emiOption: 'EMI from ₹5,800/mo',
    topics: [
      '3ds Max Interface & Modeling',
      'Interior & Exterior Modeling',
      'Material Editor & V-Ray Materials',
      'Lighting Setup (HDRI, IES)',
      'Camera & Composition',
      'Post-Production in Photoshop',
    ],
  },
  {
    slug: 'master-bim',
    title: 'Master BIM & Visualization Bundle',
    software: 'All Software',
    duration: '16 Weeks',
    mode: 'Online & Offline',
    level: 'Complete Career Path',
    price: 34999,
    originalPrice: 48000,
    discount: '27% OFF',
    popularBadge: 'Best Value Bundle',
    emiOption: 'EMI from ₹6,000/mo',
    topics: [
      'Complete AutoCAD 2D/3D Masterclass',
      'Full Revit Architecture & Structure BIM',
      '3ds Max + V-Ray High-End Renders',
      'Live Portfolio Project Mentorship',
      'Career Guidance & Interview Preparation',
      'Course Completion Certificate Included',
    ],
  },
];

const fallbackResources = [
  {
    _id: 'r1',
    title: '2BHK AutoCAD Floor Plan & Sections',
    description: 'A complete construction documentation set for a 2BHK residential apartment. Standard layers and scale setups.',
    category: 'autocad',
    fileUrl: '/uploads/sample-2bhk-plan.dwg',
    fileName: '2BHK_Residential_Plan_Standard.dwg',
    fileType: '.dwg',
    fileSize: 1845000,
    downloadCount: 42,
  },
  {
    _id: 'r2',
    title: 'Parametric Concrete Columns Family',
    description: 'A high-fidelity parametric Revit family for concrete structural columns with steel reinforcement details. LOD 350 compliant.',
    category: 'revit',
    fileUrl: '/uploads/parametric-columns.rfa',
    fileName: 'Concrete_Column_Parametric.rfa',
    fileType: '.rfa',
    fileSize: 2450000,
    downloadCount: 28,
  },
  {
    _id: 'r3',
    title: 'Commercial Office BIM Model Template',
    description: 'Revit template configured for commercial multi-story building design with pre-loaded schedules and sheets.',
    category: 'revit',
    fileUrl: '/uploads/office-bim-template.rvt',
    fileName: 'Commercial_Office_BIM_Template.rvt',
    fileType: '.rvt',
    fileSize: 15400000,
    downloadCount: 15,
  },
  {
    _id: 'r4',
    title: 'Modern Coffee Shop 3D Assets Pack',
    description: 'Detailed 3D models of cafe tables, counters, and lighting. Optimized for SketchUp and V-Ray rendering.',
    category: 'sketchup',
    fileUrl: '/uploads/coffee-shop-assets.skp',
    fileName: 'Cafe_Interior_Assets.skp',
    fileType: '.skp',
    fileSize: 8900000,
    downloadCount: 36,
  },
  {
    _id: 'r5',
    title: 'Interior Studio Apartment Lighting Scene',
    description: 'Studio apartment lighting setup ready to render in 3ds Max with V-Ray. Physical camera and HDRI environment.',
    category: '3dsmax',
    fileUrl: '/uploads/studio-apartment-lighting.max',
    fileName: 'Studio_Lighting_Scene_VRay.max',
    fileType: '.max',
    fileSize: 34500000,
    downloadCount: 19,
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
  useDocumentTitle(
    'Professional Training Academy | Prema Design Studio',
    'Project-based software training in AutoCAD, Revit BIM, SketchUp, and 3ds Max taught by practicing BIM engineers.'
  );

  const { courseSlug } = useParams();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const coursesRef = useRef(null);
  const inquiryRef = useRef(null);

  // Training Inquiry state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [preferredCourse, setPreferredCourse] = useState('Revit Architecture (BIM)');
  const [learningMode, setLearningMode] = useState('Online');
  const [studentMessage, setStudentMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Deep linking scroll when courseSlug is provided
  useEffect(() => {
    if (courseSlug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(courseSlug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      const matchedCourse = courses.find(
        (c) => c.slug === courseSlug.toLowerCase() || c.software.toLowerCase() === courseSlug.toLowerCase()
      );
      if (matchedCourse) {
        setPreferredCourse(matchedCourse.title);
      }

      return () => clearTimeout(timer);
    }
  }, [courseSlug]);

  const handleOpenPaymentModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        if (res.data.success && res.data.data?.length > 0) {
          setResources(res.data.data);
          setFilteredResources(res.data.data.slice(0, 4));
        } else {
          setResources(fallbackResources);
          setFilteredResources(fallbackResources.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching resources, using fallback:', error);
        setResources(fallbackResources);
        setFilteredResources(fallbackResources.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    let result = resources;
    if (activeFilter !== 'all') {
      result = result.filter((res) => res.category === activeFilter);
    }
    if (searchTerm) {
      result = result.filter(
        (res) =>
          res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredResources(result.slice(0, 4));
  }, [activeFilter, searchTerm, resources]);

  const handleDownload = async (id, fileUrl, fileName) => {
    try {
      await api.post(`/resources/${id}/download`);
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
      );

      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${SERVER_BASE_URL}${fileUrl}`;

      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download trigger failed', error);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryStatus(null);
    try {
      const res = await api.post('/inquiries', {
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        type: 'training',
        subject: `Training Application: ${preferredCourse} (${learningMode})`,
        message: studentMessage || `Interested in enrolling for ${preferredCourse} via ${learningMode} batch.`,
      });
      if (res.data.success) {
        setInquiryStatus({
          success: true,
          message: 'Thank you! Your training inquiry has been received. Our course counselor will contact you promptly within 24–48 business hours with batch details and schedule.',
        });
        setStudentName('');
        setStudentEmail('');
        setStudentPhone('');
        setStudentMessage('');
      } else {
        setInquiryStatus({
          success: false,
          message: res.data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Training inquiry error:', error);
      setInquiryStatus({
        success: false,
        message: error.response?.data?.message || 'Failed to connect to server. Please try again.',
      });
    } finally {
      setSubmittingInquiry(false);
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
      {/* ===== HERO SECTION ===== */}
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
            {/* Explicit Target Audience Strip */}
            <div className="page-hero__audience-strip">
              <span className="page-hero__audience-label">Programs Tailored For:</span>
              <span className="page-hero__audience-tag">Architecture &amp; Civil Students</span>
              <span className="page-hero__audience-tag">Working Professionals</span>
              <span className="page-hero__audience-tag">Job Seekers &amp; Career Changers</span>
            </div>

            <h1>
              Master Industry-Standard <br />
              <span className="text-accent">BIM &amp; Design Software</span>
            </h1>
            <p className="page-hero__subtitle">
              Learn AutoCAD, Revit BIM, SketchUp, and 3ds Max + V-Ray through hands-on,
              project-based training led by seasoned industry architects and BIM engineers.
            </p>

            <div className="page-hero__actions">
              <Button variant="primary" size="lg" onClick={scrollToCourses}>
                Browse Courses <FaArrowRight />
              </Button>
              <Link to="/training/resources">
                <Button variant="outline" size="lg">
                  Free Practice Library
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WHY TRAIN WITH US ===== */}
      <section className="section training-why">
        <div className="container">
          <SectionHeader
            label="Why Train With Us"
            title="Practical, Project-First Learning"
            subtitle="Our curriculum is rooted in actual construction deliverables, not hypothetical textbook tutorials"
          />
          <div className="training-why__grid">
            {[
              {
                icon: <FaUserGraduate />,
                title: 'Real Project Portfolios',
                desc: 'Build live architectural and structural portfolio models you can showcase to employers.',
              },
              {
                icon: <FaLaptop />,
                title: 'Online & Offline Batches',
                desc: 'Attend interactive live online sessions or join in-person at our Gurugram studio.',
              },
              {
                icon: <FaChartLine />,
                title: 'Industry-Ready Standards',
                desc: 'Master BIM layering, family creation, parameter linking, and clash detection workflows.',
              },
              {
                icon: <FaClock />,
                title: 'Flexible Schedules',
                desc: 'Weekend and evening batches designed specifically around student and working hours.',
              },
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

      {/* ===== COURSE LISTINGS ===== */}
      <section ref={coursesRef} className="section training-courses">
        <div className="container">
          <SectionHeader
            label="Available Programs"
            title="Specialized Software &amp; BIM Courses"
            subtitle="Select the track that aligns with your career goals — each includes practical exercises and course completion certificate"
          />

          <motion.div
            className="training-courses__list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {courses.map((course, index) => {
              const courseId = course.slug || course.software.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const isSelected = courseSlug === courseId;
              return (
                <motion.div
                  key={index}
                  id={courseId}
                  className={`course-card glass-card ${course.popularBadge ? 'course-card--popular' : ''} ${isSelected ? 'course-card--highlighted' : ''}`}
                  variants={itemVariants}
                >
                <div className="course-card__header">
                  <h3 className="course-card__title">{course.title}</h3>
                  <div className="course-card__meta">
                    {course.popularBadge && (
                      <span className="course-card__popular-badge">
                        <FaTag className="badge-icon" /> {course.popularBadge}
                      </span>
                    )}
                    <span className="course-card__badge">{course.level}</span>
                  </div>
                </div>

                {/* Price Strip */}
                <div className="course-card__price-box">
                  <div className="price-main flex-between">
                    <div>
                      <span className="price-current">₹{course.price.toLocaleString('en-IN')}</span>
                      {course.originalPrice && (
                        <span className="price-original">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {course.discount && (
                      <span className="price-discount-tag">{course.discount}</span>
                    )}
                  </div>
                  {course.emiOption && (
                    <div className="price-emi-text">
                      <FaCreditCard className="emi-icon" /> {course.emiOption}
                    </div>
                  )}
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
                  <h5>What You&apos;ll Learn</h5>
                  <ul>
                    {course.topics.map((topic, i) => (
                      <li key={i}>
                        <FaCheckCircle className="text-accent" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="course-card__actions">
                  <Button
                    variant="primary"
                    className="course-card__pay-btn"
                    onClick={() => handleOpenPaymentModal(course)}
                  >
                    <FaCreditCard /> Pay &amp; Enroll
                  </Button>

                  <a
                    href="#training-inquiry"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreferredCourse(course.title);
                      inquiryRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Button variant="outline" className="course-card__btn">
                      Request Syllabus
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </section>

      {/* ===== PRACTICE RESOURCES PREVIEW ===== */}
      <section className="section training-resources">
        <div className="container">
          <SectionHeader
            label="Self-Paced Practice"
            title="Free Architectural Practice Library"
            subtitle="Download authentic DWG drawings, Revit family components, and 3D scenes to practice your skills"
          />

          {/* Quick Search and Filter Bar */}
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
                placeholder="Search practice drawings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '20vh' }}>
              <div className="loader" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="resources-empty-state glass-card text-center">
              <p className="text-muted">No practice files match the criteria. Check our full library!</p>
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

          <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
            <Link to="/training/resources">
              <Button variant="outline" size="lg">
                <FaBookOpen /> Explore Full Practice Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STUDENT TESTIMONIALS (AUTO-HIDES IF NONE APPROVED) ===== */}
      <TestimonialsSection
        category="student"
        title="What Our Students Say"
        subtitle="Real feedback from architects, civil engineers, and students who leveled up their modeling skills"
      />

      {/* ===== DEDICATED TRAINING COUNSELING & INQUIRY FORM ===== */}
      <section ref={inquiryRef} id="training-inquiry" className="section" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="home-inquiry__grid">
            <motion.div
              className="home-inquiry__info-col"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-header__label">Student &amp; Professional Counseling</span>
              <h3 style={{ marginTop: 'var(--space-3)' }}>
                Have Questions About <span className="text-accent">Batches &amp; Curriculum?</span>
              </h3>
              <p>
                Not sure whether to start with Revit or AutoCAD? Wondering about weekend batch timings,
                fee installment options, or 1-on-1 portfolio coaching?
                <br /><br />
                Speak directly with an instructor or course counselor. We help you choose the best roadmap
                matching your college semester, internship goals, or career transition timeline.
              </p>

              <ul className="services-why__features" style={{ margin: 0 }}>
                <li><FaCheckCircle className="text-accent" /> 1-on-1 Career &amp; Software Counseling</li>
                <li><FaCheckCircle className="text-accent" /> Offline Hands-on Lab or Interactive Online Live</li>
                <li><FaCheckCircle className="text-accent" /> Course Completion Certificate &amp; Portfolio Review</li>
              </ul>
            </motion.div>

            <motion.div
              className="home-inquiry__form-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleInquirySubmit} className="home-inquiry__form">
                {inquiryStatus && (
                  <div
                    className={`home-inquiry__status-msg ${
                      inquiryStatus.success
                        ? 'home-inquiry__status-msg--success'
                        : 'home-inquiry__status-msg--error'
                    }`}
                  >
                    {inquiryStatus.message}
                  </div>
                )}

                <div className="home-inquiry__form-row">
                  <div className="home-inquiry__form-group">
                    <label htmlFor="student-name">Your Name *</label>
                    <input
                      type="text"
                      id="student-name"
                      className="home-inquiry__input"
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="home-inquiry__form-group">
                    <label htmlFor="student-email">Email Address *</label>
                    <input
                      type="email"
                      id="student-email"
                      className="home-inquiry__input"
                      placeholder="rahul@example.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="home-inquiry__form-row">
                  <div className="home-inquiry__form-group">
                    <label htmlFor="student-phone">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="student-phone"
                      className="home-inquiry__input"
                      placeholder="+91 XXXXX XXXXX"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="home-inquiry__form-group">
                    <label htmlFor="student-course">Interested Course *</label>
                    <select
                      id="student-course"
                      className="home-inquiry__select"
                      value={preferredCourse}
                      onChange={(e) => setPreferredCourse(e.target.value)}
                    >
                      <option value="AutoCAD — 2D & 3D Drafting">AutoCAD — 2D &amp; 3D Drafting</option>
                      <option value="Revit Architecture (BIM)">Revit Architecture (BIM)</option>
                      <option value="Revit Structure (BIM Detailing)">Revit Structure (BIM Detailing)</option>
                      <option value="SketchUp + V-Ray Photorealistic">SketchUp + V-Ray Photorealistic</option>
                      <option value="3ds Max + V-Ray Masterclass">3ds Max + V-Ray Masterclass</option>
                      <option value="Master BIM & Visualization Bundle">Master BIM &amp; Visualization Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="home-inquiry__form-group">
                  <label htmlFor="student-mode">Preferred Learning Mode</label>
                  <select
                    id="student-mode"
                    className="home-inquiry__select"
                    value={learningMode}
                    onChange={(e) => setLearningMode(e.target.value)}
                  >
                    <option value="Online">Online Live Batch</option>
                    <option value="Offline">Offline Studio Batch (Gurugram)</option>
                    <option value="Weekend">Weekend Professional Batch</option>
                  </select>
                </div>

                <div className="home-inquiry__form-group">
                  <label htmlFor="student-message">Questions or Background (Optional)</label>
                  <textarea
                    id="student-message"
                    rows="3"
                    className="home-inquiry__textarea"
                    placeholder="Tell us about your background (e.g. 3rd year civil student, practicing architect) or any specific requirements..."
                    value={studentMessage}
                    onChange={(e) => setStudentMessage(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submittingInquiry}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submittingInquiry ? 'Sending Inquiry...' : 'Request Syllabus & Callback'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment & Enrollment Modal */}
      <CoursePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default TrainingPage;
