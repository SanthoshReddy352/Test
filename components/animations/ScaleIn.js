'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

/**
 * ScaleIn animation component
 * Scales in from small to normal size
 */
export default function ScaleIn({ children, delay = 0, duration = 600, className = '' }) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            anime({
              targets: element,
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: duration,
              delay: delay,
              easing: 'easeOutElastic(1, .8)',
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [delay, duration]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
