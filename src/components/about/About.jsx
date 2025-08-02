// src/pages/About.jsx
import React from 'react';
import { BookOpen, Target, Users, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4 totheleft display-1">About</h1>

      <p className="lead mb-5">
        I built <strong>OnlineCourseCompare</strong> as a personal project while studying computer science to make it easier to find, compare, and choose online courses across platforms like Udemy and Coursera.
      </p>

      <div className="row g-4">
        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100 d-flex flex-column justify-content-between">
            <div>
              <BookOpen className="mb-2 text-primary" size={32} />
              <h4 className="fw-bold">What I Made</h4>
              <p className="text-muted">
                This tool pulls real data ratings, prices, instructors, topics and lets you compare courses side by side so you can decide smarter.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100 d-flex flex-column justify-content-between">
            <div>
              <Target className="mb-2 text-danger" size={32} />
              <h4 className="fw-bold">Why I Built It</h4>
              <p className="text-muted">
                As a student, I got overwhelmed by all the courses out there. I wanted a simple, clean way to compare them so I made one myself.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100 d-flex flex-column justify-content-between">
            <div>
              <Users className="mb-2 text-success" size={32} />
              <h4 className="fw-bold">Who It's For</h4>
              <p className="text-muted">
                 Its for students who just starting out, switching courses, or leveling up their skills, mainly computer science students.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100 d-flex flex-column justify-content-between">
            <div>
              <Lightbulb className="mb-2 text-warning" size={32} />
              <h4 className="fw-bold">The Bigger Idea</h4>
              <p className="text-muted">
              I’ve always felt like finding the right course shouldn’t be so complicated. This project is my way of making things simpler so anyone can compare options easily and actually feel confident about what they’re signing up for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
