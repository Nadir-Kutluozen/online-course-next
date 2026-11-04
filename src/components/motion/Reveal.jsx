import React, { useEffect, useRef, useState } from 'react';

// Marks a block that animates once when it scrolls into view. The motion itself
// lives in globals.css (.m-rise, .m-draw, .m-wipe), keyed off data-in.
export default function Reveal({ as: Tag = 'div', children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal="" data-in={inView ? '' : undefined} {...rest}>
      {children}
    </Tag>
  );
}

// A section heading that slides up out of its own mask.
export const RevealHeading = ({ children, className = '' }) => (
  <Reveal as="h2" className={`display h2 ${className}`}>
    <span className="m-mask"><span className="m-rise">{children}</span></span>
  </Reveal>
);
