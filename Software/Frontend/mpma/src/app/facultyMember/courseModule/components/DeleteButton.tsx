import React from "react";

// ! DeleteButton is a reusable UI component for deletion actions
// ! It displays a red X icon that can trigger a deletion action
interface DeleteButtonProps {
  action?: () => void; // Optional callback function for the deletion action
}

/**
 * * Simple button component that renders a red X icon
 * * Used for deletion operations throughout the faculty interface
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({ action }) => {
  // ? This component can be extended with confirmation dialogs
  return (
    <div>
      {/* TODO: Add confirmation dialog to prevent accidental deletions */}
      <button className="p-4" onClick={action}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="red"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default DeleteButton;
