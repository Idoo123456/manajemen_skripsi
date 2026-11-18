import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // delay in ms (e.g. 100, 200, 300)
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // distance in px, default 30
  duration?: number; // duration in ms, default 700
  className?: string;
  repeat?: boolean; // continuous repeat on every scroll in & out
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 32,
  duration = 650,
  className = '',
  repeat = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!repeat && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else {
          // If repeat is true: reset when scrolled out of view so it re-animates every time!
          if (repeat) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [repeat]);

  const getTransformStyle = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(0.97)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(0.97)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(0.97)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(0.97)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0) scale(0.95)';
    }
  };

  // When appearing, use staggered delay; when resetting off-screen, reset without delay
  const activeDelay = isVisible ? delay : 0;
  const activeDuration = isVisible ? duration : 350;

  return (
    <div
      ref={elementRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transition: `opacity ${activeDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${activeDelay}ms, transform ${activeDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${activeDelay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};
