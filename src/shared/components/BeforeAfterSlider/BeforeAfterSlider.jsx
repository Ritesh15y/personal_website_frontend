import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './BeforeAfterSlider.css';

/**
 * BeforeAfterSlider Component
 * An interactive touch-friendly & accessible slider to compare two images (e.g. 2D Blueprint vs 3D Render).
 */
const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = '2D Blueprint',
  afterLabel = '3D Photorealistic Render',
  initialPosition = 50,
  className = '',
  altText = 'Blueprint to 3D Render comparison',
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Calculate position based on mouse/touch X coordinate relative to container
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let positionPercentage = (x / rect.width) * 100;

    if (positionPercentage < 0) positionPercentage = 0;
    if (positionPercentage > 100) positionPercentage = 100;

    setSliderPosition(positionPercentage);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`before-after-slider ${isDragging ? 'is-dragging' : ''} ${className}`}
      onClick={(e) => handleMove(e.clientX)}
    >
      {/* After Image (Background/Base Image) */}
      <div className="before-after-slider__after-layer">
        <img src={afterImage} alt={`After: ${altText}`} loading="lazy" />
        {afterLabel && (
          <span className="before-after-slider__badge before-after-slider__badge--after glass-card">
            {afterLabel}
          </span>
        )}
      </div>

      {/* Before Image (Clipped Overlay Image) */}
      <div
        className="before-after-slider__before-layer"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={beforeImage} alt={`Before: ${altText}`} loading="lazy" />
        {beforeLabel && (
          <span className="before-after-slider__badge before-after-slider__badge--before glass-card">
            {beforeLabel}
          </span>
        )}
      </div>

      {/* Interactive Divider Line & Handle */}
      <div
        className="before-after-slider__handle-wrapper"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        tabIndex={0}
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after image slider comparison"
        onKeyDown={handleKeyDown}
      >
        <div className="before-after-slider__line" />
        <div className="before-after-slider__button">
          <FaChevronLeft className="slider-icon" />
          <FaChevronRight className="slider-icon" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
