import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaLaptopCode,
} from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import BeforeAfterSlider from '../../shared/components/BeforeAfterSlider/BeforeAfterSlider';
import './ProjectDetailPage.css';

// Fallback static detailed projects database in case backend collection is unseeded or offline
const fallbackProjects = {
  'modern-residential-villa': {
    title: 'Modern Residential Villa',
    category: 'residential',
    client: 'Private Owner',
    location: 'Mumbai, India',
    area: '5,500 sq ft',
    software: ['Revit', '3ds Max', 'V-Ray'],
    description: 'A luxurious multi-story residential villa utilizing advanced BIM workflows for architectural layout and structural detailing. The design concept focuses on blurring the line between indoor and outdoor living. The structure is built with reinforced concrete framing, featuring large spans that allow for open-plan social zones. The interior leverages custom parametric Revit families, photorealistic render details, and high-end timber paneling to deliver a cohesive design solution.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80' },
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', caption: 'Modern Facade Rendering' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', caption: 'Rear Poolside Elevation' },
      { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', caption: 'Master Bedroom Render' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', caption: 'Living Room Spatial Design' }
    ]
  },
  'corporate-office-tower': {
    title: 'Corporate Office Tower',
    category: 'commercial',
    client: 'DesignCorp Ltd',
    location: 'Bangalore, India',
    area: '120,000 sq ft',
    software: ['Revit', 'Navisworks', 'AutoCAD'],
    description: 'A high-rise commercial office building with comprehensive structural and MEP (Mechanical, Electrical, Plumbing) clash detection. We developed standardized BIM library libraries and family parameters to guarantee structural stability and compliance. Navisworks was used to run exhaustive clash detection diagnostics, preventing costly construction re-works and field conflicts.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', caption: 'Exterior Tower View' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', caption: 'Corporate Boardroom Design' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', caption: 'Open-Office Workspace' }
    ]
  },
  'international-school-campus': {
    title: 'International School Campus',
    category: 'school',
    client: 'Zenith Education Group',
    location: 'Pune, India',
    area: '85,000 sq ft',
    software: ['Revit', 'SketchUp', 'Photoshop'],
    description: 'A modern school campus featuring interactive learning spaces, dynamic sports facilities, and optimized circulation routes. The Revit models were built to support future facility operations and maintenance. Special attention was paid to natural daylight penetration inside classrooms and acoustic isolation for the auditorium.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', caption: 'Main Academic Wing' },
      { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', caption: 'Interactive Learning Library' }
    ]
  },
  'multi-specialty-hospital': {
    title: 'Multi-Specialty Hospital',
    category: 'hospital',
    client: 'CareFirst Healthcare',
    location: 'Hyderabad, India',
    area: '95,000 sq ft',
    software: ['Revit', 'Navisworks'],
    description: 'A state-of-the-art healthcare project modeled to support high-density medical equipment, complex plumbing lines, and strict hygiene air-handling systems. Using Revit Structure and MEP link files, we ran extensive multi-discipline coordination cycles to identify and resolve clashes ahead of building erection.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80', caption: 'Front Outpatient Entrance' },
      { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', caption: 'Emergency Ward Corridor' }
    ]
  },
  'luxury-apartment-interior': {
    title: 'Luxury Apartment Interior',
    category: 'interior',
    client: 'Private Client',
    location: 'Delhi NCR, India',
    area: '3,200 sq ft',
    software: ['3ds Max', 'V-Ray'],
    description: 'High-end interior visualization showcasing custom furniture, bespoke ambient lighting panels, and rich textures. We created high-resolution, photorealistic 3D renders that allow the client to visually explore material choices, lighting setups, and spatial flow before final execution.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', caption: 'Formal Living Space' },
      { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', caption: 'Kitchen and Dining Area' }
    ]
  },
  'student-villa-concept': {
    title: 'Student Villa Concept',
    category: 'student-projects',
    client: 'Academic Thesis',
    location: 'New Delhi, India',
    area: '4,200 sq ft',
    software: ['Revit', '3ds Max', 'Photoshop'],
    description: 'This conceptual design project showcases a modern villa designed specifically as a student hub or high-end co-living space. Featuring spacious common areas, private study zones, and sustainable landscape integration, the modeling was developed in Revit for structural precision and visualized in 3ds Max.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80' },
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', caption: 'Exterior Rendering' },
      { url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80', caption: 'Living Area Concept' },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', caption: 'Floor Plan Layout' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', caption: 'Courtyard View' }
    ]
  },
  'contemporary-beach-house': {
    title: 'Contemporary Beach House',
    category: 'residential',
    client: 'Coastal Developers',
    location: 'Goa, India',
    area: '3,800 sq ft',
    software: ['AutoCAD', 'SketchUp', 'V-Ray'],
    description: 'A modern coastal residential dwelling designed to withstand salty winds while maximizing sea vistas. Featuring floating cantilever terraces, natural stone walls, and high-performance glass cladding. The 2D drawings were detailed in AutoCAD and modeled in SketchUp for V-Ray rendering.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', caption: 'Coastal Frontage Elevation' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', caption: 'Master Bed Terrace' }
    ]
  },
  'retail-mall-design': {
    title: 'Retail Mall Design',
    category: 'commercial',
    client: 'Apex Retail Group',
    location: 'Noida, India',
    area: '240,000 sq ft',
    software: ['Revit', '3ds Max', 'AutoCAD'],
    description: 'A large-scale commercial retail mall structure utilizing Revit BIM. Highlights include dynamic double-height glass atriums, multi-level structural grids, and coordination with HVAC / electrical services. Highly optimized sheets were produced for on-site civil execution.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&q=80', caption: 'Central Atrium Layout' },
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', caption: 'Storefront Facade Detail' }
    ]
  },
  'modern-kitchen-interior': {
    title: 'Modern Kitchen Interior',
    category: 'interior',
    client: 'Homeowner',
    location: 'Gurugram, India',
    area: '450 sq ft',
    software: ['3ds Max', 'V-Ray', 'AutoCAD'],
    description: 'A contemporary modular kitchen design focusing on space optimization and ergonomics. Features integrated appliances, matte charcoal finish cabinetry, and marble countertops. Visualization was completed in 3ds Max for lighting and texture validation.',
    thumbnail: { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80' },
    images: [
      { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', caption: 'Main Kitchen Counter' },
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', caption: 'Breakfast Island Detail' }
    ]
  }
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

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
      {/* Floating Back Button */}
      <Link to="/portfolio" className="project-detail-back-btn" title="Back to Portfolio">
        <FaArrowLeft />
      </Link>

      {/* Hero Section */}
      <section className="project-detail-hero">
        <div className="project-detail-hero__bg">
          <img src={mainImage} alt={project.title} className="project-detail-hero__image" />
          <div className="project-detail-hero__overlay" />
        </div>
        <div className="container project-detail-hero__content">
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

              {/* Interactive 2D Blueprint vs 3D Render Comparison (if available) */}
              {(project.beforeImage || project.blueprintImage) && (
                <div className="project-detail__comparison-section" style={{ marginTop: 'var(--space-8)' }}>
                  <h3>2D Blueprint to 3D Render Comparison</h3>
                  <div className="divider-sm" />
                  <p className="project-detail__text" style={{ marginBottom: 'var(--space-4)' }}>
                    Slide left and right to visually inspect how initial CAD technical drawings were translated into the final 3D rendered visualization.
                  </p>
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage || project.blueprintImage}
                    afterImage={mainImage}
                    beforeLabel="2D Blueprint / CAD"
                    afterLabel="Final 3D Render"
                    altText={`${project.title} comparison`}
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
                    <div className="project-detail__info-icon"><FaUser /></div>
                    <div>
                      <span className="info-label">Client</span>
                      <span className="info-val">{project.client || 'Prema Studio Partner'}</span>
                    </div>
                  </div>

                  <div className="project-detail__info-item">
                    <div className="project-detail__info-icon"><FaMapMarkerAlt /></div>
                    <div>
                      <span className="info-label">Location</span>
                      <span className="info-val">{project.location || 'India'}</span>
                    </div>
                  </div>

                  <div className="project-detail__info-item">
                    <div className="project-detail__info-icon"><FaRulerCombined /></div>
                    <div>
                      <span className="info-label">Covered Area</span>
                      <span className="info-val">{project.area || 'Custom Scale'}</span>
                    </div>
                  </div>

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
                    <li>✓ Professional certification</li>
                    <li>✓ Placement assistance</li>
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
