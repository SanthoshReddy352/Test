'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

/**
 * StaggerChildren animation component
 * Animates children with a stagger delay
 */
export default function StaggerChildren({ 
  children, 
  staggerDelay = 100, 
  duration = 800,
  className = '',
  animation = 'fadeUp' // 'fadeUp', 'scale', 'slideLeft'
}) {
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
            const children = element.children;
            
            let animationConfig = {};
            
            switch(animation) {
              case 'fadeUp':
                animationConfig = {
                  opacity: [0, 1],
                  translateY: [30, 0],
                };
                break;
              case 'scale':
                animationConfig = {
                  opacity: [0, 1],
                  scale: [0.8, 1],
                };
                break;
              case 'slideLeft':
                animationConfig = {
                  opacity: [0, 1],
                  translateX: [50, 0],
                };
                break;
              default:
                animationConfig = {
                  opacity: [0, 1],
                  translateY: [30, 0],
                };
            }
            
            anime({
              targets: Array.from(children),
              ...animationConfig,
              duration: duration,
              delay: anime.stagger(staggerDelay),
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
  }, [staggerDelay, duration, animation]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
