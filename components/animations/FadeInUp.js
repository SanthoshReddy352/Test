'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * FadeInUp animation component
 * Fades in and slides up on mount or scroll
 */
export default function FadeInUp({ children, delay = 0, duration = 800, className = '' }) {
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
              opacity: [0, 1],
              translateY: [50, 0],
              duration: duration,
              delay: delay,
              easing: 'easeOutExpo',
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
