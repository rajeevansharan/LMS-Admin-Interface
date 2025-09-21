import Link from "next/link";
import React from "react";

// ! Course module card component for faculty dashboard
// ! Displays individual course as an interactive card
// * This component creates clickable course entries that navigate to course details
interface ModuleListingProps {
  ModuleName: string; // Display name of the course/module
  ModuleLink: string; // Navigation link to the course details page
}

const ModuleListing = ({ ModuleName, ModuleLink }: ModuleListingProps) => {
  return (
    <div>
      <Link href={ModuleLink}>
        {/*
         * Styled card with hover effect for better user interaction
         * Uses theme-aware colors from the application's color scheme
         */}
        <div className="border-2 text-lg border-borderColor p-4 bg-tertiary hover:bg-quaternary text-foreground rounded-lg">
          {ModuleName}
        </div>
      </Link>
    </div>
  );
};

// TODO: Consider adding additional course metadata like student count, date, etc.
export default ModuleListing;
