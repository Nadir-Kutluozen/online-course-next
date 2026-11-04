import React, { useState, useEffect } from "react";
import styles from "./Compare.module.css";

const CourseSearchInput = ({ id, label, selected, onCourseSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({ search: searchTerm, limit: 8 });

    // Debounce typing, and drop results for a search term that has since changed.
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`/api/courses?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch filtered courses:", err);
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleSelect = (course) => {
    setSearchTerm("");
    onCourseSelect(course);
  };

  return (
    <div className={styles.picker}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        type="search"
        className={styles.input}
        placeholder={selected ? selected.title : "Search for a course"}
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <ul className={styles.results}>
          {loading && <li className={styles.status}>Searching…</li>}
          {!loading && results.length === 0 && <li className={styles.status}>No courses match.</li>}
          {!loading && results.map((course) => (
            <li key={course.id}>
              <button type="button" className={styles.result} onClick={() => handleSelect(course)}>
                <span>{course.title}</span>
                <span className={`label ${styles.resultMeta}`}>{course.platform}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseSearchInput;
