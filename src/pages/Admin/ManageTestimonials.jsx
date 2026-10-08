import { useState, useEffect } from 'react';
import {
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaStar,
  FaBuilding,
  FaGraduationCap,
  FaSearch,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import api from '../../shared/lib/api';
import Button from '../../shared/components/Button/Button';
import './ManageTestimonials.css';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusTab, setStatusTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'client', 'student'
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    course: '',
    projectType: '',
    rating: 5,
    testimonial: '',
    featured: false,
    consentToPublish: true,
  });
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusTab !== 'all') params.append('status', statusTab);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/testimonials/admin?${params.toString()}`);
      if (res.data.success) {
        setTestimonials(res.data.data.testimonials || []);
        if (res.data.data.counts) {
          setCounts(res.data.data.counts);
        }
      }
    } catch (err) {
      console.error('Error fetching admin testimonials:', err);
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusTab, categoryFilter, ratingFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTestimonials();
  };

  const handleStatusChange = async (id, newStatus, hasConsent) => {
    if (newStatus === 'approved' && !hasConsent) {
      showToast('Cannot approve: Submitter did not give consent to publish.', 'error');
      return;
    }

    try {
      const res = await api.patch(`/testimonials/${id}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Testimonial marked as ${newStatus}`, 'success');
        fetchTestimonials();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Status update failed';
      showToast(msg, 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      company: item.company || '',
      course: item.course || '',
      projectType: item.projectType || '',
      rating: item.rating || 5,
      testimonial: item.testimonial || '',
      featured: Boolean(item.featured),
      consentToPublish: Boolean(item.consentToPublish),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setUpdating(true);
    try {
      const res = await api.put(`/testimonials/${editingItem._id}`, editForm);
      if (res.data.success) {
        showToast('Testimonial updated successfully', 'success');
        setEditingItem(null);
        fetchTestimonials();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await api.delete(`/testimonials/${deletingId}`);
      if (res.data.success) {
        showToast('Testimonial deleted successfully', 'success');
        setDeletingId(null);
        fetchTestimonials();
      }
    } catch (err) {
      showToast('Failed to delete testimonial', 'error');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`admin-star ${i <= rating ? 'admin-star--active' : 'admin-star--inactive'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="manage-testimonials">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="manage-header">
        <div>
          <h2>Client &amp; Student Feedback</h2>
          <p className="manage-header__subtitle">
            Review, verify, edit, and moderate client service reviews and student academy testimonials.
          </p>
        </div>
      </div>

      {/* Summary Stat Counters */}
      <div className="manage-stats-grid">
        <div className="stat-card" onClick={() => setStatusTab('all')}>
          <span className="stat-card__number">{counts.total}</span>
          <span className="stat-card__label">Total Submissions</span>
        </div>
        <div
          className={`stat-card stat-card--pending ${statusTab === 'pending' ? 'stat-card--active' : ''}`}
          onClick={() => setStatusTab('pending')}
        >
          <span className="stat-card__number">{counts.pending}</span>
          <span className="stat-card__label">Pending Review</span>
        </div>
        <div
          className={`stat-card stat-card--approved ${statusTab === 'approved' ? 'stat-card--active' : ''}`}
          onClick={() => setStatusTab('approved')}
        >
          <span className="stat-card__number">{counts.approved}</span>
          <span className="stat-card__label">Approved &amp; Live</span>
        </div>
        <div
          className={`stat-card stat-card--rejected ${statusTab === 'rejected' ? 'stat-card--active' : ''}`}
          onClick={() => setStatusTab('rejected')}
        >
          <span className="stat-card__number">{counts.rejected}</span>
          <span className="stat-card__label">Rejected</span>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="manage-filters-row">
        <div className="status-tabs">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`status-tab ${statusTab === tab ? 'status-tab--active' : ''}`}
              onClick={() => setStatusTab(tab)}
            >
              {tab.toUpperCase()}
              {tab === 'pending' && counts.pending > 0 && (
                <span className="pending-badge">{counts.pending}</span>
              )}
            </button>
          ))}
        </div>

        <div className="filters-dropdowns">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Categories</option>
            <option value="client">Client Reviews</option>
            <option value="student">Student Reviews</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="admin-search-form">
            <input
              type="text"
              placeholder="Search name, text, firm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            <button type="submit" className="admin-search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="admin-loading">Loading feedback submissions...</div>
      ) : testimonials.length === 0 ? (
        <div className="admin-empty-box glass-card">
          <h4>No testimonials found matching current filters</h4>
          <p>
            When clients or students submit feedback via <code>/feedback/client</code> or <code>/feedback/student</code>,
            they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="admin-testimonials-list">
          {testimonials.map((item) => {
            const isClient = item.category === 'client';
            const hasConsent = Boolean(item.consentToPublish);
            const dateStr = item.createdAt || item.submittedAt
              ? new Date(item.createdAt || item.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '';

            return (
              <div key={item._id} className={`admin-item-card status-border--${item.status}`}>
                <div className="admin-item-card__header">
                  <div className="admin-item-card__user">
                    {item.photo?.url ? (
                      <img src={item.photo.url} alt={item.name} className="admin-avatar-img" />
                    ) : (
                      <div className="admin-avatar-initials">{item.name?.charAt(0) || 'P'}</div>
                    )}
                    <div>
                      <h4 className="admin-item-card__name">{item.name}</h4>
                      <div className="admin-item-card__submeta">
                        <span className={`category-tag category-tag--${item.category}`}>
                          {isClient ? <FaBuilding /> : <FaGraduationCap />}
                          {isClient ? 'Client' : 'Student'}
                        </span>
                        <span className="admin-item-card__context">
                          {isClient
                            ? item.company
                              ? `${item.company} · ${item.projectType || 'Project'}`
                              : item.projectType || 'Project'
                            : `${item.course || 'Training'}${item.batchYear ? ` · ${item.batchYear}` : ''}`}
                        </span>
                        {item.email && (
                          <span className="admin-item-card__email">✉ {item.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-item-card__status-wrap">
                    <span className="admin-item-card__date">{dateStr}</span>
                    <span className={`status-pill status-pill--${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                    {hasConsent ? (
                      <span className="consent-badge consent-badge--yes" title="Permission granted to publish">
                        ✓ Consented
                      </span>
                    ) : (
                      <span className="consent-badge consent-badge--no" title="Permission NOT granted — internal only!">
                        ⚠ No Consent (Internal Only)
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Recommendation */}
                <div className="admin-item-card__rating-row">
                  <div className="admin-stars-box">{renderStars(item.rating || 5)}</div>
                  {item.recommendation && (
                    <span className="admin-recommendation-badge">
                      Recommends: <strong>{item.recommendation}</strong>
                    </span>
                  )}
                  {item.featured && (
                    <span className="featured-pill">★ Featured on Homepage</span>
                  )}
                </div>

                {/* Testimonial Quote */}
                <div className="admin-item-card__quote">
                  <p>&ldquo;{item.testimonial}&rdquo;</p>
                </div>

                {/* Extra Student Details */}
                {(item.learnedSkills || item.practicalSkillImprovement) && (
                  <div className="admin-item-card__student-extras">
                    {item.learnedSkills && (
                      <div>
                        <span className="extra-label">Learned Skills:</span> {item.learnedSkills}
                      </div>
                    )}
                    {item.practicalSkillImprovement && (
                      <div>
                        <span className="extra-label">Practical Impact:</span> {item.practicalSkillImprovement}
                      </div>
                    )}
                  </div>
                )}

                {/* Private Improvement Feedback (Internal Only) */}
                {item.improvementFeedback && (
                  <div className="admin-item-card__private-feedback">
                    <div className="private-feedback__title">
                      <FaShieldAlt /> 🔒 Private Internal Improvement Feedback (Never Published):
                    </div>
                    <p>{item.improvementFeedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="admin-item-card__actions">
                  <div className="status-action-btns">
                    {item.status !== 'approved' && (
                      <button
                        type="button"
                        className={`action-btn action-btn--approve ${!hasConsent ? 'action-btn--disabled' : ''}`}
                        onClick={() => handleStatusChange(item._id, 'approved', hasConsent)}
                        title={hasConsent ? 'Approve for public display' : 'Cannot approve: User did not give consent to publish'}
                      >
                        <FaCheck /> Approve
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        type="button"
                        className="action-btn action-btn--reject"
                        onClick={() => handleStatusChange(item._id, 'rejected', hasConsent)}
                      >
                        <FaTimes /> Reject
                      </button>
                    )}
                  </div>

                  <div className="manage-action-btns">
                    <button
                      type="button"
                      className="action-icon-btn action-icon-btn--edit"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Testimonial"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn action-icon-btn--delete"
                      onClick={() => setDeletingId(item._id)}
                      title="Delete Testimonial"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card glass-card">
            <div className="admin-modal-header">
              <h3>Edit Testimonial</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingItem(null)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="admin-modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="admin-input"
                />
              </div>

              {editingItem.category === 'client' ? (
                <>
                  <div className="form-group">
                    <label>Company / Organization</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Type</label>
                    <input
                      type="text"
                      value={editForm.projectType}
                      onChange={(e) => setEditForm((p) => ({ ...p, projectType: e.target.value }))}
                      className="admin-input"
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    value={editForm.course}
                    onChange={(e) => setEditForm((p) => ({ ...p, course: e.target.value }))}
                    className="admin-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rating (1–5)</label>
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                  className="admin-select"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div className="form-group">
                <label>Testimonial Text *</label>
                <textarea
                  rows={5}
                  value={editForm.testimonial}
                  onChange={(e) => setEditForm((p) => ({ ...p, testimonial: e.target.value }))}
                  required
                  className="admin-textarea"
                />
              </div>

              <div className="form-group-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm((p) => ({ ...p, featured: e.target.checked }))}
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className={`checkbox-label ${!editingItem?.consentToPublish ? 'checkbox-label--disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={editForm.consentToPublish}
                    disabled={!editingItem?.consentToPublish}
                    onChange={(e) => setEditForm((p) => ({ ...p, consentToPublish: e.target.checked }))}
                  />
                  <span>
                    Consent to Publish Granted
                    {!editingItem?.consentToPublish && (
                      <small style={{ display: 'block', color: 'var(--color-error, #E57373)', fontSize: '0.75rem' }}>
                        (Withheld by submitter upon submission — cannot be granted by admin)
                      </small>
                    )}
                  </span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card admin-modal-card--danger glass-card">
            <div className="admin-modal-header">
              <h3>Confirm Deletion</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setDeletingId(null)}
              >
                &times;
              </button>
            </div>
            <p style={{ margin: 'var(--space-4) 0 var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
              Are you sure you want to permanently delete this testimonial submission? This action cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <Button variant="outline" size="md" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <button
                type="button"
                className="action-btn action-btn--danger-delete"
                onClick={confirmDelete}
              >
                Yes, Delete Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
