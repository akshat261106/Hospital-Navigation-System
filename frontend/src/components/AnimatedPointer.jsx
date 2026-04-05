import React, { useEffect, useRef } from 'react';

const AnimatedPointer = ({ fromPos, toPos, duration = 1500, isAnimating = false }) => {
  const pointerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isAnimating || !fromPos || !toPos) {
      return;
    }

    const startTime = Date.now();
    const startX = fromPos.x;
    const startY = fromPos.y;
    const endX = toPos.x;
    const endY = toPos.y;

    // Calculate angle to target
    const calcAngle = (fromX, fromY, toX, toY) => {
      return (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const easedProgress =
        progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      const currentX = startX + (endX - startX) * easedProgress;
      const currentY = startY + (endY - startY) * easedProgress;
      const angle = calcAngle(startX, startY, endX, endY);

      if (pointerRef.current) {
        pointerRef.current.setAttribute(
          'transform',
          `translate(${currentX}, ${currentY}) rotate(${angle})`
        );
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, fromPos, toPos, duration]);

  if (!fromPos) {
    return null;
  }

  return (
    <g ref={pointerRef} id="navPointer" transform={`translate(${fromPos.x}, ${fromPos.y})`}>
      {/* Pulsing background circle */}
      <circle cx="0" cy="0" r="8" fill="#34A853" opacity="0.3" className="pulse-circle" />

      {/* Main pointer circle */}
      <circle cx="0" cy="0" r="6" fill="#34A853" stroke="white" strokeWidth="2" />

      {/* Arrow pointing forward */}
      <path
        d="M 0,-8 L -5,0 L 2,-2 L 2,2 L -5,0 Z"
        fill="white"
        stroke="none"
      />

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              r: 8;
              opacity: 0.3;
            }
            50% {
              r: 14;
              opacity: 0;
            }
          }
          .pulse-circle {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>
    </g>
  );
};

export default AnimatedPointer;
