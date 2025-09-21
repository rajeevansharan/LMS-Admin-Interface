import React from "react";
import StudentHeader from "./components/StudentHeader";
import StudentFooter from "./components/StudentFooter";

// ! Primary layout wrapper for all student pages
// ! Provides consistent header, footer, and content structure
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header for the student interface */}
      <StudentHeader />

      {/* Main content area */}
      <main className="flex-grow">{children}</main>

      {/* Footer for the student interface */}
      <StudentFooter />
    </div>
  );
};

export default Layout;
