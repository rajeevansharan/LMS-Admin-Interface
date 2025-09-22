"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import ContentHeader from "./ContentHeader";

// * Interface defining props for the ContentHeaderWrapper component
// * Controls behavior and appearance of content headers with visibility toggling
interface ContentHeaderWrapperProps {
  // --- MODIFIED: Changed from 'string' to 'React.ReactNode' ---
  title: React.ReactNode; // Title can now be a string, a link, or any other React element
  content: string; // Main content text or URL link
  children?: ReactNode; // Additional content to render inside wrapper
}

// ! ContentHeaderWrapper is a higher-order component that wraps ContentHeader
// ! Provides containers for content display
export const ContentHeaderWrapper: React.FC<ContentHeaderWrapperProps> = ({
  title,
  content,
  children,
}) => {
  // * Render content container
  return (
    <div className="border-2 border-borderColor p-4 bg-tertiary hover:bg-quaternary rounded-md">
      <div className="flex justify-between items-center">
        {/* TODO: Consider adding validation for URLs to prevent malformed links */}
        {/* Detect if content is a URL and render as link if it is */}
        {content.startsWith("/") || content.startsWith("http") ? (
          <Link href={content} className="flex-grow">
            <ContentHeader
              title={title} // Pass the flexible title down
              isHidden={false}
            />
          </Link>
        ) : (
          <div className="flex-grow">
            <ContentHeader
              title={title} // Pass the flexible title down
              isHidden={false}
            />
            {/* Display regular text content */}
            <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              {content}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
