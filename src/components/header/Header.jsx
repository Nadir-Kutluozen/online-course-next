import React, { useEffect } from 'react';
import Link from 'next/link';
import DynamicButton from '../assets/DynamicButton';


const Header = () => {
  // Collapse navbar on nav-item click
  useEffect(() => {
    // Only run this after Bootstrap JS is loaded
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
      const navLinks = document.querySelectorAll('.navbar-collapse .nav-link, .navbar-collapse a');
      const collapseEl = document.getElementById('navbarNav');
  
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          const collapseInstance = new bootstrap.Collapse(collapseEl, {
            toggle: false,
          });
          collapseInstance.hide();
        });
      });
  
      return () => {
        navLinks.forEach((link) => {
          link.removeEventListener('click', () => {});
        });
      };
    });
  }, []);
  
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow px-3">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <img src="./logo.svg" alt="Logo" style={{ height: '40px' }} className="me-2" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav mx-auto text-center gap-3">
            <li className="nav-item">
              <Link href="/" className="nav-link lead">
                <DynamicButton>Home</DynamicButton>
              </Link>
            </li>
            <li className="nav-item">
              <a href="/#action" className="nav-link">
                <DynamicButton>Compare</DynamicButton>
              </a>
            </li>
            <li className="nav-item">
              <Link href="/courses" className="nav-link lead">
                <DynamicButton>Courses</DynamicButton>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/free-courses" className="nav-link lead">
                <DynamicButton>Free Courses</DynamicButton>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link lead">
                <DynamicButton>About</DynamicButton>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
