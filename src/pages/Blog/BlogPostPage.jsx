import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaArrowLeft, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './BlogPostPage.css';

import { initialBlogsData } from '../../config/blogsData';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${slug}`);
        if (res.data.success && res.data.data) {
          const blogData = res.data.data;
          setPost(blogData);

          const allRes = await api.get('/blogs');
          if (allRes.data.success && allRes.data.data) {
            const filtered = allRes.data.data
              .filter((p) => p.slug !== blogData.slug)
              .slice(0, 2);
            setRelatedPosts(filtered);
          } else {
            const filtered = initialBlogsData
              .filter((p) => p.slug !== blogData.slug)
              .slice(0, 2);
            setRelatedPosts(filtered);
          }
        } else {
          const staticPost = initialBlogsData.find((p) => p.slug === slug);
          setPost(staticPost || null);
          if (staticPost) {
            const filtered = initialBlogsData
              .filter((p) => p.slug !== staticPost.slug)
              .slice(0, 2);
            setRelatedPosts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching blog details, using static fallback:', error);
        const staticPost = initialBlogsData.find((p) => p.slug === slug);
        setPost(staticPost || null);
        if (staticPost) {
          const filtered = initialBlogsData
            .filter((p) => p.slug !== staticPost.slug)
            .slice(0, 2);
          setRelatedPosts(filtered);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [slug]);

  // Convert markdown-like syntax to simple HTML blocks for high-fidelity rendering
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    // Regex for markdown links [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      if (url.startsWith('/')) {
        parts.push(
          <Link key={match.index} to={url} style={{ color: 'var(--color-accent, #e5a93c)', fontWeight: 600, textDecoration: 'underline' }}>
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent, #e5a93c)', fontWeight: 600, textDecoration: 'underline' }}>
            {label}
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.map((part, pIdx) => {
      if (typeof part === 'string') {
        const boldParts = part.split('**');
        return boldParts.map((bStr, bIdx) =>
          bIdx % 2 !== 0 ? <strong key={`${pIdx}-${bIdx}`}>{bStr}</strong> : bStr
        );
      }
      return part;
    });
  };

  const renderContent = (content) => {
    if (!content) return '';
    return content.split('\n\n').map((block, index) => {
      // Heading 3
      if (block.startsWith('### ')) {
        return <h3 key={index}>{parseInlineMarkdown(block.replace('### ', ''))}</h3>;
      }
      // Heading 2
      if (block.startsWith('## ')) {
        return <h2 key={index}>{parseInlineMarkdown(block.replace('## ', ''))}</h2>;
      }
      // Bullet list items
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block
          .split('\n')
          .map((item) => item.replace(/^[-\*]\s+/, ''));
        return (
          <ul key={index} className="post-bullets">
            {items.map((it, i) => (
              <li key={i}>{parseInlineMarkdown(it)}</li>
            ))}
          </ul>
        );
      }
      // Divider
      if (block === '---') {
        return <hr key={index} className="post-divider" />;
      }
      return <p key={index}>{parseInlineMarkdown(block)}</p>;
    });
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loader" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-24) 0' }}>
        <h3>Article Not Found</h3>
        <p style={{ margin: 'var(--space-4) 0 var(--space-8)' }}>The post you are trying to view does not exist or has been removed.</p>
        <Link to="/blog">
          <Button variant="outline"><FaArrowLeft /> Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Article Header Hero */}
      <section className="post-hero">
        <div className="post-hero__bg">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600'}
            alt={post.title}
            className="post-hero__image"
          />
          <div className="post-hero__overlay" />
        </div>
        <div className="post-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/blog" className="back-link flex-center">
              <FaArrowLeft /> <span>Back to Insights</span>
            </Link>
            <div className="post-meta flex">
              <span className="post-meta__badge">{post.tags?.[0] || 'Design'}</span>
              <span className="flex-center">
                <FaCalendarAlt /> {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex-center">
                <FaClock /> {post.readTime || '5 min read'}
              </span>
            </div>
            <h1 className="post-title">{post.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Main post layout */}
      <section className="section">
        <div className="container post-container">
          <div className="post-layout-grid">
            {/* Article Content */}
            <article className="post-body glass-card">
              <div className="post-body__rich-text">{renderContent(post.content)}</div>
              
              <div className="post-tags-list">
                {post.tags?.map((t, i) => (
                  <span key={i} className="post-tag-item">#{t}</span>
                ))}
              </div>
            </article>

            {/* Sidebar CTAs */}
            <aside className="post-sidebar">
              {/* Training CTA */}
              <div className="sidebar-cta glass-card">
                <FaBookOpen className="cta-icon text-accent" />
                <h4>Master Revit & AutoCAD</h4>
                <p>
                  Accelerate your architectural career. Join our professional, project-based
                  training courses with direct trainer support.
                </p>
                <Link to="/training">
                  <Button variant="primary" className="cta-btn">
                    Explore Courses <FaArrowRight />
                  </Button>
                </Link>
              </div>

              {/* Inquiry CTA */}
              <div className="sidebar-cta sidebar-cta--dark glass-card">
                <h4>Looking for a Design Partner?</h4>
                <p>
                  We deliver top-quality 2D drafting, BIM coordination, and 3D rendering for firms worldwide.
                </p>
                <Link to="/contact?type=project&subject=Collaboration%20Inquiry">
                  <Button variant="outline" className="cta-btn">
                    Let's Collaborate
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section related-section">
          <div className="container">
            <h3 className="related-title">Related Insights</h3>
            <div className="related-grid">
              {relatedPosts.map((rPost) => (
                <div key={rPost._id} className="related-card glass-card">
                  <Link to={`/blog/${rPost.slug}`} className="related-card__link">
                    <img
                      src={rPost.coverImage || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600'}
                      alt={rPost.title}
                      className="related-card__img"
                    />
                    <div className="related-card__content">
                      <h4>{rPost.title}</h4>
                      <span className="related-card__more flex-center">
                        Read Article <FaArrowRight />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
