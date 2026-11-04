import React, { useEffect, useRef } from 'react';
import TheHatCCAnim from '../animations/TheHatCCAnim';

// The hat, as exported from Stew. Driven from outside only: the generated
// component stays untouched so it can be re-exported any time.
export default function HatMascot({ className }) {
  const anim = useRef(null);

  useEffect(() => {
    // Viewers who turned motion down get the hat standing still.
    const player = anim.current?.player;
    if (player && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      player.pause();
      player.seek(0);
    }
  }, []);

  return <TheHatCCAnim ref={anim} className={className} />;
}
