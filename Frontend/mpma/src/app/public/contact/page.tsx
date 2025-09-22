"use client";
import React from "react";
import ThemeToggle from "@/app/facultyMember/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ! Contact Page Component
 *
 * * This component renders the Contact page for the MPMA LMS
 * * Provides contact information for various departments and support channels
 * * Serves as a central hub for users to find ways to get assistance
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Contact information sections for different purposes
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered Contact page
 */
const ContactPage = () => {
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
              <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
              <div className="prose lg:prose-xl max-w-none">
                {/* * Introduction to contact channels */}
                <p>
                  If you have any questions, feedback, or require support
                  regarding the MPMA LMS, please reach out through the following
                  channels:
                </p>

                {/* * General inquiries section */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  General Inquiries
                </h2>
                <p>
                  For general questions about the LMS or MPMA programs:
                  <br />
                  Email: <a href="mailto:info@mpma.lk">info@mpma.lk</a>
                  <br />
                  Phone: +94 (0) XX XXX XXXX
                </p>

                {/* * Technical support section */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  Technical Support
                </h2>
                <p>
                  For technical issues or assistance with using the platform:
                  <br />
                  Email:{" "}
                  <a href="mailto:support.lms@mpma.lk">support.lms@mpma.lk</a>
                  {/* TODO: Implement contact form component in future iteration */}
                </p>

                {/* * Development team contact info */}
                <h2 className="text-2xl font-semibold mt-6 mb-3">
                  Development Team (UoM)
                </h2>
                <p>
                  For inquiries related to the development project:
                  <br />
                  Contact: Faculty of Information Technology, University of
                  Moratuwa.
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

export default ContactPage;
