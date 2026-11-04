import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

  return (
    <header className={`wrap ${styles.header}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} onClick={close}>OnlineCourseCompare</Link>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/#rate" className={`btn btn-dark ${styles.cta}`} onClick={close}>Rate a course</Link>
        <button
          type="button"
          className={styles.menu}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
};

export default Header;
