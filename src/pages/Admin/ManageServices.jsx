import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManageServices.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null); // null means list view, object means form view (new or edit)
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('FaCube');
  const [features, setFeatures] = useState(''); // Text area split by new line
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (error) {
      console.error('Error loading services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    setEditingService(service);
    setTitle(service.title);
    setShortDescription(service.shortDescription || '');
    setDescription(service.description || '');
    setIcon(service.icon || 'FaCube');
    setFeatures(service.features ? service.features.join('\n') : '');
    setIsActive(service.isActive);
    setOrder(service.order || 0);
  };

  const handleCreateClick = () => {
    setEditingService({ _id: 'new' }); // Temporary ID for form tracking
    setTitle('');
    setShortDescription('');
    setDescription('');
    setIcon('FaCube');
    setFeatures('');
    setIsActive(true);
    setOrder(services.length + 1);
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) {
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error('Error deleting service', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const featureList = features
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      title,
      shortDescription,
      description,
      icon,
      features: featureList,
      isActive,
      order,
    };

    try {
      if (editingService._id === 'new') {
        // Create new
        const res = await api.post('/services', payload);
        if (res.data.success) {
          setServices([...services, res.data.data].sort((a, b) => a.order - b.order));
          setEditingService(null);
        }
      } else {
        // Edit existing
        const res = await api.put(`/services/${editingService._id}`, payload);
        if (res.data.success) {
          setServices(
            services
              .map((s) => (s._id === editingService._id ? res.data.data : s))
              .sort((a, b) => a.order - b.order)
          );
          setEditingService(null);
        }
      }
    } catch (error) {
      console.error('Error saving service', error);
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
    <div className="manage-services">
      <div className="manage-services__header flex-between">
        <div>
          <h3>Manage Website Services</h3>
          <p>Configure the services rendered by the firm on the public pages.</p>
        </div>
        {!editingService && (
          <Button variant="primary" onClick={handleCreateClick}>
            <FaPlus /> Add New Service
          </Button>
        )}
      </div>

      {editingService ? (
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="services-form glass-card">
          <h4>{editingService._id === 'new' ? 'Add New Service' : 'Edit Service'}</h4>

          <div className="services-form__row">
            <div className="services-form__group">
              <label htmlFor="title">Service Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="services-form__group">
              <label htmlFor="icon">React Icon Identifier (e.g. FaBuilding, FaImage) *</label>
              <input
                id="icon"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="services-form__row">
            <div className="services-form__group">
              <label htmlFor="order">Display Order</label>
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="services-form__group flex-center" style={{ gap: 'var(--space-2)' }}>
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="isActive" style={{ cursor: 'pointer', margin: 0 }}>Active / Show on public page</label>
            </div>
          </div>

          <div className="services-form__group">
            <label htmlFor="shortDescription">Card Short Description * (Max 150 chars)</label>
            <input
              id="shortDescription"
              type="text"
              maxLength={150}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
            />
          </div>

          <div className="services-form__group">
            <label htmlFor="description">Full Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="services-form__group">
            <label htmlFor="features">Bullet Point Features (One per line) *</label>
            <textarea
              id="features"
              rows={5}
              placeholder="Example:&#10;Floor Plans & Site Plans&#10;Sections & Elevations&#10;Construction Details"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
            />
          </div>

          <div className="services-form__actions">
            <Button variant="dark" onClick={handleCancel} disabled={submitting}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              <FaCheck /> {submitting ? 'Saving...' : 'Save Service'}
            </Button>
          </div>
        </form>
      ) : (
        /* LIST VIEW */
        <div className="services-list-grid">
          {services.map((service) => (
            <div key={service._id} className="service-admin-card glass-card">
              <div className="service-admin-card__header flex-between">
                <h5>{service.title}</h5>
                <span className={`status-badge ${service.isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="service-admin-card__desc">{service.shortDescription}</p>
              <div className="service-admin-card__footer flex-between">
                <span className="order-tag">Order: {service.order}</span>
                <div className="action-buttons">
                  <button className="action-btn action-btn--edit" onClick={() => handleEditClick(service)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn action-btn--delete" onClick={() => handleDelete(service._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-muted text-center" style={{ gridColumn: '1 / -1', padding: 'var(--space-10)' }}>
              No services found. Click "Add New Service" to start.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
