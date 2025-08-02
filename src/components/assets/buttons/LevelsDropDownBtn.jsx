import React from 'react';

const LevelsDropDownBtn = ({ onSelectLevel, label }) => {
  return (
    <div className="dropdown">
      <a 
        className="btn btn-sm rounded-5 dropdown-toggle btn-outline-dark" 
        href="#" 
        role="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        {label}
      </a>

      <ul className="dropdown-menu">
        <li><button className="dropdown-item" onClick={() => onSelectLevel("Beginner")}>Beginner</button></li>
        <li><button className="dropdown-item" onClick={() => onSelectLevel("Intermediate")}>Intermediate</button></li>
        <li><button className="dropdown-item" onClick={() => onSelectLevel("Expert")}>Expert</button></li>
        <li><button className="dropdown-item" onClick={() => onSelectLevel("")}>All Levels</button></li>
      </ul>
    </div>
  );
};

export default LevelsDropDownBtn;
