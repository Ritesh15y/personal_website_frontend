import { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaCheck } from 'react-icons/fa';
import api from '../../shared/lib/api';
import './ViewInquiries.css';

const ViewInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      if (res.data.success) {
        setInquiries(res.data.data);
        if (res.data.data.length > 0) {
          // Set first inquiry as selected by default
          setSelectedInquiry(res.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/inquiries/${id}/read`);
      if (res.data.success) {
        // Update list
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
        );
        // Update currently selected if matches
        if (selectedInquiry?._id === id) {
          setSelectedInquiry((prev) => ({ ...prev, isRead: true }));
        }
      }
    } catch (error) {
      console.error('Error marking read', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await api.delete(`/inquiries/${id}`);
      if (res.data.success) {
        const updated = inquiries.filter((item) => item._id !== id);
        setInquiries(updated);
        // Reset selected
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(updated.length > 0 ? updated[0] : null);
        }
      }
    } catch (error) {
      console.error('Error deleting inquiry', error);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'read') return item.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="admin-inquiries">
      <div className="admin-inquiries__header flex-between">
        <div>
          <h3>Client & Student Enquiries</h3>
          <p>Read and respond to queries received from the website contact form.</p>
        </div>
        <div className="inquiry-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({inquiries.filter((i) => !i.isRead).length})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="inquiries-empty glass-card">
          <FaEnvelope size={48} className="text-muted" style={{ marginBottom: 'var(--space-4)' }} />
          <h4>No Enquiries Found</h4>
          <p>When users send messages, they will show up here.</p>
        </div>
      ) : (
        <div className="inquiries-wrapper">
          {/* List Pane */}
          <div className="inquiries-list glass-card">
            {filteredInquiries.map((item) => (
              <div
                key={item._id}
                className={`inquiry-item ${!item.isRead ? 'inquiry-item--unread' : ''} ${
                  selectedInquiry?._id === item._id ? 'inquiry-item--selected' : ''
                }`}
                onClick={() => {
                  setSelectedInquiry(item);
                  if (!item.isRead) {
                    handleMarkAsRead(item._id);
                  }
                }}
              >
                <div className="inquiry-item__meta flex-between">
                  <span className="inquiry-item__name">{item.name}</span>
                  <span className="inquiry-item__date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="inquiry-item__subject">{item.subject || 'No Subject'}</div>
                <div className="inquiry-item__type-badge">{item.type}</div>
              </div>
            ))}
            {filteredInquiries.length === 0 && (
              <p className="text-muted text-center" style={{ padding: 'var(--space-6)' }}>
                No messages match the filter.
              </p>
            )}
          </div>

          {/* Reader Pane */}
          {selectedInquiry ? (
            <div className="inquiry-reader glass-card">
              <div className="inquiry-reader__header flex-between">
                <div>
                  <h4>{selectedInquiry.subject || 'No Subject'}</h4>
                  <div className="inquiry-reader__sender-info">
                    From: <strong>{selectedInquiry.name}</strong> ({selectedInquiry.email})
                    {selectedInquiry.phone && <span> | Phone: {selectedInquiry.phone}</span>}
                  </div>
                  <span className="inquiry-reader__type">Type: {selectedInquiry.type}</span>
                </div>
                <div className="inquiry-reader__actions">
                  {!selectedInquiry.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedInquiry._id)}
                      className="reader-action-btn"
                      title="Mark as Read"
                    >
                      <FaCheck /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedInquiry._id)}
                    className="reader-action-btn reader-action-btn--delete"
                    title="Delete Message"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="inquiry-reader__body">
                <p>{selectedInquiry.message}</p>
              </div>

              <div className="inquiry-reader__footer">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=RE: ${encodeURIComponent(
                    selectedInquiry.subject || 'Your Enquiry to Prema Design Studio'
                  )}`}
                  className="btn btn--primary"
                >
                  <FaReply /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="inquiry-reader glass-card flex-center">
              <p className="text-muted">Select an enquiry to read details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewInquiries;
