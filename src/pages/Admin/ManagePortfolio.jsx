import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload } from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManagePortfolio.css';

const categories = [
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'school', label: 'School' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'interior', label: 'Interior' },
  { key: 'student-projects', label: 'Student Projects' },
];

const ManagePortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null); // null = list, object = form
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('residential');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [software, setSoftware] = useState(''); // comma separated
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');
  const [featured, setFeatured] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects?status=all');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (error) {
      console.error('Error loading projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description || '');
    setClient(project.client || '');
    setLocation(project.location || '');
    setArea(project.area || '');
    setSoftware(project.software ? project.software.join(', ') : '');
    setImageUrl(project.thumbnail?.url || '');
    setStatus(project.status || 'published');
    setFeatured(project.featured || false);
  };

  const handleCreateClick = () => {
    setEditingProject({ _id: 'new' });
    setTitle('');
    setCategory('residential');
    setDescription('');
    setClient('');
    setLocation('');
    setArea('');
    setSoftware('');
    setImageUrl('');
    setStatus('published');
    setFeatured(false);
  };

  const handleCancel = () => {
    setEditingProject(null);
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
        // Build absolute/relative URL pointing to the node server port
        const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        setImageUrl(serverBaseUrl + res.data.data.url);
      }
    } catch (error) {
      console.error('File upload failed', error);
      alert('Upload failed. Check file type and sizes.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const swList = software
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title,
      category,
      description,
      client,
      location,
      area,
      software: swList,
      thumbnail: { url: imageUrl },
      images: imageUrl ? [{ url: imageUrl, caption: title }] : [],
      status,
      featured,
    };

    try {
      if (editingProject._id === 'new') {
        const res = await api.post('/projects', payload);
        if (res.data.success) {
          setProjects([res.data.data, ...projects]);
          setEditingProject(null);
        }
      } else {
        const res = await api.put(`/projects/${editingProject._id}`, payload);
        if (res.data.success) {
          setProjects(projects.map((p) => (p._id === editingProject._id ? res.data.data : p)));
          setEditingProject(null);
        }
      }
    } catch (error) {
      console.error('Error saving project', error);
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
    <div className="manage-portfolio">
      <div className="manage-portfolio__header flex-between">
        <div>
          <h3>Manage Project Portfolio</h3>
          <p>Create, update, or remove portfolio items showcased to incoming clients.</p>
        </div>
        {!editingProject && (
          <Button variant="primary" onClick={handleCreateClick}>
            <FaPlus /> Add New Project
          </Button>
        )}
      </div>

      {editingProject ? (
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="project-form glass-card animate-scale-in">
          <h4>{editingProject._id === 'new' ? 'Create New Project' : 'Edit Project Details'}</h4>

          <div className="project-form__row">
            <div className="project-form__group">
              <label htmlFor="title">Project Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="project-form__group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="project-form__row">
            <div className="project-form__group">
              <label htmlFor="client">Client Name</label>
              <input
                id="client"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="project-form__group">
              <label htmlFor="location">Location (e.g. Pune, India)</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="project-form__row">
            <div className="project-form__group">
              <label htmlFor="area">Built-up Area (e.g. 3,200 sq ft)</label>
              <input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="project-form__group">
              <label htmlFor="software">Software Used (Comma separated)</label>
              <input
                id="software"
                type="text"
                placeholder="Revit, 3ds Max, V-Ray"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
              />
            </div>
          </div>

          <div className="project-form__row">
            <div className="project-form__group">
              <label htmlFor="status">Publish Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Visible)</option>
              </select>
            </div>
            <div className="project-form__group flex-center" style={{ gap: 'var(--space-2)' }}>
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="featured" style={{ cursor: 'pointer', margin: 0 }}>Pin to Homepage Featured</label>
            </div>
          </div>

          <div className="project-form__group">
            <label>Project Cover Image *</label>
            <div className="upload-container">
              <input
                id="image-url"
                type="text"
                placeholder="Image path or external url..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                style={{ marginBottom: 'var(--space-2)' }}
              />
              <div className="upload-box flex-center">
                <FaUpload className="text-accent" style={{ marginRight: 'var(--space-2)' }} />
                <span>{uploading ? 'Uploading File...' : 'Choose drawing/render to upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="upload-input"
                  disabled={uploading}
                />
              </div>
            </div>
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Uploaded preview" />
              </div>
            )}
          </div>

          <div className="project-form__group">
            <label htmlFor="description">Full Case Study Description</label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="project-form__actions">
            <Button variant="dark" onClick={handleCancel} disabled={submitting}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              <FaCheck /> {submitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      ) : (
        /* LIST VIEW */
        <div className="project-admin-table glass-card">
          <div className="table-header-row">
            <span>Project</span>
            <span>Category</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="table-body">
            {projects.map((project) => (
              <div key={project._id} className="table-row">
                <div className="table-row__main">
                  <img
                    src={project.thumbnail?.url || 'https://placehold.co/80x50/333/fff?text=No+Image'}
                    alt={project.title}
                    className="table-row__img"
                  />
                  <div className="table-row__details">
                    <strong>{project.title}</strong>
                    {project.featured && <span className="featured-tag">Featured</span>}
                  </div>
                </div>
                <span className="table-row__cat">{project.category}</span>
                <span className={`status-badge ${project.status === 'published' ? 'status-badge--active' : 'status-badge--inactive'}`}>
                  {project.status}
                </span>
                <div className="action-buttons">
                  <button className="action-btn action-btn--edit" onClick={() => handleEditClick(project)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn action-btn--delete" onClick={() => handleDelete(project._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-muted text-center" style={{ padding: 'var(--space-10)' }}>
                No projects created yet. Click "Add New Project" to start.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
