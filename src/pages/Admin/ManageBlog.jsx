import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload } from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManageBlog.css';

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
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState(''); // Comma separated
  const [status, setStatus] = useState('published');
  const [readTime, setReadTime] = useState('5 min read');

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
    setTitle(post.title);
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setCoverImage(post.coverImage || '');
    setTags(post.tags ? post.tags.join(', ') : '');
    setStatus(post.status || 'published');
    setReadTime(post.readTime || '5 min read');
  };

  const handleCreateClick = () => {
    setEditingBlog({ _id: 'new' });
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setTags('');
    setStatus('published');
    setReadTime('5 min read');
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
        const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        setCoverImage(serverBaseUrl + res.data.data.url);
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

    const payload = {
      title,
      excerpt,
      content,
      coverImage,
      tags: tagsList,
      status,
      readTime,
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
          <h3>Manage Blog Insights</h3>
          <p>Compose and update articles visible on the public news feed.</p>
        </div>
        {!editingBlog && (
          <Button variant="primary" onClick={handleCreateClick}>
            <FaPlus /> Write New Post
          </Button>
        )}
      </div>

      {editingBlog ? (
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="blog-form glass-card animate-scale-in">
          <h4>{editingBlog._id === 'new' ? 'Compose Blog Post' : 'Edit Blog Post'}</h4>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="title">Blog Post Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Master Revit Families: A Complete Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="blog-form__group">
              <label htmlFor="readTime">Estimated Read Time *</label>
              <input
                id="readTime"
                type="text"
                placeholder="e.g. 5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="blog-form__row">
            <div className="blog-form__group">
              <label htmlFor="status">Publish Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="published">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <div className="blog-form__group">
              <label htmlFor="tags">Tags (Comma separated)</label>
              <input
                id="tags"
                type="text"
                placeholder="Revit, BIM, Training"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-form__group">
            <label>Cover Image Header</label>
            <div className="upload-container">
              <input
                id="cover-image"
                type="text"
                placeholder="Image file path or external url..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                style={{ marginBottom: 'var(--space-2)' }}
              />
              <div className="upload-box flex-center">
                <FaUpload className="text-accent" style={{ marginRight: 'var(--space-2)' }} />
                <span>{uploading ? 'Uploading Header Image...' : 'Click to select cover file'}</span>
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

          <div className="blog-form__group">
            <label htmlFor="excerpt">Excerpt Summary * (Max 200 chars)</label>
            <input
              id="excerpt"
              type="text"
              placeholder="Short summary preview for feed catalog cards..."
              maxLength={200}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>

          <div className="blog-form__group">
            <label htmlFor="content">Post Content * (Supports rich headers and lists)</label>
            <textarea
              id="content"
              rows={12}
              placeholder="Write your article here. You can use markdown shortcuts:&#10;## Heading 2&#10;### Heading 3&#10;**bold text**&#10;- bullet items&#10;--- for dividing lines"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="blog-form__actions">
            <Button variant="dark" onClick={handleCancel} disabled={submitting || uploading}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || uploading}>
              <FaCheck /> {submitting ? 'Saving...' : 'Save & Publish'}
            </Button>
          </div>
        </form>
      ) : (
        /* LIST VIEW */
        <div className="blog-admin-table glass-card">
          <div className="res-header-row">
            <span>Article Title</span>
            <span>Tags</span>
            <span>Date Published</span>
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
                <div className="res-row__cat" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {post.tags?.map((t, idx) => (
                    <span key={idx} className="portfolio-card__tag" style={{ margin: 0 }}>{t}</span>
                  ))}
                </div>
                <span className="file-size">{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className={`status-badge ${post.status === 'published' ? 'status-badge--active' : 'status-badge--inactive'}`}>
                  {post.status}
                </span>
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
              <p className="text-muted text-center" style={{ padding: 'var(--space-10)' }}>
                No blog posts created yet. Click "Write New Post" to publish your first article.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlog;
