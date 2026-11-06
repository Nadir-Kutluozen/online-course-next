import React, { useEffect, useRef } from 'react';
import CourseCompareLogoAnim from '../animations/CourseCompareLogoAnim';
import styles from './Header.module.css';

// The animated CC book from Stew. Hover plays its "Main" clip (the pages fold
// away and the two Cs meet) and a press plays "Press"; Stew's player handles
// both. The generated component stays untouched so it can be re-exported any
// time; this only sizes it.
export default function LogoAnim() {
  const anim = useRef(null);

  useEffect(() => {
    const player = anim.current?.player;
    if (player && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      player.pause();
      player.seek(0);
    }
  }, []);

  return (
    <span className={styles.logoArt}>
      <CourseCompareLogoAnim ref={anim} />
    </span>
  );
}
