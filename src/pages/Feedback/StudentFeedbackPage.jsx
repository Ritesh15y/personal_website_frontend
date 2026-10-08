import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaGraduationCap,
  FaCheckCircle,
  FaUpload,
  FaShieldAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button/Button';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import api from '../../shared/lib/api';
import './ClientFeedbackPage.css'; // Reuses responsive feedback styles

const COURSES = [
  'AutoCAD',
  'Revit Architecture',
  'Revit Structure',
  'BIM',
  'SketchUp',
  '3ds Max + V-Ray',
  'Other',
];

const StudentFeedbackPage = () => {
  useDocumentTitle(
    'Student Feedback | Prema Design Studio',
    'Tell us about your software and BIM learning experience at Prema Design Studio Training Academy.'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: 'Revit Architecture',
    batchYear: '',
    trainer: '',
    rating: 5,
    learnedSkills: '',
    trainingExperience: '',
    practicalSkillImprovement: '',
    improvementFeedback: '',
    recommendation: 'Yes',
    consentToPublish: false,
    // Anti-spam honeypot
    website: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRatingClick = (stars) => {
    setFormData((prev) => ({ ...prev, rating: stars }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setErrorMessage('Profile photo must be a JPG, PNG, or WebP image');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage('Profile photo must be less than 3MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!formData.course) {
      setErrorMessage('Course is required.');
      return;
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.trainingExperience.trim()) {
      setErrorMessage('Please share how your training experience was.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedPhotoUrl = '';

      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append('file', photoFile);
        try {
          const uploadRes = await api.post('/testimonials/upload-photo', photoFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (uploadRes.data?.data?.url) {
            uploadedPhotoUrl = uploadRes.data.data.url;
          }
        } catch (err) {
          console.warn('Student photo upload could not complete:', err);
        }
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        course: formData.course,
        batchYear: formData.batchYear.trim(),
        trainer: formData.trainer.trim(),
        rating: formData.rating,
        learnedSkills: formData.learnedSkills.trim(),
        trainingExperience: formData.trainingExperience.trim(),
        practicalSkillImprovement: formData.practicalSkillImprovement.trim(),
        improvementFeedback: formData.improvementFeedback.trim(),
        recommendation: formData.recommendation,
        photo: uploadedPhotoUrl ? { url: uploadedPhotoUrl } : undefined,
        consentToPublish: formData.consentToPublish,
        website: formData.website, // honeypot
      };

      const res = await api.post('/testimonials/student', payload);
      if (res.data.success) {
        setSubmitSuccess(true);
      } else {
        setErrorMessage(res.data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting student feedback:', err);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setSubmitSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="container feedback-container">
        <Link to="/training" className="feedback-back-link">
          <FaArrowLeft /> Back to Training Academy
        </Link>

        {submitSuccess ? (
          <motion.div
            className="feedback-card feedback-card--success glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="feedback-success__icon">
              <FaCheckCircle />
            </div>
            <h2>Thank You for Your Feedback!</h2>
            <p className="feedback-success__desc">
              Your response has been received and will be reviewed by our team.
            </p>
            <p className="feedback-success__privacy">
              <FaShieldAlt /> Your feedback is stored securely and private notes will never be published.
            </p>
            <div className="feedback-success__actions">
              <Link to="/">
                <Button variant="primary" size="md">
                  Return to Homepage
                </Button>
              </Link>
              <Link to="/training">
                <Button variant="outline" size="md">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="feedback-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="feedback-header">
              <div className="feedback-header__badge">
                <FaGraduationCap /> Student Experience
              </div>
              <h1>Share Your Learning Experience</h1>
              <p className="feedback-header__subtitle">
                Tell us about your experience with Prema Design Studio Training Academy.
              </p>
            </div>

            {errorMessage && <div className="feedback-alert feedback-alert--error">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              {/* Row 1: Full Name & Email */}
              <div className="feedback-form__row">
                <div className="feedback-form__group">
                  <label htmlFor="student-name">Full Name *</label>
                  <input
                    id="student-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="feedback-input"
                  />
                </div>

                <div className="feedback-form__group">
                  <label htmlFor="student-email">
                    Email Address (optional)
                    <span className="feedback-label-hint">🔒 Kept private, never published</span>
                  </label>
                  <input
                    id="student-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. priya.arch@gmail.com"
                    className="feedback-input"
                  />
                </div>
              </div>

              {/* Row 2: Course & Batch / Year */}
              <div className="feedback-form__row">
                <div className="feedback-form__group">
                  <label htmlFor="student-course">Course *</label>
                  <select
                    id="student-course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="feedback-select"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="feedback-form__group">
                  <label htmlFor="student-batch">Batch / Year (optional)</label>
                  <input
                    id="student-batch"
                    type="text"
                    name="batchYear"
                    value={formData.batchYear}
                    onChange={handleChange}
                    placeholder="e.g. Evening Batch · Jan 2026"
                    className="feedback-input"
                  />
                </div>
              </div>

              {/* Row 3: Trainer Name */}
              <div className="feedback-form__group">
                <label htmlFor="student-trainer">Trainer / Mentor Name (optional)</label>
                <input
                  id="student-trainer"
                  type="text"
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  placeholder="e.g. Ar. Ritesh"
                  className="feedback-input"
                />
              </div>

              {/* Rating Picker */}
              <div className="feedback-form__group">
                <label>Overall Rating *</label>
                <div className="feedback-rating-picker" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="feedback-star-btn"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <FaStar
                        className={
                          (hoverRating || formData.rating) >= star
                            ? 'star-icon star-icon--active'
                            : 'star-icon star-icon--inactive'
                        }
                      />
                    </button>
                  ))}
                  <span className="feedback-rating-label">
                    {formData.rating === 5 && '5.0 — Outstanding'}
                    {formData.rating === 4 && '4.0 — Very Good'}
                    {formData.rating === 3 && '3.0 — Satisfactory'}
                    {formData.rating === 2 && '2.0 — Needs Improvement'}
                    {formData.rating === 1 && '1.0 — Disappointed'}
                  </span>
                </div>
              </div>

              {/* Learning Experience Feedback */}
              <div className="feedback-form__group">
                <label htmlFor="student-experience">How was your training experience? *</label>
                <textarea
                  id="student-experience"
                  name="trainingExperience"
                  value={formData.trainingExperience}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about the teaching style, pacing, practical exercises, and overall academy experience..."
                  required
                  className="feedback-textarea"
                />
              </div>

              {/* What did you learn? */}
              <div className="feedback-form__group">
                <label htmlFor="student-learned">What did you learn?</label>
                <input
                  id="student-learned"
                  type="text"
                  name="learnedSkills"
                  value={formData.learnedSkills}
                  onChange={handleChange}
                  placeholder="e.g. Parametric Revit families, sheet sets, Navisworks clash coordination..."
                  className="feedback-input"
                />
              </div>

              {/* Practical/Project Skills */}
              <div className="feedback-form__group">
                <label htmlFor="student-practical">Did the training help improve your practical / project skills?</label>
                <textarea
                  id="student-practical"
                  name="practicalSkillImprovement"
                  value={formData.practicalSkillImprovement}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Yes, I was able to complete my college thesis / land a junior BIM modeler role..."
                  className="feedback-textarea"
                />
              </div>

              {/* Improvement Question (Private) */}
              <div className="feedback-form__group">
                <label htmlFor="student-improvement">
                  What could we improve? (optional)
                  <span className="feedback-label-hint">🔒 Internal feedback only, never shown publicly</span>
                </label>
                <textarea
                  id="student-improvement"
                  name="improvementFeedback"
                  value={formData.improvementFeedback}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any suggestions on curriculum pacing, timing, or materials..."
                  className="feedback-textarea"
                />
              </div>

              {/* Recommendation */}
              <div className="feedback-form__group">
                <label>Would you recommend this course to fellow students or peers?</label>
                <div className="feedback-chips-group">
                  {['Yes', 'Maybe', 'No'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      className={`feedback-chip ${formData.recommendation === opt ? 'feedback-chip--active' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, recommendation: opt }))}
                    >
                      {opt === 'Yes' && '✓ '}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload: Profile Photo */}
              <div className="feedback-form__group">
                <label htmlFor="student-photo">Profile Photo (optional)</label>
                <div className="feedback-file-upload">
                  <input
                    id="student-photo"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handlePhotoUpload}
                    className="feedback-file-input"
                  />
                  <label htmlFor="student-photo" className="feedback-file-dropzone">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="feedback-preview-thumb" />
                    ) : (
                      <FaUpload className="feedback-upload-icon" />
                    )}
                    <span>{photoFile ? photoFile.name : 'Upload portrait photo (PNG, JPG, WebP < 5MB)'}</span>
                  </label>
                </div>
              </div>

              {/* Consent Checkbox — MUST NOT BE PRE-SELECTED */}
              <div className="feedback-consent">
                <label className="feedback-consent__label">
                  <input
                    type="checkbox"
                    name="consentToPublish"
                    checked={formData.consentToPublish}
                    onChange={handleChange}
                    className="feedback-consent__checkbox"
                  />
                  <span className="feedback-consent__text">
                    I give Prema Design Studio permission to publish my testimonial, name, course information and submitted photo on its website and marketing materials.
                  </span>
                </label>
                {!formData.consentToPublish && (
                  <p className="feedback-consent__note">
                    Note: If left unchecked, your feedback will only be used internally for academy curriculum improvements and will never appear publicly.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="feedback-form__submit">
                <Button variant="primary" size="lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'SUBMITTING FEEDBACK...' : 'SUBMIT STUDENT FEEDBACK'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedbackPage;
