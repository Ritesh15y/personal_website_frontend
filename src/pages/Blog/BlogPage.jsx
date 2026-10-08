import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaClock, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import api from '../../shared/lib/api';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import './BlogPage.css';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Verified editorial categories per Requirement 13
const categoriesList = [
  { id: '', label: 'All Topics' },
  { id: 'Architecture', label: 'Architecture' },
  { id: 'BIM', label: 'BIM' },
  { id: 'Revit', label: 'Revit' },
  { id: 'AutoCAD', label: 'AutoCAD' },
  { id: 'Structural BIM', label: 'Structural BIM' },
  { id: 'MEP', label: 'MEP' },
  { id: '3D Visualization', label: '3D Visualization' },
  { id: 'AEC Workflows', label: 'AEC Workflows' },
  { id: 'Training & Career', label: 'Training & Career' },
];

const BlogPage = () => {
  useDocumentTitle(
    'Technical Insights & AEC Workflows | Prema Design Studio',
    'Practical, practitioner-authored articles on Architecture, BIM, Revit, structural coordination, and hands-on AEC software workflows.'
  );

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data.success && res.data.data) {
          setBlogs(res.data.data);
          setFilteredBlogs(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter handlers
  useEffect(() => {
    let result = blogs;

    if (selectedCategory) {
      result = result.filter((post) => {
        const cat = (post.category || '').toLowerCase();
        const tags = (post.tags || []).map((t) => t.toLowerCase());
        const matchTerm = selectedCategory.toLowerCase();
        return cat === matchTerm || tags.includes(matchTerm);
      });
    }

    if (searchTerm) {
      const sTerm = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(sTerm) ||
          (post.excerpt || '').toLowerCase().includes(sTerm) ||
          post.tags?.some((t) => t.toLowerCase().includes(sTerm))
      );
    }

    setFilteredBlogs(result);
  }, [searchTerm, selectedCategory, blogs]);

  return (
    <div className="blog-page">
      {/* Hero Header */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <div className="blog-hero__mesh-bg" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero__label">AEC Knowledge &amp; Practice</span>
            <h1>
              Design <span className="text-accent">Insights</span>
            </h1>
            <p className="page-hero__subtitle">
              Practitioner-authored workflows, technical documentation guides, and BIM coordination insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main feed catalog */}
      <section className="section">
        <div className="container">
          {blogs.length > 0 && (
            <div className="blog-filter-bar flex-between">
              {/* Category pills */}
              <div className="blog-tags">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    className={`tag-pill ${selectedCategory === cat.id ? 'tag-pill--active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="blog-search flex">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {loading ? (
            <div className="blog-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="blog-card blog-card--skeleton">
                  <div className="skeleton skeleton--image" />
                  <div className="blog-card__content">
                    <div className="skeleton skeleton--line skeleton--short" />
                    <div className="skeleton skeleton--line" />
                    <div className="skeleton skeleton--line skeleton--medium" />
                    <div className="skeleton skeleton--line skeleton--short" style={{ marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            /* Requirement 12: Premium editorial empty state */
            <motion.div
              className="blog-empty-editorial text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="blog-empty-editorial__badge">
                <FaBookOpen /> Editorial &amp; Technical Insights
              </div>
              <h2 className="blog-empty-editorial__title">Practical Insights Coming Soon</h2>
              <p className="blog-empty-editorial__desc">
                Prema Design Studio is preparing a collection of practical articles on Architecture, BIM, Revit, and AEC workflows. Each article is written from real project experience and hands-on software instruction.
              </p>
              <div className="blog-empty-editorial__actions">
                <Link to="/services">
                  <Button variant="primary" size="lg">
                    Explore Our Services <FaArrowRight />
                  </Button>
                </Link>
                <Link to="/training">
                  <Button variant="outline" size="lg">
                    Explore Training
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : filteredBlogs.length === 0 ? (
            <div className="blog-empty-state glass-card text-center">
              <p className="text-muted">No articles found matching the selected topic.</p>
            </div>
          ) : (
            <motion.div
              className="blog-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {filteredBlogs.map((post) => (
                <motion.div key={post._id} className="blog-card glass-card" variants={itemVariants}>
                  <Link to={`/blog/${post.slug}`} className="blog-card__link">
                    <div className="blog-card__image-wrapper">
                      {(post.featuredImage?.url || post.coverImage) ? (
                        <img
                          src={post.featuredImage?.url || post.coverImage}
                          alt={post.title}
                          className="blog-card__image"
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="340"
                        />
                      ) : (
                        <div className="blog-card__fallback-img" />
                      )}
                    </div>
                    <div className="blog-card__content">
                      <div className="blog-card__meta flex">
                        <span className="flex-center">
                          <FaCalendarAlt size={12} />{' '}
                          {new Date(post.publicationDate || post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex-center">
                          <FaClock size={12} /> {post.readTime || '5 min read'}
                        </span>
                      </div>

                      <h3 className="blog-card__title">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>

                      <div className="blog-card__footer flex-between">
                        <div className="blog-card__tags">
                          <span className="blog-card__tag">
                            {post.category || 'BIM'}
                          </span>
                        </div>
                        <span className="blog-card__more flex-center">
                          Read More <FaArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
