import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CourseCard from "./CourseCard";
import { topicLabel } from "../../lib/format";
import styles from "./CourseList.module.css";

const LIMIT = 20;
const DEFAULTS = { search: "", category: "", level: "", platform: "", maxPrice: "", topRated: false };

function CourseList({ initialCourses = [] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULTS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // First page comes from getStaticProps so it is in the HTML Google sees.
  const [courses, setCourses] = useState(initialCourses);
  const [skip, setSkip] = useState(initialCourses.length);
  const [hasMore, setHasMore] = useState(initialCourses.length === LIMIT);
  const [loading, setLoading] = useState(false);

  // Ignore responses that arrive after a newer request was started.
  const requestId = useRef(0);
  const isFirstRun = useRef(true);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULTS);

  // Searches and topic tiles on the homepage link here with ?search= and ?category=.
  useEffect(() => {
    if (!router.isReady) return;
    const search = String(router.query.search || "");
    const category = String(router.query.category || "");
    if (search || category) {
      setFilters((f) => ({ ...f, search, category }));
      setDebouncedSearch(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // Wait until the user stops typing before searching.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchCourses = (reset) => {
    setLoading(true);
    const thisRequest = ++requestId.current;
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (filters.category) params.append("category", filters.category);
    if (filters.level) params.append("level", filters.level);
    if (filters.platform) params.append("platform", filters.platform);
    if (filters.maxPrice !== "") params.append("max_price", filters.maxPrice);
    if (filters.topRated) params.append("rating", "4.5");
    params.append("skip", reset ? 0 : skip);
    params.append("limit", LIMIT);

    fetch(`/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (thisRequest !== requestId.current) return;
        setCourses((prev) => (reset ? data : [...prev, ...data]));
        setSkip((prev) => (reset ? LIMIT : prev + LIMIT));
        setHasMore(data.length === LIMIT);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (thisRequest === requestId.current) setLoading(false);
      });
  };

  useEffect(() => {
    // The unfiltered first page is already rendered from initialCourses.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    fetchCourses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.level, filters.platform, filters.maxPrice, filters.topRated]);

  const reset = () => {
    setFilters(DEFAULTS);
    setDebouncedSearch("");
    if (router.query.search || router.query.category) router.replace("/courses", undefined, { shallow: true });
  };

  return (
    <div className="wrap section">
      <h1 className="display h2">{filters.category ? `${topicLabel(filters.category)} courses` : "All courses"}</h1>

      <div className={styles.filters}>
        <label htmlFor="course-search" className="sr-only">Search courses</label>
        <input
          id="course-search"
          type="search"
          className={styles.search}
          placeholder="Search courses"
          autoComplete="off"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <select aria-label="Level" className={styles.select} value={filters.level} onChange={(e) => setFilter("level", e.target.value)}>
          <option value="">Any level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
          <option value="All Levels">All levels</option>
        </select>
        <select aria-label="Platform" className={styles.select} value={filters.platform} onChange={(e) => setFilter("platform", e.target.value)}>
          <option value="">Any platform</option>
          <option value="Udemy">Udemy</option>
          <option value="Coursera">Coursera</option>
        </select>
        <select aria-label="Price" className={styles.select} value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)}>
          <option value="">Any price</option>
          <option value="0">Free or free to audit</option>
          <option value="20">Under $20</option>
          <option value="50">Under $50</option>
          <option value="100">Under $100</option>
        </select>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={filters.topRated}
          onClick={() => setFilter("topRated", !filters.topRated)}
        >
          Rated 4.5+
        </button>
        {filters.category && (
          <button type="button" className={styles.topic} onClick={() => setFilter("category", "")}>
            Topic: {topicLabel(filters.category)} <span aria-hidden="true">×</span>
            <span className="sr-only">Remove topic</span>
          </button>
        )}
        {!isDefault && (
          <button type="button" className={styles.reset} onClick={reset}>Reset</button>
        )}
      </div>

      <div className={styles.grid}>
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>

      {!loading && courses.length === 0 && (
        <p className={styles.empty}>
          No courses match these filters.{" "}
          <button type="button" className={styles.reset} onClick={reset}>Reset filters</button>
        </p>
      )}

      {hasMore && (
        <div className={styles.moreRow}>
          <button type="button" className="btn btn-outline" onClick={() => fetchCourses(false)} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseList;
