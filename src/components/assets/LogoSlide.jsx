// src/components/LogoSlide.jsx
import React from 'react';
import styles from './LogoSlide.module.css';

const logos = [
  './udemy_logo.png',
  './corsera_logo.png',
  './edx_logo.png',
  './udacity-dark.png',
  './linkedin-original.png',
  './udemy_logo.png',
  './corsera_logo.png',
  './edx_logo.png',
  './udacity-dark.png',
  './linkedin-original.png',
];

const LogoSlide = () => {
  return (
    <div className="py-5">
      <div className={styles.logoSlideWrapper}>
        <div className={styles.logoSlideTrack}>
          {logos.concat(logos).map((logo, index) => (
            <div key={index} className={styles.logoSlideItem}>
              <img src={logo} alt={`Logo ${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlide;
