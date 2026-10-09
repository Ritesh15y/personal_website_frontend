import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaLaptopCode,
} from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import BeforeAfterSlider from '../../shared/components/BeforeAfterSlider/BeforeAfterSlider';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import './ProjectDetailPage.css';

// Fallback static detailed projects database in case backend collection is unseeded or offline
const fallbackProjects = {
  'modern-residential-villa': {
    title: 'Modern Residential Villa',
    category: 'residential',
    classification: 'Concept Project',
    software: ['Revit', '3ds Max', 'V-Ray', 'AutoCAD'],
    description: 'An architectural concept villa exploring advanced BIM workflows for architectural layout and structural detailing. The design concept focuses on blurring the line between indoor and outdoor living with reinforced concrete framing and custom parametric Revit families.',
    thumbnail: { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586217/portfolio/file_quirjg.png' },
    images: [
      { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586217/portfolio/file_quirjg.png', caption: 'Modern Facade Rendering' }
    ]
  },
  'student-villa-concept': {
    title: 'Student Villa Concept',
    category: 'student-projects',
    classification: 'Student Project',
    software: ['Revit', '3ds Max', 'V-Ray'],
    description: 'A conceptual villa modeling project developed during student BIM training at Prema Design Studio. Features residential room planning and 3D visualization.',
    thumbnail: { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586181/portfolio/file_udkygn.png' },
    images: [
      { url: 'https://res.cloudinary.com/vr0slvvw/image/upload/v1785586181/portfolio/file_udkygn.png', caption: 'Student Villa Exterior Rendering' }
    ]
  }
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useDocumentTitle(
    project ? `${project.title} | Prema Design Studio Portfolio` : 'Project Not Found | Prema Design Studio',
    project?.description || 'The requested portfolio project could not be found or has been unlisted.',
    { noindex: !project }
  );

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/${slug}`);
        if (res.data.success && res.data.data) {
          setProject(res.data.data);
          
          // Set initial active image for gallery preview
          const firstImage = res.data.data.thumbnail?.url || res.data.data.images?.[0]?.url || res.data.data.image;
          setActiveImage(firstImage);
        } else {
          loadFallback();
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const fallback = fallbackProjects[slug];
      if (fallback) {
        setProject(fallback);
        const firstImage = fallback.thumbnail?.url || fallback.images?.[0]?.url || fallback.image;
        setActiveImage(firstImage);
      } else {
        setProject(null);
      }
    };

    fetchProjectDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="spinner" />
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-not-found container">
        <h2>Project Not Found</h2>
        <p>The project you are looking for does not exist or has been removed.</p>
        <Link to="/portfolio">
          <Button variant="primary">
            <FaArrowLeft /> Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  const categoryLabel = project.category ? project.category.replace('-', ' ') : 'Design';
  const mainImage = project.thumbnail?.url || project.images?.[0]?.url || project.image;
  const galleryImages = project.images && project.images.length > 0 ? project.images : [{ url: mainImage, caption: project.title }];

  return (
    <div className="project-detail-page">
      {/* Hero Section */}
      <section className="project-detail-hero">
        <div className="project-detail-hero__bg">
          <img src={mainImage} alt={project.title} className="project-detail-hero__image" />
          <div className="project-detail-hero__overlay" />
        </div>
        <div className="container project-detail-hero__content">
          <Link to="/portfolio" className="project-detail-breadcrumb">
            <FaArrowLeft /> Back to Project Portfolio
          </Link>
          <span className="project-detail-hero__category">{categoryLabel}</span>
          <h1 className="project-detail-hero__title">{project.title}</h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section project-detail-body">
        <div className="container">
          <div className="project-detail-grid">
            {/* Info and Description Column */}
            <div className="project-detail__main-col">
              <div className="project-detail__description glass-card">
                <h3>About the Project</h3>
                <div className="divider-sm" />
                <p className="project-detail__text">{project.description || 'No project description available.'}</p>
              </div>

              {/* Gallery Section */}
              <div className="project-detail__gallery-section">
                <h3>Project Gallery</h3>
                <div className="divider-sm" />
                
                {/* Large Preview */}
                <div className="project-detail__gallery-preview glass-card">
                  <img src={activeImage} alt={project.title} className="gallery-preview-img" />
                  {project.images?.find(img => img.url === activeImage)?.caption && (
                    <div className="gallery-preview-caption">
                      {project.images.find(img => img.url === activeImage).caption}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="project-detail__thumbnails">
                    {galleryImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`project-detail__thumbnail-wrapper glass-card ${activeImage === img.url ? 'thumbnail-active' : ''}`}
                        onClick={() => setActiveImage(img.url)}
                      >
                        <img src={img.url} alt={img.caption || `Gallery ${idx}`} className="gallery-thumb-img" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Demonstration: 2D Blueprint vs 3D Render Workflow */}
              {(project.beforeImage || project.blueprintImage) && (
                <div className="project-detail__comparison-section" style={{ marginTop: 'var(--space-8)' }}>
                  <h3>Demonstration Workflow: 2D Blueprint to 3D Render</h3>
                  <div className="divider-sm" />
                  <p className="project-detail__text" style={{ marginBottom: 'var(--space-4)' }}>
                    Demonstration workflow illustrating how 2D CAD drafting schematics translate into high-fidelity 3D rendered visualization.
                  </p>
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage || project.blueprintImage}
                    afterImage={mainImage}
                    beforeLabel="Demonstration 2D CAD"
                    afterLabel="Final 3D Render"
                    altText={`${project.title} demonstration comparison`}
                  />
                </div>
              )}
            </div>

            {/* Sidebar Column (Metadata) */}
            <div className="project-detail__sidebar-col">
              <div className="project-detail__info-card glass-card">
                <h3>Project Details</h3>
                <div className="divider-sm" />
                
                <div className="project-detail__info-list">
                  <div className="project-detail__info-item">
                    <div className="project-detail__info-icon"><FaBuilding /></div>
                    <div>
                      <span className="info-label">Project Type</span>
                      <span className="info-val">{project.classification || project.projectType || (project.category === 'student-projects' ? 'Student Project' : 'Concept / Demonstration')}</span>
                    </div>
                  </div>

                  {project.location ? (
                    <div className="project-detail__info-item">
                      <div className="project-detail__info-icon"><FaMapMarkerAlt /></div>
                      <div>
                        <span className="info-label">Location</span>
                        <span className="info-val">{project.location}</span>
                      </div>
                    </div>
                  ) : null}

                  {project.area ? (
                    <div className="project-detail__info-item">
                      <div className="project-detail__info-icon"><FaRulerCombined /></div>
                      <div>
                        <span className="info-label">Covered Area</span>
                        <span className="info-val">{project.area}</span>
                      </div>
                    </div>
                  ) : null}

                  {project.software && project.software.length > 0 && (
                    <div className="project-detail__info-item">
                      <div className="project-detail__info-icon"><FaLaptopCode /></div>
                      <div>
                        <span className="info-label">Software Used</span>
                        <div className="project-detail__software-tags">
                          {project.software.map((sw, idx) => (
                            <span key={idx} className="software-tag">{sw}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="project-detail__sidebar-cta">
                  <p>Need similar design or modeling support for your next project?</p>
                  <Link to="/contact?type=project">
                    <Button variant="primary" size="md" style={{ width: '100%', justifyContent: 'center' }}>
                      Inquire About This Service
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Training Promo Card (Only shown for Student Projects to convert students) */}
              {project.category === 'student-projects' && (
                <div className="project-detail__promo-card glass-card animate-fade-in">
                  <h3>🎓 Learn to Build This</h3>
                  <div className="divider-sm" />
                  <p className="promo-text">
                    Master Revit, 3ds Max, and AutoCAD by modeling real-world projects like this concept villa. We offer online and offline batches for beginners and professionals.
                  </p>
                  <ul className="promo-features">
                    <li>✓ One-on-one mentorship</li>
                    <li>✓ Course completion certificate</li>
                    <li>✓ Career guidance &amp; portfolio preparation</li>
                  </ul>
                  <Link to="/training">
                    <Button variant="outline" size="md" style={{ width: '100%', justifyContent: 'center' }}>
                      Explore Training Programs
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
