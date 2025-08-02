import React, { useState, useEffect } from 'react';
import { renderStars, formatUdemyUrl } from '../action/helperFuncsAction';
import { SquareLoader } from 'react-spinners';
// import styles from './freeCourseList.module.css'; 
import { getPlatformLogo } from '../action/helperFuncsAction'; // Import the utility function for platform logos
import styles from './courseList.module.css'; // Import styles for consistent card design

const FreeCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 20; // number of items to load each time

  const fetchMoreCourses = () => {
    setLoading(true);
    fetch(`https://onlinecourse-backend-okdb.onrender.com/courses/free?skip=${skip}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(prev => [...prev, ...data]);
        setSkip(prev => prev + limit);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMoreCourses(); // initial fetch
  }, []);

  return (
    <div className="container py-5">
      <h2 className="display-5 mb-4 totheleft">Free Courses</h2>

      <div className="row g-4">
        {courses.map(course => (
          <div key={course.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <a href={formatUdemyUrl(course.url)} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
              <div className={`card  ${styles.courseCard}`}>
                                    {getPlatformLogo(course.platform) && (
                                      <div className={styles.platformLogoWrapper}>
                                        <img
                                          src={getPlatformLogo(course.platform)}
                                          alt={`${course.platform} logo`}
                                          className={styles.platformLogo}
                                        />
                                      </div>
                                    )}
                <img src={course.image} alt={course.title} className={`p-3 ${styles.courseImg}`} />
                <div className="card-body d-flex flex-column">
                  <h5 className={styles.cardTitle}>{course.title}</h5>
                  <p className={`${styles.cardText} text-muted`}>{course.headline}</p>
                  <p className="mt-auto fw-bold text-success">Enroll For Free</p>
                </div>
                <div className={`${styles.cardFooter} small text-muted`}>
                  {renderStars(course.rating)} | {course.level} <br />
                  {course.instructor_names}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-4">
        {loading ? (
          <SquareLoader color="#007bff" size={100} />
        ) : (
          <button className="btn btn-outline-dark rounded-5" onClick={fetchMoreCourses}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default FreeCourseList;
