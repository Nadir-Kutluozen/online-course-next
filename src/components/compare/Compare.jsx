import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import CourseSearchInput from "./CourseSearchInput";
import { RevealHeading } from "../motion/Reveal";
import { compactNumber, comparePath, formatPrice } from "../../lib/format";
import styles from "./Compare.module.css";

// One line of facts: price, rating, reviews, platform.
const Facts = ({ course }) => {
  const free = course.pricing === "audit" || course.pricing === "free";
  return (
    <span className={styles.sugMeta}>
      <span className={`${styles.sugPrice} ${free ? styles.sugFree : ""}`}>{formatPrice(course)}</span>
      {course.rating ? <span>★ {course.rating.toFixed(1)}</span> : null}
      {course.num_reviews ? <span>{compactNumber(course.num_reviews)}</span> : null}
      <span>{course.platform}</span>
    </span>
  );
};

// Step 1: pick the course you're thinking about. Step 2: it stays on the left
// as your pick, with the four courses most worth comparing it with on the
// right; click one (or search any other) and the comparison opens.
const Compare = ({ popular = [] }) => {
  const router = useRouter();
  const [picked, setPicked] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!picked) return undefined;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/courses/related?id=${picked.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRelated(data.related || []);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [picked]);

  const pick = (course) => {
    setRelated([]);
    setPicked(course);
  };

  return (
    <section id="compare" className="wrap section">
      <div className={styles.panel}>
        <RevealHeading className={styles.heading}>Compare <span className="outline" style={{ "--stroke": "var(--ink)" }}>two courses</span></RevealHeading>

        {!picked ? (
          <div className={styles.step}>
            <CourseSearchInput id="compare-pick" label="Which course are you thinking about?" selected={null} onCourseSelect={pick} />
            {popular.length > 0 && (
              <div className={styles.quick}>
                <span className="label">Or start with</span>
                {popular.map((c) => (
                  <button key={c.id} type="button" className={styles.quickPick} onClick={() => pick(c)}>{c.title}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.step}>
            <div className={styles.pickRow}>
              <div className={styles.pickedCard}>
                <span className={styles.pickedBanner}>Your pick</span>
                <span className={styles.sugTitle}>{picked.title}</span>
                <Facts course={picked} />
                <button type="button" className={styles.change} onClick={() => setPicked(null)}>Change</button>
              </div>
              <span className={`display ${styles.vs}`} aria-hidden="true">vs</span>
              <div className={styles.suggestions} aria-busy={loading} aria-label="Courses to compare it with">
                {loading && [0, 1, 2, 3].map((i) => <span key={i} className={styles.suggestionEmpty} />)}
                {!loading && related.map((c) => (
                  <Link key={c.id} href={comparePath(picked, c)} className={styles.suggestion}>
                    <span className={styles.sugTitle}>{c.title}</span>
                    <Facts course={c} />
                  </Link>
                ))}
                {!loading && related.length === 0 && <p className={styles.status}>No close matches. Search for one below.</p>}
              </div>
            </div>
            <CourseSearchInput
              id="compare-other"
              label="Or search another"
              selected={null}
              onCourseSelect={(c) => c.id !== picked.id && router.push(comparePath(picked, c))}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Compare;
