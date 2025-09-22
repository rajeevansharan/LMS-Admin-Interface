"use client";
import React, { useState } from "react";
import ToggleButton from "./ToggleButton";

// ! Commented out interface, consider removing if not used
// interface SectionContentItem {
//   title: string;
//   content: string;
//   isDeletable?: boolean;
//   isHideable?: boolean;
// }

// * Interface defining the props for the SectionWrapper component
// * This component acts as a container for sections with visibility controls
interface SectionWrapperProps {
  sectionName: string; // Name displayed in the section header
  isDeletable?: boolean; // Whether the section can be deleted
  isHideable?: boolean; // Whether the section can be hidden/shown
  onRemove?: () => void; // Callback when section is removed
  children: React.ReactNode; // Content inside the section
}

/**
 * ! SectionWrapper provides a consistent container for content sections
 * ! Used throughout the course module pages to organize content
 */
export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sectionName,
  isDeletable = false,
  isHideable = false,
  onRemove,
  children,
}) => {
  // ? State to track whether section content is currently hidden
  const [isSectionHidden, setIsSectionHidden] = useState(false);

  // ? Handler to toggle the visibility state
  const toggleSectionVisibility = () => {
    setIsSectionHidden(!isSectionHidden);
  };

  return (
    <div className="p-6">
      {/* Section container with conditional styling based on visibility */}
      <div
        className={`border-2 border-borderColor p-4 ${isSectionHidden ? "bg-primary/50" : "bg-primary"}`}
      >
        {/* Section header with title and controls */}
        <div className="flex">
          <div className="flex w-full p-3 bg-background/80 rounded">
            <div className="flex-1">
              {sectionName} {isSectionHidden ? "[Hidden]" : ""}
            </div>
            <div className="px-6">
              <div className="flex space-x-2">
                {/* TODO: Add tooltip to explain the hide/show functionality */}
                {isHideable && (
                  <ToggleButton
                    isHidden={isSectionHidden}
                    onClick={toggleSectionVisibility}
                  />
                )}
                {/* TODO: Add confirmation dialog before removal */}
                {isDeletable && (
                  <button className="btn btn-xs btn-warning" onClick={onRemove}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conditionally render children based on visibility state */}
        {!isSectionHidden && <>{children}</>}
      </div>
    </div>
  );
};
