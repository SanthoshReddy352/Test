import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Custom hook for staggered animations on children elements
 * @param {Object} animeConfig - anime.js configuration
 * @param {number} delay - Stagger delay in ms
 * @returns {Object} ref - Ref to attach to parent container
 */
export const useAnimeStagger = (animeConfig, delay = 100) => {
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
            anime({
              targets: Array.from(children),
              delay: anime.stagger(delay),
              ...animeConfig,
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
  }, [animeConfig, delay]);

  return ref;
};
