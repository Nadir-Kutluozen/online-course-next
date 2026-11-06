import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoAnim from './LogoAnim';
import styles from './Header.module.css';

const LINKS = [
  { href: '/#compare', label: 'Compare' },
  { href: '/courses', label: 'Courses' },
  { href: '/free-courses', label: 'Free to audit' },
  { href: '/about', label: 'About' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();
  const close = () => setOpen(false);

  // Escape closes the phone menu.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`wrap ${styles.header}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} onClick={close} aria-label="OnlineCourseCompare home">
          <LogoAnim />
        </Link>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Main">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
              style={{ '--i': i }}
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <Link href="/#rate" className={`btn btn-dark ${styles.cta}`} onClick={close}>Rate a course</Link>
          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className={styles.burgerLines} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
