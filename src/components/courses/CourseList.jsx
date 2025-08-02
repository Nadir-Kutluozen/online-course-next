import React, { useEffect, useState } from 'react';
import styles from './CourseList.module.css';
import { renderStars } from '../action/helperFuncsAction';
import { formatUdemyUrl} from '../action/helperFuncsAction'; 
import LevelsDropDownBtn from '../assets/buttons/LevelsDropDownBtn'; 
import PriceRange from '../assets/buttons/PriceRange';
import PlatformDropDownBtn from '../assets/buttons/PlatformDropDownBtn';
import { SquareLoader } from "react-spinners";
import { getPlatformLogo } from '../action/helperFuncsAction'; 


function CourseList() {
  
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);         // all courses from API
  
  const [searchQuery, setSearchQuery] = useState("");  // user's search input
  const [filterRating, setFilterRating] = useState(""); // rating filter
  const [filterLevel, setFilterLevel] = useState(""); // level filter
  const [selectedLevelLabel, setSelectedLevelLabel] = useState("Level"); // label for dropdown button
  const [maxPrice, setMaxPrice] = useState(150); // default to max
  const [filterPlatform, setFilterPlatform] = useState(""); // platform filter
  const [selectedPlatformLabel, setSelectedPlatformLabel] = useState("Platform"); // label for category dropdown

  const [skip, setSkip] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();
  
    if (searchQuery) params.append("search", searchQuery);
    if (filterRating) params.append("rating", filterRating);
    if (filterLevel) params.append("level", filterLevel);
    if (maxPrice !== 150) params.append("max_price", maxPrice); // only if not default
    if (filterPlatform) params.append("platform", filterPlatform);
  
    params.append("skip", reset ? 0 : skip);
    params.append("limit", limit);
  
    fetch(`https://onlinecourse-backend-okdb.onrender.com/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses((prev) => (reset ? data : [...prev, ...data]));
        setSkip((prev) => (reset ? limit : prev + limit));
        setHasMore(data.length === limit); // stop loading if less than limit
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  // Fetch courses from the backend
  //https://onlinecourse-backend-okdb.onrender.com/courses
  //http://localhost:8000/courses
  useEffect(() => {
    setSkip(0);            // reset pagination
    fetchCourses(true);    // fetch with filters from the start
  }, [searchQuery, filterRating, filterLevel, maxPrice, filterPlatform]);

  // Update filteredCourses whenever searchQuery or courses change

  
  return (
    <div className="container py-5">
      {/* Search Bar */}
      <div className="container mb-4">
        <div className="row justify-content-center g-2">
          {/* Search Bar */}
          <div className="col-12 col-md-6">
            <div className="input-group shadow-sm rounded-5">
              <span className="input-group-text bg-white border-0" id="search-icon">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 rounded-end-5"
                placeholder="Search courses..."
                aria-label="Search"
                aria-describedby="search-icon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="col-12 col-md-auto d-flex justify-content-center align-items-center gap-2">
            <button // Filter button for 4.5+ rating
              className={`btn btn-sm rounded-5 ${filterRating === "4.5" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setFilterRating("4.5")}
            >
              4.50+ Rating
            </button>
            <LevelsDropDownBtn 
                onSelectLevel={(level) => {
                  setFilterLevel(level); // filters the courses
                  setSelectedLevelLabel(level || "Level"); // updates the button label
                }} 
                label={selectedLevelLabel}
            />
            <PlatformDropDownBtn 
                onSelectPlatform={(Platform) => {
                  setFilterPlatform(Platform); // filters the courses by category
                  setSelectedPlatformLabel(Platform || "Platform"); // updates the button label
                }} 
                label={selectedPlatformLabel}
                />
            <PriceRange maxPrice={maxPrice} onChange={setMaxPrice} />
            <button
              className="btn btn-sm rounded-5 btn-outline-secondary"
              onClick={() => {
                setSearchQuery(""); // Clear search input
                setFilterRating(""); // Reset filter
                setFilterLevel(""); // Reset level filter
                setSelectedLevelLabel("Level"); // Reset dropdown label
                setMaxPrice(150); // Reset price filter
                setFilterPlatform(""); // Reset platform filter
                setSelectedPlatformLabel("Platform"); // Reset platform dropdown label
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className=" display-5 mb-4 totheleft">Courses</h2>
      

      {/* Filtered Course List */}
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
                <div className= {`card h-100 ${styles.courseCard}`}>
                <div className="position-relative">
                    {/* Platform logo badge */}
                    
                    {/* Main course image */}
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
        ) : loading && (
          <div className="text-center mt-2">
            <SquareLoader color="#007bff" size={100} />
          </div>
        )}
      </div>
      {/* Load More Button */}
{hasMore && (
  <div className="text-center mt-4">
    {loading ? (
      <SquareLoader color="#007bff" size={100} />
    ) : (
      <button className="btn btn-outline-dark rounded-5" onClick={() => fetchCourses(false)}>
        Load More
      </button>
    )}
  </div>
)}

    </div>
    
  ) 
}



export default CourseList;
