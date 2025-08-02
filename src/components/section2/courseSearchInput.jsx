import React, { useState, useEffect } from "react";
import styles from "./CourseSearchInput.module.css";
import { SquareLoader } from "react-spinners";

const CourseSearchInput = ({ placeholder, onCourseSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses([]);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    params.append("search", searchTerm);
    params.append("limit", 10);

    fetch(`https://onlinecourse-backend-okdb.onrender.com/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch filtered courses:", err);
        setLoading(false);
      });
  }, [searchTerm]);

  const handleSelect = (course) => {
    setSelectedCourse(course);
    setSearchTerm("");
    onCourseSelect(course);
  };

  return (
    <div className={styles.courseSearchWrapper}>
      <div className="input-group shadow rounded-5">
        <span className="input-group-text bg-white border-0" id="search-icon">
          <i className="bi bi-search text-primary"></i>
        </span>
        <input
          type="text"
          className={`form-control border-0 rounded-end-5 ${styles.customCourseInput}`}
          placeholder={selectedCourse.title || placeholder || "Search courses..."}
          aria-label="Search"
          aria-describedby="search-icon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center my-2">
          <SquareLoader size={30} color="#007bff" />
        </div>
      )}

      {searchTerm && !loading && (
        <ul className={styles.searchResults}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <li
                key={course.id}
                className={styles.searchResultItem}
                onClick={() => handleSelect(course)}
              >
                <img src={course.image} alt={course.title} className={styles.courseImage} />
                <h3 className={styles.courseTitle}>{course.title}</h3>
              </li>
            ))
          ) : (
            <li className={`${styles.searchResultItem} ${styles.noMatch}`}>No results found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CourseSearchInput;
