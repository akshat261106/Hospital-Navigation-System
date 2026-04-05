import React, { useState, useRef, useEffect } from 'react';
import '../styles/LandmarkCard.css';

const LandmarkCard = ({ landmark, onConfirm, onSkip, hidden }) => {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    if (hidden) {
      setSwipeProgress(0);
    }
  }, [hidden]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (diff > 0) {
      const progress = Math.min(diff / 150, 1);
      setSwipeProgress(progress);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeProgress > 0.6) {
      onConfirm();
      setSwipeProgress(0);
    } else {
      setSwipeProgress(0);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    if (diff > 0) {
      const progress = Math.min(diff / 150, 1);
      setSwipeProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeProgress > 0.6) {
      onConfirm();
      setSwipeProgress(0);
    } else {
      setSwipeProgress(0);
    }
  };

  if (hidden || !landmark) return null;

  return (
    <div className="landmark-overlay">
      <div className="landmark-card">
        <div className="landmark-header">
          <div className="landmark-icon">
            <i className={`fas ${landmark.icon}`}></i>
          </div>
          <div className="landmark-info">
            <h3 className="landmark-name">{landmark.name}</h3>
            <p className="landmark-description">{landmark.description}</p>
          </div>
        </div>

        <div className="landmark-message">
          Swipe right to confirm you've reached this location
        </div>

        <div className="landmark-actions">
          <button className="btn-skip" onClick={onSkip}>
            Skip
          </button>
          
          <div
            ref={cardRef}
            className="swipe-area"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(${swipeProgress * 100}px)`,
              opacity: 1 - (swipeProgress * 0.3),
            }}
          >
            <span className="swipe-text">Swipe Right</span>
            <span className="swipe-arrow">→</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${swipeProgress * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LandmarkCard;
