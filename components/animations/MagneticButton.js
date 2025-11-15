'use client';

import { useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';

/**
 * MagneticButton - Button with magnetic hover effect
 * Inspired by ReactBits patterns
 */
export default function MagneticButton({ children, className = '', ...props }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    anime({
      targets: button,
      translateX: x * 0.3,
      translateY: y * 0.3,
      scale: 1.05,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (!button) return;

    anime({
      targets: button,
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 500,
      easing: 'easeOutElastic(1, .6)',
    });
    setIsHovered(false);
  };

  return (
    <div
      ref={buttonRef}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}
