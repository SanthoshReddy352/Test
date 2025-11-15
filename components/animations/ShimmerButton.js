'use client';

import { useRef } from 'react';
import anime from 'animejs';

/**
 * ShimmerButton - Button with shimmer effect on hover
 * Inspired by ReactBits patterns
 */
export default function ShimmerButton({ children, className = '', ...props }) {
  const shimmerRef = useRef(null);

  const handleMouseEnter = () => {
    if (!shimmerRef.current) return;
    
    anime({
      targets: shimmerRef.current,
      translateX: ['-100%', '100%'],
      duration: 800,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <div
        ref={shimmerRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transform: 'translateX(-100%)' }}
      />
      {children}
    </div>
  );
}
