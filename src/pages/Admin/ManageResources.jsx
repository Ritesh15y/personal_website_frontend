import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload, FaFileAlt } from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManageResources.css';

const categories = [
  { key: 'autocad', label: 'AutoCAD' },
  { key: 'revit', label: 'Revit' },
  { key: 'sketchup', label: 'SketchUp' },
  { key: '3dsmax', label: '3ds Max' },
  { key: 'vray', label: 'V-Ray' },
  { key: 'general', label: 'General' },
];

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState(null); // null = list, object = form
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('autocad');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [status, setStatus] = useState('published');

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources?status=all');
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (error) {
      console.error('Error loading resources', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setCategory(resource.category);
    setDescription(resource.description || '');
    setFileUrl(resource.fileUrl);
    setFileName(resource.fileName);
    setFileType(resource.fileType || '');
    setFileSize(resource.fileSize || 0);
    setStatus(resource.status || 'published');
  };

  const handleCreateClick = () => {
    setEditingResource({ _id: 'new' });
    setTitle('');
    setCategory('autocad');
    setDescription('');
    setFileUrl('');
    setFileName('');
    setFileType('');
    setFileSize(0);
    setStatus('published');
  };

  const handleCancel = () => {
    setEditingResource(null);
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
        setFileUrl(res.data.data.url);
        setFileName(res.data.data.fileName);
        setFileType(res.data.data.fileType);
        setFileSize(res.data.data.fileSize);
        if (!title) {
          // Pre-populate title with clean filename if empty
          setTitle(res.data.data.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '));
        }
      }
    } catch (error) {
      console.error('File upload failed', error);
      alert('Upload failed. Check file formats (allowed: .dwg, .rvt, .rfa, .skp, .max, .pdf, .zip).');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource? This will remove the drawing file from the server.')) return;
    try {
      const res = await api.delete(`/resources/${id}`);
      if (res.data.success) {
        setResources(resources.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error('Error deleting resource', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      category,
      description,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      status,
    };

    try {
      if (editingResource._id === 'new') {
        const res = await api.post('/resources', payload);
        if (res.data.success) {
          setResources([res.data.data, ...resources]);
          setEditingResource(null);
        }
      } else {
        const res = await api.put(`/resources/${editingResource._id}`, payload);
        if (res.data.success) {
          setResources(resources.map((r) => (r._id === editingResource._id ? res.data.data : r)));
          setEditingResource(null);
        }
      }
    } catch (error) {
      console.error('Error saving resource', error);
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
    <div className="manage-resources">
      <div className="manage-resources__header flex-between">
        <div>
          <h3>Manage Practice Resources</h3>
          <p>Upload files (e.g. AutoCAD drawings, Revit templates) for students to download.</p>
        </div>
        {!editingResource && (
          <Button variant="primary" onClick={handleCreateClick}>
            <FaPlus /> Add New Resource
          </Button>
        )}
      </div>

      {editingResource ? (
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="resource-form glass-card animate-scale-in">
          <h4>{editingResource._id === 'new' ? 'Upload New Resource' : 'Edit Resource Metadata'}</h4>

          <div className="resource-form__group">
            <label>Drawing/Asset File *</label>
            <div className="upload-container">
              <div className="upload-box flex-center">
                <FaUpload className="text-accent" style={{ marginRight: 'var(--space-2)' }} />
                <span>
                  {uploading
                    ? 'Uploading file to server...'
                    : fileName
                    ? `Selected: ${fileName} (${formatBytes(fileSize)})`
                    : 'Click to select drawing file (.dwg, .rvt, .skp, .pdf, .zip)'}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="upload-input"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>

          <div className="resource-form__row">
            <div className="resource-form__group">
              <label htmlFor="title">Resource Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. 2BHK Layout Blueprint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="resource-form__group">
              <label htmlFor="category">Software Category *</label>
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

          <div className="resource-form__row">
            <div className="resource-form__group">
              <label htmlFor="status">Availability Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="published">Active (Visible to users)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <div className="resource-form__group">
              <label>File URL (populated on upload)</label>
              <input
                type="text"
                value={fileUrl}
                readOnly
                placeholder="File path will appear here..."
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}
              />
            </div>
          </div>

          <div className="resource-form__group">
            <label htmlFor="description">Resource Description</label>
            <textarea
              id="description"
              rows={4}
              placeholder="Brief description about the file, software version required, and topics covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="resource-form__actions">
            <Button variant="dark" onClick={handleCancel} disabled={submitting || uploading}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || uploading || !fileUrl}>
              <FaCheck /> {submitting ? 'Saving...' : 'Save & Publish'}
            </Button>
          </div>
        </form>
      ) : (
        /* LIST VIEW */
        <div className="resources-admin-table glass-card">
          <div className="res-header-row">
            <span>Resource Info</span>
            <span>Category</span>
            <span>File Details</span>
            <span>Downloads</span>
            <span>Actions</span>
          </div>
          <div className="res-body">
            {resources.map((res) => (
              <div key={res._id} className="res-row">
                <div className="res-row__main">
                  <FaFileAlt className="res-row__icon text-accent" />
                  <div className="res-row__info">
                    <strong>{res.title}</strong>
                    <span className={`status-badge ${res.status === 'published' ? 'status-badge--active' : 'status-badge--inactive'}`}>
                      {res.status}
                    </span>
                  </div>
                </div>
                <span className="res-row__cat">{res.category}</span>
                <div className="res-row__meta">
                  <span className="file-ext">{res.fileType || '.dwg'}</span>
                  <span className="file-size">{formatBytes(res.fileSize)}</span>
                </div>
                <span className="res-row__downloads">{res.downloadCount || 0}</span>
                <div className="action-buttons">
                  <button className="action-btn action-btn--edit" onClick={() => handleEditClick(res)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn action-btn--delete" onClick={() => handleDelete(res._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
            {resources.length === 0 && (
              <p className="text-muted text-center" style={{ padding: 'var(--space-10)' }}>
                No resources found. Click "Add New Resource" to upload your first drawing file.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageResources;
