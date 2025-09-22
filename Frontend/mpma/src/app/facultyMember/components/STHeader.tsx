"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useRouter } from "next/navigation"; // Import useRouter
// import CustomButton from "./CustomButton";
import ThemeToggle from "./ThemeToggle";
// import styles from "./STHeader.module.css";

// ! Main navigation header for faculty member interface
// ! Contains branding, navigation controls, user menu, and theme toggle
const STHeader = () => {
  // ? Authentication hooks for user session management
  const { logout } = useAuth(); // Get logout function
  const router = useRouter(); // Get router instance

  // * Handles user logout and redirects to the login page
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div>
      <div className="navbar bg-quaternary">
        {/* Left section - Mobile menu and logo */}
        <div className="navbar-start">
          {/* Mobile hamburger menu */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
          </div>

          {/* Application logo with home link */}
          <Link href="" className="btn-ghost text-xl">
            <Image
              src="/mpma_logo.png"
              alt="Example image"
              height={100}
              width={400}
            />
          </Link>
        </div>

        {/* Center section - For desktop navigation links (currently empty) */}
        <div className="navbar-center hidden lg:flex"></div>

        {/* Right section - User controls */}
        <div className="navbar-end">
          {/* Theme toggle component */}
          <ThemeToggle />

          {/* User profile dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            {/* User menu options */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-tertiary rounded-box z-[1] mt-3 w-32 p-2 shadow"
            >
              <li>
                <a href="/facultyMember/profile">
                  <button className="btn bg-quaternary hover:bg-tertiary btn-xs sm:btn-xs md:btn-sm lg:btn-md w-24">
                    Profile
                  </button>
                </a>
              </li>
              <li>
                <a>
                  <button className="btn bg-quaternary hover:bg-tertiary btn-xs sm:btn-xs md:btn-sm lg:btn-md w-24">
                    Settings
                  </button>
                </a>
              </li>
              <li>
                <a>
                  <button
                    onClick={handleLogout} // Add onClick handler
                    className="btn bg-quaternary hover:bg-tertiary btn-xs sm:btn-xs md:btn-sm lg:btn-md w-24"
                  >
                    Logout
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// TODO: Implement dropdown menu functionality for mobile view
// TODO: Replace placeholder profile image with actual user avatar
// TODO: Connect notification count to real-time data
export default STHeader;