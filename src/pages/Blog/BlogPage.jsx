import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import api from '../../shared/lib/api';
import SectionHeader from '../../shared/components/SectionHeader/SectionHeader';
import './BlogPage.css';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);

  // Extract all unique tags
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data.success) {
          setBlogs(res.data.data);
          setFilteredBlogs(res.data.data);

          // Get tags
          const tagsSet = new Set();
          res.data.data.forEach((post) => {
            if (post.tags) post.tags.forEach((t) => tagsSet.add(t));
          });
          setAllTags(Array.from(tagsSet));
        }
      } catch (error) {
        console.error('Error fetching blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter handlers
  useEffect(() => {
    let result = blogs;

    if (selectedTag) {
      result = result.filter((post) =>
        post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(result);
  }, [searchTerm, selectedTag, blogs]);

  return (
    <div className="blog-page">
      {/* Hero Header */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
            alt="Blogs cover"
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
            <span className="hero__label">News & Articles</span>
            <h1>
              Design <span className="text-accent">Insights</span>
            </h1>
            <p className="page-hero__subtitle">
              Read architectural updates, design trends, software tutorials, and learning guides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main feed catalog */}
      <section className="section">
        <div className="container">
          <div className="blog-filter-bar flex-between">
            {/* Tag pills */}
            <div className="blog-tags">
              <button
                className={`tag-pill ${!selectedTag ? 'tag-pill--active' : ''}`}
                onClick={() => setSelectedTag('')}
              >
                All Topics
              </button>
              {allTags.map((tag, i) => (
                <button
                  key={i}
                  className={`tag-pill ${selectedTag === tag ? 'tag-pill--active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
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

          {loading ? (
            <div className="flex-center" style={{ minHeight: '30vh' }}>
              <div className="loader" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="blog-empty-state glass-card text-center">
              <p className="text-muted">No articles found matching the criteria.</p>
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
                      <img
                        src={post.coverImage || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'}
                        alt={post.title}
                        className="blog-card__image"
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card__content">
                      <div className="blog-card__meta flex">
                        <span className="flex-center">
                          <FaCalendarAlt size={12} />{' '}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex-center">
                          <FaClock size={12} /> {post.readTime || '5 min read'}
                        </span>
                      </div>

                      <h3 className="blog-card__title">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>

                      <div className="blog-card__footer flex-between">
                        <div className="blog-card__tags">
                          {post.tags?.map((t, index) => (
                            <span key={index} className="blog-card__tag">
                              #{t}
                            </span>
                          ))}
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
