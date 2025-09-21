"use client";
import React from "react";
import ThemeToggle from "@/app/facultyMember/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ! Privacy Policy Page Component
 *
 * * This component renders the Privacy Policy page for the MPMA LMS
 * * Details how user data is collected, used, and protected
 * * Provides transparency regarding data practices and user rights
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Multiple sections covering different aspects of privacy policy
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered Privacy Policy page
 */
const PrivacyPolicyPage = () => {
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
              <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
              <div className="prose lg:prose-xl max-w-none">
                {/* * Last updated timestamp that shows when policy was last modified */}
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                {/* * Section 1: Introduction */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  1. Introduction
                </h2>
                <p>
                  Mahapola Ports and Maritime Academy (MPMA) is committed to
                  protecting your privacy. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you use our Learning Management System (LMS).
                </p>

                {/* * Section 2: Information Collection */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  2. Information We Collect
                </h2>
                <p>
                  We may collect personal information that you provide directly
                  to us, such as your name, email address, student/staff ID,
                  course enrollments, and progress data. We may also collect
                  certain information automatically when you use the LMS, such
                  as your IP address, browser type, and usage patterns.
                </p>

                {/* * Section 3: Information Usage */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, operate, and maintain the LMS</li>
                  <li>Manage your account and provide customer support</li>
                  <li>Track your progress and performance in courses</li>
                  <li>Communicate with you about your account or courses</li>
                  <li>Improve and personalize the LMS</li>
                  <li>Comply with legal obligations</li>
                </ul>

                {/* * Section 4: Information Sharing */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  4. Information Sharing
                </h2>
                <p>
                  We do not sell your personal information. We may share
                  information with instructors, administrators, or third-party
                  service providers who assist us in operating the LMS,
                  conducting our business, or serving our users, so long as
                  those parties agree to keep this information confidential. We
                  may also release information when its release is appropriate
                  to comply with the law, enforce our site policies, or protect
                  ours or others&apos; rights, property, or safety.
                </p>

                {/* TODO: Add more sections on data security, retention policies, user rights, cookies, etc. */}
                <p className="mt-6">
                  [Placeholder: More detailed privacy policy information will be
                  added here.]
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

export default PrivacyPolicyPage;
