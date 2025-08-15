
import React, { useEffect, useState } from "react";
import styles from "./CourseList.module.css";
import { renderStars, formatUdemyUrl, getPlatformLogo } from "../action/helperFuncsAction.jsx";
import { SquareLoader } from "react-spinners";
import FilterSidebar from "./FilterSideBar.jsx";



function CourseList() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [selectedLevelLabel, setSelectedLevelLabel] = useState("Level");
  const [maxPrice, setMaxPrice] = useState(150);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [selectedPlatformLabel, setSelectedPlatformLabel] = useState("Platform");

  const [skip, setSkip] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (filterRating) params.append("rating", filterRating);
    if (filterLevel) params.append("level", filterLevel);
    if (maxPrice !== 150) params.append("max_price", maxPrice);
    if (filterPlatform) params.append("platform", filterPlatform);

    params.append("skip", reset ? 0 : skip);
    params.append("limit", limit);

    fetch(`https://onlinecourse-backend-okdb.onrender.com/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(prev => (reset ? data : [...prev, ...data]));
        setSkip(prev => (reset ? limit : prev + limit));
        setHasMore(data.length === limit);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setSkip(0);
    fetchCourses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterRating, filterLevel, maxPrice, filterPlatform]);

  const handleReset = () => {
    setSearchQuery("");
    setFilterRating("");
    setFilterLevel("");
    setSelectedLevelLabel("Level");
    setMaxPrice(150);
    setFilterPlatform("");
    setSelectedPlatformLabel("Platform");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* LEFT */}
        <div className={`col-12 col-md-3 col-lg-2 mt-4 mb-4`}>
          <div className={styles.stickyWrapper}>
                      <FilterSidebar
            searchQuery={searchQuery}
            filterRating={filterRating}
            selectedLevelLabel={selectedLevelLabel}
            selectedPlatformLabel={selectedPlatformLabel}
            maxPrice={maxPrice}
            onSearchChange={setSearchQuery}
            onRatingChange={setFilterRating}
            onSelectLevel={(level) => {
              setFilterLevel(level);
              setSelectedLevelLabel(level || "Level");
            }}
            onSelectPlatform={(platform) => {
              setFilterPlatform(platform);
              setSelectedPlatformLabel(platform || "Platform");
            }}
            onPriceChange={setMaxPrice}
            onReset={handleReset}
          />

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <h2 className="mb-3">Courses</h2>
          <div className="row g-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <a
                    href={formatUdemyUrl(course.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    <div className={`card h-100 ${styles.courseCard}`}>
                      <div className="position-relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className={`p-3 img-fluid ${styles.courseImg}`}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className={styles.cardTitle}>{course.title}</h5>
                        <p className={`${styles.cardText} text-muted`}>{course.headline}</p>

                        {getPlatformLogo(course.platform) && (
                          <div className={styles.platformLogoWrapper}>
                            <img
                              src={getPlatformLogo(course.platform)}
                              alt={`${course.platform} logo`}
                              className={styles.platformLogo}
                            />
                          </div>
                        )}

                        <p className="mt-auto fw-bold">${course.price}</p>
                      </div>
                      <div className={`${styles.cardFooter} small text-muted`}>
                        {renderStars(course.rating)} | {course.level} <br />
                        {course.instructor_names}
                      </div>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              loading && (
                <div className="text-center mt-2">
                  <SquareLoader size={100} />
                </div>
              )
            )}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              {loading ? (
                <SquareLoader size={100} />
              ) : (
                <button className="btn btn-outline-dark rounded-5" onClick={() => fetchCourses(false)}>
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseList;
