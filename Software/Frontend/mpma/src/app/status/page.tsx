"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../facultyMember/components/ThemeToggle";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

/**
 * ! Status Page Component
 *
 * * This component monitors and displays the backend service availability
 * * Provides real-time feedback about API connectivity to users
 * * Includes a manual refresh option to check current status
 * * Auto-refreshes status every 10 seconds
 * * Rate-limited to prevent more than 3 manual refreshes in 5 seconds
 *
 * ? Component Structure:
 * ? - Hero section with theme toggle
 * ? - Status card with dynamic state indicators
 * ? - Footer with links to other public pages
 *
 * @returns {JSX.Element} The rendered Status page
 */
const StatusPage = () => {
  const router = useRouter();
  // ? State variables to track backend status and loading state
  const [isUp, setIsUp] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>("");

  // ? Rate limiting state
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // ? Array to track timestamps of manual refresh clicks
  const clickTimestamps = useRef<number[]>([]);
  const rateLimitTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * * Attempts to connect to the backend API to determine if it's available
   * * Updates state variables based on the connection result
   * * Uses a no-cors fetch to avoid cross-origin restrictions
   */
  const checkWebsite = async (isManualRefresh = false) => {
    // If it's a manual refresh, add a small delay before showing loading state
    // This gives time for animations to complete
    if (isManualRefresh) {
      // Keep the previous state visible for a short time
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsLoading(true);
    try {
      // ! This approach might be limited by CORS restrictions
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${apiBaseUrl}/`, {
        mode: "no-cors", // Helps with CORS but returns opaque response
        cache: "no-store", // Prevents caching of status checks
      });
      setIsUp(true);
    } catch (error) {
      console.error("Error fetching the website:", error);
      // If the fetch fails, we assume the website is down
      setIsUp(false);
    } finally {
      // Add a small delay before hiding the loading state to ensure smooth transition
      if (isManualRefresh) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setIsLoading(false);
      // Update last checked timestamp
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  /**
   * * Rate-limited handler for the manual refresh button
   * * Limits to maximum 3 clicks within 5 seconds
   */
  const handleManualRefresh = () => {
    const now = Date.now();
    const fiveSecondsAgo = now - 5000;

    // Remove timestamps older than 5 seconds
    const recentClicks = clickTimestamps.current.filter(
      (timestamp) => timestamp > fiveSecondsAgo,
    );

    // Add current click timestamp
    recentClicks.push(now);
    clickTimestamps.current = recentClicks;

    // Check if rate limit exceeded
    if (recentClicks.length > 3) {
      setIsRateLimited(true);
      setRemainingTime(5); // 5 seconds cooldown

      // Start countdown timer
      if (rateLimitTimer.current) {
        clearInterval(rateLimitTimer.current);
      }

      rateLimitTimer.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(rateLimitTimer.current as NodeJS.Timeout);
            setIsRateLimited(false);
            // Reset click timestamps
            clickTimestamps.current = [];
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return;
    }

    // If not rate limited, perform the check with manual refresh flag
    checkWebsite(true);
  };

  // * Automatically check backend status when the component mounts
  // * and set up interval to check every 10 seconds
  useEffect(() => {
    // Initial check
    checkWebsite();

    // Set up auto-refresh interval (10 seconds = 10000ms)
    const intervalId = setInterval(() => {
      checkWebsite();
    }, 10000);

    // Clean up interval on component unmount to prevent memory leaks
    return () => {
      clearInterval(intervalId);
      if (rateLimitTimer.current) {
        clearInterval(rateLimitTimer.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* ! Hero Section with full-viewport height */}
      <div className="hero min-h-screen bg-base-200">
        {/* Add Homepage button with back arrow icon to the top left */}
        <div className="absolute top-4 left-4 z-20">
          <button className="btn" onClick={() => router.push("/")}>
            <FaArrowLeft className="h-5 w-5 mr-2" />
            Homepage
          </button>
        </div>
        <div className="hero-content text-center">
          <div className="relative">
            {/* * Theme toggle positioned at the top-right corner */}
            <div className="absolute top-[-4rem] right-[-4rem] z-20">
              <ThemeToggle />
            </div>
            {/* * Status Card UI */}
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Backend Status</h2>

                {/* * Status display section with fixed height to prevent layout shifts */}
                <div className="min-h-[120px] flex items-center justify-center relative">
                  {/* ? Success state - backend is available */}
                  <div
                    className={`alert alert-success w-full absolute top-0 left-0 transform transition-all duration-300 ease-in-out ${
                      isUp === true
                        ? "opacity-100 z-10 translate-y-0"
                        : "opacity-0 -z-10 translate-y-2"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Backend is up and running!</span>
                  </div>

                  {/* ? Error state - backend is unavailable */}
                  <div
                    className={`alert alert-error w-full absolute top-0 left-0 transform transition-all duration-300 ease-in-out ${
                      isUp === false
                        ? "opacity-100 z-10 translate-y-0"
                        : "opacity-0 -z-10 translate-y-2"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Backend appears to be down or unreachable.</span>
                  </div>

                  {/* ? Loading state indicator */}
                  <div
                    className={`flex flex-col items-center py-4 w-full absolute top-0 left-0 transform transition-all duration-300 ease-in-out ${
                      isLoading
                        ? "opacity-100 z-20 translate-y-0"
                        : "opacity-0 -z-10 translate-y-2"
                    }`}
                  ></div>
                </div>

                {/* * Manual refresh button - kept outside of status display to remain stable */}
                <div className="card-actions justify-center mt-4">
                  <button
                    onClick={handleManualRefresh}
                    className={`btn transition-all duration-300 ease-in-out ${isLoading || isRateLimited ? "btn-disabled" : "btn-primary"}`}
                    disabled={isLoading || isRateLimited}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : isRateLimited ? (
                      <span>
                        <FaExclamationTriangle className="inline-block mr-1" />
                        Wait {remainingTime}s
                      </span>
                    ) : (
                      "Check Again"
                    )}
                  </button>
                </div>

                {/* * Timestamp showing when status was last checked */}
                <div className="text-xs text-center mt-2 text-base-content/70">
                  {isUp !== null && !isLoading && (
                    <span>Last checked: {lastChecked}</span>
                  )}
                </div>
                {/* * Auto-refresh indicator */}
                <div className="text-xs text-center mt-1 text-base-content/60">
                  <span>Auto-refreshes every 10 seconds</span>
                </div>
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

export default StatusPage;
