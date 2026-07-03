import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Unobserve if you only want it to animate once
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.1, // Triggers when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before it hits the bottom
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}