import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HospitalMap from '../components/HospitalMap';
import LandmarkCard from '../components/LandmarkCard';
import { LANDMARK_DATA } from '../utils/data';
import '../styles/Location.css';

const Location = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState('reg-counter');
  const [currentLocationName, setCurrentLocationName] = useState('Registration Counter');
  const [destinationName, setDestinationName] = useState('');
  const [path, setPath] = useState([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [landmarks, setLandmarks] = useState([]);
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [showLandmarkCard, setShowLandmarkCard] = useState(false);
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const [navigationComplete, setNavigationComplete] = useState(false);
  const [pointerPosition, setPointerPosition] = useState(null);
  const [pointerTarget, setPointerTarget] = useState(null);
  const [isPointerAnimating, setIsPointerAnimating] = useState(false);

  useEffect(() => {
    fetchDestinations();
    if (location.state?.destination) {
      setSelectedDestination(location.state.destination.id);
    }
  }, [location]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations');
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const extractLandmarks = (pathNodes) => {
    return pathNodes
      .filter(node => node.type === 'landmark' && LANDMARK_DATA[node.id])
      .map(node => ({
        ...node,
        ...LANDMARK_DATA[node.id]
      }));
  };

  const calculateDistanceAndETA = (pathNodes) => {
    let totalDistance = 0;
    for (let i = 1; i < pathNodes.length; i++) {
      const dx = pathNodes[i].x - pathNodes[i - 1].x;
      const dy = pathNodes[i].y - pathNodes[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Convert to meters (1 unit = 0.5 meters)
    const distanceInMeters = Math.round(totalDistance * 0.5);
    // Calculate ETA (50m/min walking speed)
    const etaMinutes = Math.ceil(distanceInMeters / 50);
    
    return { distanceInMeters, etaMinutes };
  };

  const handleStartNavigation = async () => {
    if (!selectedDestination) {
      alert('Please select a destination');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/find-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startId: currentLocation,
          endId: selectedDestination
        })
      });

      const data = await response.json();
      if (data.path) {
        setPath(data.path);
        
        // Extract landmarks from path
        const pathLandmarks = extractLandmarks(data.path);
        setLandmarks(pathLandmarks);
        setCurrentLandmarkIndex(0);
        setCurrentPathIndex(0);
        
        // Initialize pointer at start location
        if (data.path.length > 0) {
          setPointerPosition({ x: data.path[0].x, y: data.path[0].y });
          // Set first target as first landmark or destination
          if (pathLandmarks.length > 0) {
            setPointerTarget({ x: pathLandmarks[0].x, y: pathLandmarks[0].y });
          } else {
            setPointerTarget({ x: data.path[data.path.length - 1].x, y: data.path[data.path.length - 1].y });
          }
        }
        
        // Calculate distance and ETA
        const { distanceInMeters, etaMinutes } = calculateDistanceAndETA(data.path);
        setDistance(distanceInMeters);
        setEta(etaMinutes);
        
        setShowNavigation(true);
        setNavigationComplete(false);
        
        // Show first landmark after a short delay
        if (pathLandmarks.length > 0) {
          setTimeout(() => {
            setShowLandmarkCard(true);
          }, 500);
        }
      } else {
        alert('No path found to destination');
      }
    } catch (error) {
      console.error('Error finding path:', error);
      alert('Error finding path');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = (e) => {
    const destId = e.target.value;
    setSelectedDestination(destId);
    
    const dest = destinations.find(d => d.id === destId);
    if (dest) {
      setDestinationName(dest.name);
    }
  };

  const handleLandmarkConfirm = () => {
    setShowLandmarkCard(false);
    
    // Find the next landmark or destination from current path position
    let nextPathIndex = currentPathIndex + 1;
    
    // Keep advancing until we find a landmark or reach the end
    while (nextPathIndex < path.length) {
      const nextNode = path[nextPathIndex];
      if (nextNode.type === 'landmark' || nextPathIndex === path.length - 1) {
        // Found next landmark or destination
        break;
      }
      nextPathIndex++;
    }
    
    // Prevent going beyond the path
    if (nextPathIndex >= path.length) {
      nextPathIndex = path.length - 1;
    }
    
    const nextNode = path[nextPathIndex];
    if (nextNode) {
      // Animate pointer to next node
      setPointerTarget({ x: nextNode.x, y: nextNode.y });
      setIsPointerAnimating(true);
      
      // After animation completes, update state
      setTimeout(() => {
        setPointerPosition({ x: nextNode.x, y: nextNode.y });
        setIsPointerAnimating(false);
        setCurrentPathIndex(nextPathIndex);
        setCurrentLocation(nextNode.id);
        setCurrentLocationName(nextNode.name);
        
        // Show landmark card if next node is a landmark
        if (nextNode.type === 'landmark') {
          // Find the landmark in the landmarks array
          const landmarkIndex = landmarks.findIndex(l => l.id === nextNode.id);
          if (landmarkIndex !== -1) {
            setCurrentLandmarkIndex(landmarkIndex);
          }
          setTimeout(() => {
            setShowLandmarkCard(true);
          }, 300);
        } else if (nextPathIndex === path.length - 1) {
          // Reached destination
          setNavigationComplete(true);
        }
      }, 1500);
    }
  };

  const handleLandmarkSkip = () => {
    // Just hide the landmark card - user will continue on next swipe
    setShowLandmarkCard(false);
  };

  const handleCancelNavigation = () => {
    setShowNavigation(false);
    setPath([]);
    setShowLandmarkCard(false);
    setLandmarks([]);
    setCurrentLandmarkIndex(0);
    setCurrentPathIndex(0);
    setNavigationComplete(false);
    setPointerPosition(null);
    setPointerTarget(null);
    setIsPointerAnimating(false);
  };

  const handleCloseNavigationComplete = () => {
    handleCancelNavigation();
  };


  return (
    <main className="location-page">
      {/* Header */}
      <header className="location-header">
        <div className="header-content">
          {showNavigation && (
            <button className="back-btn" onClick={handleCancelNavigation}>
              ← Back
            </button>
          )}
          <div className="header-info">
            <h1>Hospital Navigation</h1>
            <p className="current-location">{currentLocationName}</p>
          </div>
        </div>
      </header>

      {/* Navigation Info */}
      {showNavigation && (
        <div className="nav-info">
          <div className="nav-stat">
            <span className="stat-label">Distance</span>
            <span className="stat-value">{distance}m</span>
          </div>
          <div className="nav-stat">
            <span className="stat-label">ETA</span>
            <span className="stat-value">{eta} min</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container">
        <HospitalMap 
          path={path} 
          landmarks={landmarks} 
          currentLandmarkIndex={currentLandmarkIndex}
          pointerPos={pointerPosition}
          nextPos={pointerTarget}
          isAnimating={isPointerAnimating}
        />
      </div>

      {/* Destination Selection Panel */}
      {!showNavigation && (
        <div className="destination-panel">
          <div className="panel-content">
            <label>Select Destination</label>
            <select 
              value={selectedDestination} 
              onChange={handleDestinationChange}
              className="destination-select"
            >
              <option value="">Choose a destination...</option>
              {destinations
                .filter(d => d.id !== currentLocation)
                .map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
            </select>
          </div>
          <button 
            className="start-navigation-btn" 
            onClick={handleStartNavigation}
            disabled={loading || !selectedDestination}
          >
            <span>▶</span> {loading ? 'Finding Route...' : 'Start Navigation'}
          </button>
        </div>
      )}

      {/* Landmark Card */}
      {showNavigation && landmarks.length > 0 && (
        <LandmarkCard
          landmark={landmarks[currentLandmarkIndex]}
          onConfirm={handleLandmarkConfirm}
          onSkip={handleLandmarkSkip}
          hidden={!showLandmarkCard}
        />
      )}

      {/* Navigation Complete Modal */}
      {navigationComplete && (
        <div className="modal-overlay" onClick={handleCloseNavigationComplete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="success-icon">✓</div>
              <h2>Destination Reached!</h2>
              <p>You have arrived at {currentLocationName}</p>
              <button 
                className="modal-close-btn" 
                onClick={handleCloseNavigationComplete}
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Location;
