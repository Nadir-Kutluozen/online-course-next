import React, { useState } from 'react';
import CourseCard from './CourseCard';
import styles from './CourseList.module.css';

const LIMIT = 20;

const FreeCourseList = ({ initialCourses = [] }) => {
  // First page comes from getStaticProps so it is in the HTML Google sees.
  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(initialCourses.length);
  const [hasMore, setHasMore] = useState(initialCourses.length === LIMIT);

  const fetchMoreCourses = () => {
    setLoading(true);
    fetch(`/api/courses?free=1&skip=${skip}&limit=${LIMIT}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses((prev) => [...prev, ...data]);
        setSkip((prev) => prev + LIMIT);
        setHasMore(data.length === LIMIT);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  };

  return (
    <div className="wrap section">
      <h1 className="display h2">Free to audit</h1>
      <p className="lede">Lessons free. Certificate extra.</p>

      <div className={styles.grid}>
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>

      {hasMore && (
        <div className={styles.moreRow}>
          <button type="button" className="btn btn-outline" onClick={fetchMoreCourses} disabled={loading}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FreeCourseList;
