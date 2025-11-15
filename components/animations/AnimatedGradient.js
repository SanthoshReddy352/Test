'use client';

import { useEffect, useRef } from 'react';

/**
 * AnimatedGradient - Animated gradient background
 * Inspired by ReactBits gradient animation patterns
 */
export default function AnimatedGradient({ children, className = '' }) {
  const gradientRef = useRef(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    let angle = 90;
    const animate = () => {
      angle = (angle + 0.5) % 360;
      gradient.style.background = `linear-gradient(${angle}deg, #ff3131, #ff914d, #ff3131)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={gradientRef}
      className={`bg-brand-gradient ${className}`}
      style={{ backgroundSize: '200% 200%' }}
    >
      {children}
    </div>
  );
}
