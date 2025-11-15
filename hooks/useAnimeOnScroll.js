import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Custom hook for triggering anime.js animations on scroll
 * @param {Object} animeConfig - anime.js configuration object
 * @param {number} threshold - Intersection observer threshold (0-1)
 * @returns {Object} ref - Ref to attach to the element
 */
export const useAnimeOnScroll = (animeConfig, threshold = 0.1) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            anime({
              targets: element,
              ...animeConfig,
            });
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [animeConfig, threshold]);

  return ref;
};
