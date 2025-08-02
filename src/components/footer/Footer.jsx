
import React from 'react';

const Footer = () => {
  return (
    <>
      <hr className="footer-line" />
      <footer className="bg-ligth text-dark py-4 mt-5">
  <div className="container text-center">
    <p className="mb-1">&copy; {new Date().getFullYear()} OnlineCourseCompare</p>
    <p className="mb-1">
      <a href="/about" className=" text-decoration-none me-3">About</a>
      <a href="/courses" className=" text-decoration-none me-3">Courses</a>
      <a href="/free-courses" className=" text-decoration-none me-3">Free Courses</a>
      <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
    </p>
    <p className="small text-muted">Compare courses from trusted platforms like Udemy, Coursera, and more. Find the right course for your learning goals.</p>
  </div>
</footer>
    </>
  );
};
export default Footer;



