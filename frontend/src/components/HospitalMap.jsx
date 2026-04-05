import React, { useEffect, useState } from 'react';
import AnimatedPointer from './AnimatedPointer';
import '../styles/HospitalMap.css';

const HospitalMap = ({ path, landmarks = [], currentLandmarkIndex = 0, pointerPos = null, nextPos = null, isAnimating = false }) => {
  const [allNodes, setAllNodes] = useState([]);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/graph');
      const data = await response.json();
      setAllNodes(data.nodes);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const roomsRender = allNodes.map(node => {
    if (node.type === 'junction') return null;
    
    let fill = '#E5E7EB';
    if (node.type === 'landmark') fill = '#DBEAFE';
    if (node.type === 'entrance') fill = '#D1FAE5';
    if (node.type === 'destination') fill = '#FEE2E2';

    return (
      <g key={node.id}>
        <rect 
          x={node.x - 15} 
          y={node.y - 10} 
          width="30" 
          height="20" 
          fill={fill} 
          stroke="#9CA3AF" 
          strokeWidth="1" 
          rx="2" 
        />
        <text 
          x={node.x} 
          y={node.y + 5} 
          textAnchor="middle" 
          fontSize="10" 
          fill="#6B7280"
        >
          {node.name.substring(0, 8)}
        </text>
      </g>
    );
  });

  const generatePathData = () => {
    if (!path || path.length === 0) return '';
    let d = `M ${path[0].x} ${path[0].y}`;
    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      
      if (i === 1) {
        d += ` L ${midX} ${midY}`;
      } else {
        d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
      }
      d += ` L ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const renderLandmarkMarkers = () => {
    if (!landmarks || landmarks.length === 0) return null;

    return landmarks.map((landmark, index) => {
      const isCurrentLandmark = index === currentLandmarkIndex;
      const radius = isCurrentLandmark ? 8 : 6;
      const color = landmark.color || '#FBBC04';
      
      return (
        <g key={`landmark-${landmark.id || index}`}>
          {/* Pulsing outer circle for current landmark */}
          {isCurrentLandmark && (
            <circle 
              cx={landmark.x} 
              cy={landmark.y} 
              r={10} 
              fill={color} 
              opacity="0.3"
              className="pulse-dot"
            />
          )}
          
          {/* Main landmark marker */}
          <circle 
            cx={landmark.x} 
            cy={landmark.y} 
            r={radius} 
            fill={color} 
            stroke="#fff" 
            strokeWidth="2"
            className={isCurrentLandmark ? 'landmark-marker-active' : 'landmark-marker'}
          />
        </g>
      );
    });
  };

  return (
    <svg 
      id="mapSvg" 
      className="hospital-map"
      viewBox="0 0 800 600" 
      style={{ width: '100%', height: '100%', display: 'block', minHeight: '500px' }}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
        </pattern>
        <style>
          {`
            @keyframes pulse-animation {
              0%, 100% {
                r: 10;
                opacity: 0.3;
              }
              50% {
                r: 16;
                opacity: 0;
              }
            }
            .pulse-dot {
              animation: pulse-animation 2s infinite;
            }
            .landmark-marker {
              transition: r 0.2s ease, fill 0.2s ease;
            }
            .landmark-marker-active {
              animation: marker-highlight 1s ease-in-out infinite;
            }
            @keyframes marker-highlight {
              0%, 100% {
                filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
              }
              50% {
                filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
              }
            }
          `}
        </style>
      </defs>
      
      {/* Grid Background */}
      <rect width="100%" height="100%" fill="url(#grid)"/>

      {/* Room Nodes */}
      <g id="rooms">{roomsRender}</g>

      {/* Navigation Path */}
      <path 
        id="navigationPath" 
        d={generatePathData()} 
        stroke="#4285F4" 
        strokeWidth="4" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeDasharray="8,4"
        style={{ opacity: path.length > 0 ? 1 : 0.3 }} 
      />

      {/* Landmark Markers */}
      <g id="landmarkMarkers">
        {renderLandmarkMarkers()}
      </g>

      {/* Animated Pointer */}
      {pointerPos && nextPos && isAnimating && (
        <AnimatedPointer
          fromPos={pointerPos}
          toPos={nextPos}
          duration={1500}
          isAnimating={isAnimating}
        />
      )}

      {/* Static Pointer (when not animating) */}
      {pointerPos && !isAnimating && (
        <g id="staticPointer" transform={`translate(${pointerPos.x}, ${pointerPos.y})`}>
          <circle cx="0" cy="0" r="8" fill="#34A853" opacity="0.3" />
          <circle cx="0" cy="0" r="6" fill="#34A853" stroke="white" strokeWidth="2" />
          <path
            d="M 0,-8 L -5,0 L 2,-2 L 2,2 L -5,0 Z"
            fill="white"
            stroke="none"
          />
        </g>
      )}

      {/* Path Node Markers (current location and destination) */}
      {path && path.length > 0 && (
        <g id="pathMarkers">
          {/* Current Location (Start) */}
          <>
            <circle cx={path[0].x} cy={path[0].y} r="12" fill="#34A853" opacity="0.2" />
            <circle cx={path[0].x} cy={path[0].y} r="8" fill="#34A853" />
            <text 
              x={path[0].x} 
              y={path[0].y + 5} 
              textAnchor="middle" 
              fontSize="14" 
              fontWeight="bold"
              fill="#fff"
            >
              A
            </text>
          </>

          {/* Destination (End) */}
          <>
            <circle cx={path[path.length - 1].x} cy={path[path.length - 1].y} r="16" fill="#EA4335" opacity="0.2" />
            <circle cx={path[path.length - 1].x} cy={path[path.length - 1].y} r="10" fill="#EA4335" />
            <text 
              x={path[path.length - 1].x} 
              y={path[path.length - 1].y + 5} 
              textAnchor="middle" 
              fontSize="14" 
              fontWeight="bold"
              fill="#fff"
            >
              B
            </text>
          </>
        </g>
      )}

      {/* Legend */}
      <g id="legend" transform="translate(10, 10)">
        <rect x="0" y="0" width="180" height="120" fill="white" stroke="#ccc" rx="4"/>
        <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#333">Map Legend</text>
        
        <rect x="10" y="30" width="12" height="12" fill="#D1FAE5" stroke="#9CA3AF"/>
        <text x="30" y="40" fontSize="11" fill="#666">Entry/Entrance</text>
        
        <rect x="10" y="50" width="12" height="12" fill="#DBEAFE" stroke="#9CA3AF"/>
        <text x="30" y="60" fontSize="11" fill="#666">Landmark</text>
        
        <rect x="10" y="70" width="12" height="12" fill="#FEE2E2" stroke="#9CA3AF"/>
        <text x="30" y="80" fontSize="11" fill="#666">Destination</text>

        <circle cx="16" cy="105" r="5" fill="#34A853"/>
        <text x="30" y="110" fontSize="11" fill="#666">Current (A)</text>
      </g>
    </svg>
  );
};

export default HospitalMap;
