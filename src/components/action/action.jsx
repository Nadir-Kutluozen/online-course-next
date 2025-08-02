import React, { useState } from "react";
import CourseSearchInput from "../section2/courseSearchInput";
import { renderStars } from "./helperFuncsAction";
import { renderLanguage } from "./helperFuncsAction";
import { formatUdemyUrl } from "./helperFuncsAction";
import styles from './Action.module.css';

const Action = () => {
  const [courseA, setCourseA] = useState(null);
  const [courseB, setCourseB] = useState(null);

  return (
    <>
      <div className={`py-4 ${styles.actionSection}`} id="action">
        <div className="container">
          <h2 className="pb-5 text-center display-1">Ready to compare?</h2>
          <p className="pb-5 lead text-center">
            Pick the course you would like to compare and the result will appear down below
          </p>
          <div className="row align-items-center text-center">
            <div className="col-md-5">
              <CourseSearchInput
                placeholder="Search for Course..."
                onCourseSelect={(course) => setCourseA(course)}
              />
            </div>

            <div className="col-md-2">
              <h2 className="lead">vs</h2>
            </div>

            <div className="col-md-5">
              <CourseSearchInput
                placeholder="Search Course..."
                onCourseSelect={(course) => setCourseB(course)}
              />
            </div>
          </div>
        </div>

        {courseA && courseB && (
          <div className={`mt-5 container text-center ${styles.comparisonResults}`}>
            <h4 className="text-center my-5 display-6">Course Comparison</h4>

            <div className="row justify-content-center mb-4">
              <div className="col-md-5 text-center">
                <img
                  src={courseA.image}
                  alt={courseA.title}
                  className={`img-fluid mb-3 ${styles.courseImageComp}`}
                />
              </div>
              <div className="col-md-1 d-flex align-items-center justify-content-center">
                <h2 className="lead">vs</h2>
              </div>
              <div className="col-md-5 text-center">
                <img
                  src={courseB.image}
                  alt={courseB.title}
                  className={`img-fluid mb-3 ${styles.courseImageComp}`}
                />
              </div>
            </div>

            <div className="table-responsive-sm">
              <table className="table rounded text-center mx-auto align-middle">
                <thead className="table-white">
                  <tr>
                    <th></th>
                    <th>{courseA.title}</th>
                    <th>{courseB.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <i className={`bi bi-currency-dollar me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>${courseA.price}</td>
                    <td>${courseB.price}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-star-fill me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{renderStars(courseA.rating)}</td>
                    <td>{renderStars(courseB.rating)}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-clock me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{courseA.course_length}</td>
                    <td>{courseB.course_length}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-info-circle me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{courseA.headline}</td>
                    <td>{courseB.headline}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-person-video3 me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{courseA.instructor_names}</td>
                    <td>{courseB.instructor_names}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-diagram-3-fill me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{courseA.level}</td>
                    <td>{courseB.level}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-translate me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>{renderLanguage(courseA.locale)}</td>
                    <td>{renderLanguage(courseB.locale)}</td>
                  </tr>
                  <tr>
                    <td>
                      <i className={`bi bi-link-45deg me-2 ${styles.iconStyle}`}></i>
                    </td>
                    <td>
                      <a
                        href={formatUdemyUrl(courseA.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-custom"
                      >
                        Learn More about Course
                      </a>
                    </td>
                    <td>
                      <a
                        href={formatUdemyUrl(courseB.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-custom"
                      >
                        Learn More about Course
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Action;
