import React from "react";
import LevelsDropDownBtn from "../assets/buttons/LevelsDropDownBtn.jsx";
import PlatformDropDownBtn from "../assets/buttons/PlatformDropDownBtn.jsx";
import PriceRange from "../assets/buttons/PriceRange.jsx";
import styles from "./FilterSidebar.module.css"; 

const FilterSidebar = ({
  searchQuery,
  filterRating,
  selectedLevelLabel,
  selectedPlatformLabel,
  maxPrice,
  onSearchChange,
  onRatingChange,
  onSelectLevel,
  onSelectPlatform,
  onPriceChange,
  onReset,
}) => {
  const isRatingActive = filterRating === "4.5";

  return (
    <aside className={`${styles.card} `}> 
      <div className={styles.body}>
        {/* Search */}
        <div className={styles.group}>
          <label htmlFor="search-courses" className={styles.label}>Search</label>
          <div className="input-group shadow-sm rounded-5 ">
            <span className="input-group-text bg-white border-0" id="search-icon">
              <i className="bi bi-search" />
            </span>
            <input
              id="search-courses"
              type="text"
              className="form-control border-0 rounded-end-5"
              placeholder="Search courses..."
              aria-label="Search"
              aria-describedby="search-icon"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Rating */}
        <div className={`${styles.group} text-center`}>
          <div className={styles.label}>Rating</div>
          <button
            className={`btn btn-sm ${styles.pillBtn} ${isRatingActive ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => onRatingChange(isRatingActive ? "" : "4.5")}
            title="Toggle 4.5+ rating filter"
          >
            <i className="bi bi-star-fill me-1" />
            4.50+
          </button>
        </div>

        {/* Level */}
        <div className={styles.group}>
          <div className={styles.label}>Level</div>
          <LevelsDropDownBtn onSelectLevel={onSelectLevel} label={selectedLevelLabel} />
        </div>

        {/* Platform */}
        <div className={styles.group}>
          <div className={styles.label}>Platform</div>
          <PlatformDropDownBtn onSelectPlatform={onSelectPlatform} label={selectedPlatformLabel} />
        </div>

        {/* Price */}
        <div className={styles.group}>
          <div className="d-flex align-items-center justify-content-between">
            <div className={styles.label}>Max Price</div>
            <span className={styles.priceBadge}>${maxPrice}</span>
          </div>
          <PriceRange maxPrice={maxPrice} onChange={onPriceChange} />
        </div>

        {/* Reset */}
        <div>
          <button className="btn btn-sm btn-outline-secondary w-100 rounded-5" onClick={onReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
