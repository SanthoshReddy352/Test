'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * TextReveal - Character-by-character text reveal animation
 * Inspired by ReactBits text animations
 */
export default function TextReveal({ children, delay = 0, className = '' }) {
  const textRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || hasAnimated.current) return;

    // Split text into characters
    const text = element.textContent;
    element.innerHTML = '';
    
    const chars = text.split('');
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      element.appendChild(span);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            anime({
              targets: element.children,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              delay: (el, i) => delay + (i * 30),
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
  }, [delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
