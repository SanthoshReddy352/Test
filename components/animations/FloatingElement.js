'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * FloatingElement - Creates a subtle floating animation
 * Inspired by ReactBits patterns
 */
export default function FloatingElement({ 
  children, 
  className = '',
  duration = 3000,
  distance = 20
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = anime({
      targets: element,
      translateY: [-distance, distance],
      duration: duration,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    return () => {
      animation.pause();
    };
  }, [duration, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
