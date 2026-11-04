import React, { useState } from "react";
import CourseSearchInput from "./CourseSearchInput";
import { RevealHeading } from "../motion/Reveal";
import Link from "next/link";
import { coursePath, formatPrice, formatRating, languageName } from "../../lib/format";
import styles from "./Compare.module.css";

const ROWS = [
  ["Platform", (c) => c.platform],
  ["Price", formatPrice],
  ["Rating", formatRating],
  ["Level", (c) => c.level],
  ["Length", (c) => c.course_length],
  ["Taught by", (c) => c.instructor_names],
  ["Language", (c) => languageName(c.locale)],
];

// Opens with a real example pair already compared; visitors swap in their own.
const Compare = ({ initialPair = [] }) => {
  const [courseA, setCourseA] = useState(initialPair[0] || null);
  const [courseB, setCourseB] = useState(initialPair[1] || null);
  const courses = [courseA, courseB];

  return (
    <section id="compare" className="wrap section">
      <div className={styles.panel}>
        <RevealHeading>Put two courses <span className="outline" style={{ "--stroke": "var(--ink)" }}>side by side</span></RevealHeading>
        <p className={styles.lede}>Search for two courses and compare the price, rating, level, length and who teaches them.</p>

        <div className={styles.pickers}>
          <CourseSearchInput id="compare-a" label="First course" selected={courseA} onCourseSelect={setCourseA} />
          <span className={`display ${styles.vs}`} aria-hidden="true">vs</span>
          <CourseSearchInput id="compare-b" label="Second course" selected={courseB} onCourseSelect={setCourseB} />
        </div>

        {(courseA || courseB) && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Detail</span></th>
                  {courses.map((c, i) => (
                    <th scope="col" key={i}>
                      {c ? (
                        <Link href={coursePath(c)}>{c.title}</Link>
                      ) : (
                        <span className={styles.empty}>Pick a {i === 0 ? "first" : "second"} course</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row" className="label">{label}</th>
                    {courses.map((c, i) => (
                      <td key={i}>{c ? value(c) || "Not listed" : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Compare;
