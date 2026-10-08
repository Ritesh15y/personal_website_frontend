import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload } from 'react-icons/fa';
import api, { SERVER_BASE_URL } from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManageBlog.css';

const BLOG_CATEGORIES = [
  'Architecture',
  'BIM',
  'Revit',
  'AutoCAD',
  'Structural BIM',
  'MEP',
  '3D Visualization',
  'AEC Workflows',
  'Training & Career',
];

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null); // null = list, object = form
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('BIM');
  const [coverImage, setCoverImage] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [tags, setTags] = useState(''); // Comma separated
  const [status, setStatus] = useState('draft');
  const [readTime, setReadTime] = useState('5 min read');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [relatedServices, setRelatedServices] = useState('');
  const [relatedProjects, setRelatedProjects] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs?status=all');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (error) {
      console.error('Error loading blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEditClick = (post) => {
    setEditingBlog(post);
    setTitle(post.title || '');
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setCategory(post.category || 'BIM');
    setCoverImage(post.coverImage || post.featuredImage?.url || '');
    setImageSource(post.featuredImage?.source || '');
    setImageCaption(post.featuredImage?.caption || '');
    setAuthorName(post.author?.name || '');
    setAuthorRole(post.author?.role || '');
    setAuthorBio(post.author?.bio || '');
    setTags(post.tags ? post.tags.join(', ') : '');
    setStatus(post.status || 'draft');
    setReadTime(post.readTime || '5 min read');
    setSeoTitle(post.seoTitle || '');
    setMetaDescription(post.metaDescription || '');
    setCanonicalUrl(post.canonicalUrl || '');
    setRelatedServices(post.relatedServices ? post.relatedServices.join(', ') : '');
    setRelatedProjects(post.relatedProjects ? post.relatedProjects.join(', ') : '');
  };

  const handleCreateClick = () => {
    setEditingBlog({ _id: 'new' });
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('BIM');
    setCoverImage('');
    setImageSource('');
    setImageCaption('');
    setAuthorName('');
    setAuthorRole('');
    setAuthorBio('');
    setTags('');
    setStatus('draft');
    setReadTime('5 min read');
    setSeoTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
    setRelatedServices('');
    setRelatedProjects('');
  };

  const handleCancel = () => {
    setEditingBlog(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        const returnedUrl = res.data.data.url;
        if (returnedUrl.startsWith('http')) {
          setCoverImage(returnedUrl);
        } else {
          setCoverImage(SERVER_BASE_URL + returnedUrl);
        }
      }
    } catch (error) {
      console.error('File upload failed', error);
      alert('Upload failed. Check format size limits.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error('Error deleting blog post', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const tagsList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const servicesList = relatedServices
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const projectsList = relatedProjects
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const payload = {
      title,
      excerpt,
      content,
      category,
      coverImage,
      featuredImage: {
        url: coverImage,
        source: imageSource,
        caption: imageCaption,
      },
      author: {
        name: authorName,
        role: authorRole,
        bio: authorBio,
      },
      tags: tagsList,
      status,
      readTime,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      canonicalUrl,
      relatedServices: servicesList,
      relatedProjects: projectsList,
    };

    try {
      if (editingBlog._id === 'new') {
        const res = await api.post('/blogs', payload);
        if (res.data.success) {
          setBlogs([res.data.data, ...blogs]);
          setEditingBlog(null);
        }
      } else {
        const res = await api.put(`/blogs/${editingBlog._id}`, payload);
        if (res.data.success) {
          setBlogs(blogs.map((b) => (b._id === editingBlog._id ? res.data.data : b)));
          setEditingBlog(null);
        }
      }
    } catch (error) {
      console.error('Error saving blog post', error);
      alert(error.response?.data?.message || 'Error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="manage-blog">
      <div className="manage-blog__header flex-between">
        <div>
          <h3>Editorial Blog CMS</h3>
          <p>Draft, review, and publish experience-based technical articles and BIM guides.</p>
        </div>
        {!editingBlog && (
          <Button variant="primary" onClick={handleCreateClick}>
            <FaPlus /> Write New Article
          </Button>
        )}
      </div>

      {editingBlog ? (
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="blog-form glass-card animate-scale-in">
          <h4>{editingBlog._id === 'new' ? 'Draft New Article' : 'Edit Article Content'}</h4>

          {/* Core Information */}
          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="title">Article Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. How We Set Up Levels and Grids in a Revit Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="category">Category *</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="status">Editorial Status *</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft (Work in Progress - Hidden)</option>
                <option value="review">Review (Editorial Check - Hidden)</option>
                <option value="approved">Approved (Verified - Publicly Visible)</option>
                <option value="published">Published (Live - Publicly Visible)</option>
              </select>
              <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Only Approved or Published articles will appear on the public website.
              </small>
            </div>
            <div className="blog-form__group">
              <label htmlFor="readTime">Estimated Read Time *</label>
              <input
                id="readTime"
                type="text"
                placeholder="e.g. 6 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Real Human Authorship */}
          <h5 className="blog-form__section-title">Verified Author Information</h5>
          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="authorName">Author Full Name *</label>
              <input
                id="authorName"
                type="text"
                placeholder="e.g. Ritesh Prema"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="authorRole">Author Role / Specialization *</label>
              <input
                id="authorRole"
                type="text"
                placeholder="e.g. Principal Architect & BIM Lead"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="blog-form__group">
            <label htmlFor="authorBio">Author Short Bio</label>
            <input
              id="authorBio"
              type="text"
              placeholder="e.g. Architect with hands-on practice in Revit structural coordination and architectural drafting."
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
            />
          </div>

          {/* Media & Visual Attribution */}
          <h5 className="blog-form__section-title">Visuals & Attribution</h5>
          <div className="blog-form__group">
            <label>Cover / Featured Image</label>
            <div className="upload-container">
              <input
                id="cover-image"
                type="text"
                placeholder="Direct image URL or upload genuine studio screenshot..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                style={{ marginBottom: 'var(--space-2)' }}
              />
              <div className="upload-box flex-center">
                <FaUpload className="text-accent" style={{ marginRight: 'var(--space-2)' }} />
                <span>{uploading ? 'Uploading Genuine Screenshot...' : 'Upload Screenshot / Diagram'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="upload-input"
                  disabled={uploading}
                />
              </div>
            </div>
            {coverImage && (
              <div className="image-preview" style={{ maxWidth: '350px' }}>
                <img src={coverImage} alt="Cover Preview" />
              </div>
            )}
          </div>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="imageSource">Image Source Attribution *</label>
              <input
                id="imageSource"
                type="text"
                placeholder="e.g. Prema Studio Revit 2024 Working Model, or Official Autodesk Docs"
                value={imageSource}
                onChange={(e) => setImageSource(e.target.value)}
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="imageCaption">Image Caption</label>
              <input
                id="imageCaption"
                type="text"
                placeholder="e.g. Grid alignment and elevation datum setup in Revit project"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </div>
          </div>

          {/* Excerpt and Content */}
          <h5 className="blog-form__section-title">Article Content</h5>
          <div className="blog-form__group">
            <label htmlFor="excerpt">Executive Excerpt * (Max 220 chars)</label>
            <input
              id="excerpt"
              type="text"
              placeholder="Concise summary for feed cards and search results..."
              maxLength={220}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>

          <div className="blog-form__group">
            <label htmlFor="content">Full Article Body * (Practical experience, code/standard citations, steps)</label>
            <textarea
              id="content"
              rows={14}
              placeholder="Write the practical workflow here. Use markdown:&#10;## Step 1: Establish Project Base Point&#10;### Grid Setup Guidelines&#10;**Important note on shared coordinates**&#10;- Bullet step 1&#10;- Bullet step 2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* SEO & Relationships */}
          <h5 className="blog-form__section-title">SEO & Related Information</h5>
          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="tags">Tags (Comma-separated)</label>
              <input
                id="tags"
                type="text"
                placeholder="Revit, Grids, Levels, Coordination"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="canonicalUrl">Canonical URL (Optional)</label>
              <input
                id="canonicalUrl"
                type="text"
                placeholder="https://premadesignstudio.com/blog/..."
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="seoTitle">SEO Title Tag</label>
              <input
                id="seoTitle"
                type="text"
                placeholder="Leave blank to use article title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="metaDescription">Meta Description</label>
              <input
                id="metaDescription"
                type="text"
                placeholder="Leave blank to use excerpt"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="relatedServices">Related Services (Comma-separated)</label>
              <input
                id="relatedServices"
                type="text"
                placeholder="BIM Modeling, Architectural Drafting"
                value={relatedServices}
                onChange={(e) => setRelatedServices(e.target.value)}
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="relatedProjects">Related Verified Projects (Comma-separated)</label>
              <input
                id="relatedProjects"
                type="text"
                placeholder="Residential BIM Coordination Exercise"
                value={relatedProjects}
                onChange={(e) => setRelatedProjects(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-form__actions">
            <Button variant="dark" onClick={handleCancel} disabled={submitting || uploading}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || uploading}>
              <FaCheck /> {submitting ? 'Saving...' : 'Save Article'}
            </Button>
          </div>
        </form>
      ) : (
        /* LIST VIEW */
        <div className="blog-admin-table glass-card">
          <div className="res-header-row">
            <span>Article Title</span>
            <span>Category</span>
            <span>Author</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="res-body">
            {blogs.map((post) => (
              <div key={post._id} className="res-row">
                <div className="res-row__main">
                  <div className="res-row__info">
                    <strong>{post.title}</strong>
                    <span className="file-size">{post.readTime || '5 min read'}</span>
                  </div>
                </div>
                <div className="res-row__cat">
                  <span className="portfolio-card__tag" style={{ margin: 0 }}>
                    {post.category || 'BIM'}
                  </span>
                </div>
                <div className="file-size">
                  {post.author?.name || 'Unassigned'}
                  {post.author?.role && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{post.author.role}</div>}
                </div>
                <div>
                  <span className={`status-badge status-badge--${post.status || 'draft'}`}>
                    {(post.status || 'draft').toUpperCase()}
                  </span>
                </div>
                <div className="action-buttons">
                  <button className="action-btn action-btn--edit" onClick={() => handleEditClick(post)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn action-btn--delete" onClick={() => handleDelete(post._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="text-center" style={{ padding: 'var(--space-12) var(--space-4)' }}>
                <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                  No articles currently in the database. All generic AI articles have been purged.
                </p>
                <Button variant="outline" onClick={handleCreateClick}>
                  <FaPlus /> Draft First Technical Article
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlog;
