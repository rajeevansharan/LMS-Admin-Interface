"use client";
import React from "react";
import ThemeToggle from "@/app/facultyMember/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ! Terms of Use Page Component
 *
 * * This component renders the Terms of Use page for the MPMA LMS
 * * Contains the legal agreement that users must accept to use the platform
 * * Outlines user responsibilities, limitations, and intellectual property rights
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Multiple sections covering different aspects of the terms
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered Terms of Use page
 */
const TermsPage = () => {
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
              <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
              <div className="prose lg:prose-xl max-w-none">
                {/* * Last updated timestamp that shows when terms were last modified */}
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                {/* * Section 1: Acceptance of Terms */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the Mahapola Ports and Maritime Academy
                  (MPMA) Learning Management System (LMS), you agree to be bound
                  by these Terms of Use (&quot;Terms&quot;). If you do not agree
                  to these Terms, please do not use the LMS.
                </p>

                {/* * Section 2: Use of the LMS */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  2. Use of the LMS
                </h2>
                <p>
                  The LMS is intended for educational and training purposes
                  related to MPMA programs. You agree to use the LMS only for
                  lawful purposes and in a manner that does not infringe the
                  rights of, restrict, or inhibit anyone else&apos;s use and
                  enjoyment of the LMS. Prohibited behavior includes harassing
                  or causing distress or inconvenience to any person,
                  transmitting obscene or offensive content, or disrupting the
                  normal flow of dialogue within the LMS.
                </p>

                {/* * Section 3: User Accounts */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  3. User Accounts
                </h2>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account and password and for restricting access to your
                  computer. You agree to accept responsibility for all
                  activities that occur under your account or password.
                </p>

                {/* * Section 4: Intellectual Property */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  4. Intellectual Property
                </h2>
                <p>
                  All content included on the LMS, such as text, graphics,
                  logos, images, as well as the compilation thereof, and any
                  software used on the site, is the property of MPMA or its
                  suppliers and protected by copyright and other laws.
                </p>

                {/* TODO: Add more sections on disclaimers, limitation of liability, etc. */}
                <p className="mt-6">
                  [Placeholder: More detailed terms and conditions will be added
                  here.]
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

export default TermsPage;
