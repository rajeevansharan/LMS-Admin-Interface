"use client";
import React from "react";
import ThemeToggle from "@/app/facultyMember/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ! About Page Component
 *
 * * This component renders the About page for the MPMA LMS
 * * Provides general information about the learning management system,
 * * its mission, features, and development team.
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Content section with mission statement and features
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered About page
 */
const AboutPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-base-100 text-base-content">
      {/* ! Hero Section with full-viewport height */}
      <div className="hero min-h-screen bg-base-200">
        {/* Add Homepage button with back arrow icon to the top left */}
        <div className="absolute top-4 left-4 z-20">
          <button className="btn" onClick={() => router.push("/")}>
            <FaArrowLeft className="h-5 w-5 mr-2" />
            Homepage
          </button>
        </div>
        <div className="hero-content text-left w-full max-w-4xl">
          <div className="relative w-full">
            {/* * Theme toggle positioned at the top-right corner */}
            <div className="absolute top-[-4rem] right-0 z-20">
              <ThemeToggle />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-6">About MPMA LMS</h1>
              <div className="prose lg:prose-xl max-w-none">
                {/* * Main content description */}
                <p>
                  Welcome to the Mahapola Ports and Maritime Academy (MPMA)
                  Learning Management System (LMS). This platform is designed to
                  facilitate learning and training for students, lecturers, and
                  industry professionals involved with MPMA.
                </p>

                {/* * Mission section */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  Our Mission
                </h2>
                <p>
                  Our mission is to provide a seamless, efficient, and engaging
                  online learning environment that supports the educational
                  goals of MPMA and its stakeholders. We aim to bridge the gap
                  between academic learning and practical industry application.
                </p>

                {/* * Key features section */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  Key Features
                </h2>
                <ul>
                  <li>Course Management for Lecturers</li>
                  <li>Student Enrollment and Progress Tracking</li>
                  <li>On-the-Job Training (OJT) Coordination</li>
                  <li>Document Management System (DMS)</li>
                  <li>Communication Tools</li>
                  <li>Reporting and Analytics</li>
                </ul>

                {/* * Development information */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  Development
                </h2>
                <p>
                  This LMS was developed as a 2nd Year Software Project by
                  students from the Faculty of Information Technology,
                  University of Moratuwa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ! Footer Section */}
      <Footer />
    </div>
  );
};

export default AboutPage;
