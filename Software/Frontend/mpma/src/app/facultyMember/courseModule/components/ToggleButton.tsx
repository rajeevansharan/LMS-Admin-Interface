"use client";

import React from "react";

// * Interface for props accepted by the ToggleButton component
// * Defines the API surface for this reusable UI element
interface ToggleButtonProps {
  isHidden: boolean; // Current visibility state
  onClick: (e: React.MouseEvent) => void; // Click handler function
  className?: string; // Optional CSS class customization
}

// ! ToggleButton is a reusable UI control for toggling visibility
// ! It displays either "Show" or "Hide" based on the current state
const ToggleButton: React.FC<ToggleButtonProps> = ({
  isHidden,
  onClick,
  className = "btn btn-xs btn-info mr-2",
}) => {
  // ? Custom click handler to prevent event propagation
  // ? This ensures parent elements don't also handle the click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  // TODO: Consider adding accessibility attributes (aria-*) for better screen reader support
  return (
    <button className={className} onClick={handleClick}>
      {isHidden ? "Show" : "Hide"}
    </button>
  );
};

export default ToggleButton;
