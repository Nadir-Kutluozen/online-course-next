import React from 'react';

const PlatformDropDownBtn = ({ onSelectPlatform, label }) => {
  return (
    <div className="dropdown">
<button 
  type="button"
  className="btn btn-sm rounded-5 dropdown-toggle btn-outline-dark" 
  data-bs-toggle="dropdown" 
  aria-expanded="false"
>
  {label}
</button>

      <ul className="dropdown-menu">
        <li><button className="dropdown-item" 
        onClick={() => {
          console.log("Selected: Udemy");
          onSelectPlatform("Udemy");
          }}
          >
            Udemy
          </button>
          </li>
        <li><button className="dropdown-item" onClick={() => onSelectPlatform("Coursera")}>Coursera</button></li>
      </ul>
    </div>
  );
};

export default PlatformDropDownBtn;
