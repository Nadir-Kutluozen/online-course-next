import React, { useRef, useState } from "react";
import styles from './Button.module.css';

const DynamicButton = ({ children }) => {
  const buttonRef = useRef(null);
  const [hoverDir, setHoverDir] = useState("left");
  const [hovering, setHovering] = useState(false);

  const getDirection = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    return e.clientX - rect.left < rect.width / 2 ? "left" : "right";
  };

  const handleMouseEnter = (e) => {
    setHoverDir(getDirection(e));
    setHovering(true);
  };

  const handleMouseLeave = (e) => {
    setHoverDir(getDirection(e)); // keep origin same as exit
    setHovering(false);
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${styles.dynamicButton} rounded-5 ${styles[hoverDir]} ${hovering ? styles.hovering : ''}`}
    >
      <span>{children}</span>
    </button>
  );
};

export default DynamicButton;
