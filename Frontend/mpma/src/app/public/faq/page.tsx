"use client";
import React from "react";
import ThemeToggle from "@/app/facultyMember/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ! FAQ Page Component
 *
 * * This component renders the Frequently Asked Questions page for the MPMA LMS
 * * Provides answers to common questions about using the platform
 * * Uses collapsible accordion UI for better readability and organization
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Accordion list of questions and answers
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered FAQ page
 */
const FAQPage = () => {
  const router = useRouter();

  // * FAQ data object with questions and answers
  // * Can be expanded in the future or loaded from an API
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your registered email address.",
    },
    {
      question: "Where can I find my course materials?",
      answer:
        "Once logged in, navigate to the 'My Courses' section. Select your course, and you will find all relevant materials, assignments, and announcements.",
    },
    {
      question: "How do I submit an assignment?",
      answer:
        "Go to the specific assignment page within your course. You will find an option to upload your file(s). Ensure you submit before the deadline.",
    },
    {
      question: "Who do I contact for technical issues?",
      answer:
        "For technical support, please email support.lms@mpma.lk or visit the Contact Us page for more details.",
    },
  ];

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
        <div className="hero-content text-center w-full max-w-3xl">
          <div className="relative w-full">
            {/* * Theme toggle positioned at the top-right corner */}
            <div className="absolute top-[-4rem] right-0 z-20">
              <ThemeToggle />
            </div>
            <div className="w-full">
              <h1 className="text-4xl font-bold mb-8">
                Frequently Asked Questions (FAQ)
              </h1>
              {/* * Accordion container for FAQs */}
              <div className="space-y-4 text-left">
                {/* * Map through FAQ items to create accordion items */}
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="collapse collapse-plus bg-base-100"
                  >
                    <input
                      type="radio"
                      name="my-accordion-3"
                      defaultChecked={index === 0}
                    />
                    {/* ? Question title in the accordion header */}
                    <div className="collapse-title text-xl font-medium">
                      {faq.question}
                    </div>
                    {/* ? Answer in the accordion content */}
                    <div className="collapse-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
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

export default FAQPage;
