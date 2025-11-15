'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * GlowEffect - Animated glow effect around elements
 * Inspired by ReactBits patterns
 */
export default function GlowEffect({ children, className = '', color = 'brand-red' }) {
  const glowRef = useRef(null);

  useEffect(() => {
    if (!glowRef.current) return;

    const animation = anime({
      targets: glowRef.current,
      opacity: [0.3, 0.8, 0.3],
      duration: 2000,
      easing: 'easeInOutSine',
      loop: true,
    });

    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={glowRef}
        className={`absolute -inset-1 bg-${color} rounded-lg blur-lg opacity-30`}
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
}
