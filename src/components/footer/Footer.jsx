import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className="wrap">
      <footer className={styles.footer}>
        <p className={`accent-type ${styles.big}`}>Compare before you buy</p>
        <div className={styles.row}>
          <nav className={styles.links} aria-label="Footer">
            <Link href="/courses">Courses</Link>
            <Link href="/free-courses">Free to audit</Link>
            <Link href="/#compare">Compare</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy policy</Link>
          </nav>
          <p className={styles.small} suppressHydrationWarning>
            &copy; {new Date().getFullYear()} OnlineCourseCompare. Not affiliated with Udemy or Coursera.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
