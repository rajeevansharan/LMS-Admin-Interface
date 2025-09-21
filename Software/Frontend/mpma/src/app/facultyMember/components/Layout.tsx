import React from "react";
import STHeader from "./STHeader";
import STFooter from "./STFooter";

// ! Primary layout wrapper for all faculty member pages
// ! Provides consistent header, footer, and content structure
// * This component ensures UI consistency across the faculty section
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with navigation and user controls */}
      <STHeader />

      {/* Main content area with flexible growth */}
      <main className="flex-grow">{children}</main>

      {/* Footer with copyright and additional links */}
      <STFooter />
    </div>
  );
};

export default Layout;
