import React from 'react';
import Squares from '../assets/Squares';
import styles from './Homepage.module.css';



const Homepage = () => {
  return (
    <div className={styles.customWrapper}>
      {/* Squares Background */}
      <div className={styles.squaresLayer}>
        <Squares
          direction="right"
          speed={0.2}
          squareSize={30}
          borderColor="#ddd"
          hoverFillColor="#007bff"
        />
      </div>

      {/* Homepage Content */}
      <div className="">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 p-3">
              <div>
                <h1 className={`totheleft ${styles.customContent}`}>Online</h1>
                <h1 className={`totheleft ${styles.blue}`}>Course</h1>
                <h1 className={`totheleft ${styles.customContent}`}>Compare</h1>
                <p className={`pt-3 lead ${styles.customContent}`}>
                  Explore 10,000+ online courses from top platforms like Udemy, Coursera, and edX.
                  Find the right course for your future, compare options, and start learning smarter today.
                </p>
              </div>
            </div>
            <div className="col-md-6 p-3 d-flex flex-column align-items-center">
              <img
                className={`img-fluid mb-3 ${styles.customContent} ${styles.logoImage}`}
                src="./homepage_logo.svg"
                alt="Online Course Compare"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
