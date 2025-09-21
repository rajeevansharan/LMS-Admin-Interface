"use client";

import React, { useEffect, useState } from "react";
import { Submission } from "@/types/Submission";
import { SubmissionService } from "@/services/SubmissionService";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

// Define the props the modal will accept
interface GradingModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onGradeSaved: (updatedSubmission: Submission) => void;
}

export const GradingModal = ({
  submission,
  isOpen,
  onClose,
  onGradeSaved,
}: GradingModalProps) => {
  const { token } = useAuth();

  // API URL configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // State for the form inputs
  const [marks, setMarks] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  // State for handling the save operation
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This useEffect hook will run whenever the `submission` prop changes.
  useEffect(() => {
    // If we have a new submission, update the internal state of the modal.
    if (submission) {
      setMarks(submission.marksObtained?.toString() || "");
      setFeedback(submission.feedback || "");
      setError(null); // Also reset any previous errors
    }
  }, [submission]); // The dependency array ensures this runs when `submission` changes.

  if (!isOpen || !submission) {
    return null; // Don't render anything if the modal is not open or no submission is selected
  }

  const handleDownload = async () => {
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      // Make the API call using axios, manually adding the Authorization header
      const response = await axios.get(
        `${API_URL}/api/submissions/${submission.submissionId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request
          },
          responseType: "blob", // This is critical - it tells axios to expect a file
        },
      );

      // Create a URL for the blob object from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Extract filename from the Content-Disposition header, or use a default
      let filename = `${submission.studentName}_submission`;
      const contentDisposition = response.headers["content-disposition"];
      console.log("DEBUG: Content-Disposition header:", contentDisposition);
      console.log("DEBUG: All response headers:", response.headers);

      if (contentDisposition && contentDisposition.includes("filename=")) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          // Use the original filename from the server, but prefix it with student name
          const originalFilename = filenameMatch[1];
          const extension = originalFilename.substring(
            originalFilename.lastIndexOf("."),
          );
          filename = `${submission.studentName}_submission${extension}`;
          console.log("DEBUG: Original filename:", originalFilename);
          console.log("DEBUG: Extracted extension:", extension);
          console.log("DEBUG: Final filename:", filename);
        }
      } else {
        console.log(
          "DEBUG: No Content-Disposition header found or no filename in header",
        );
      }

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);

      // Programmatically click the link
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError(
        "Failed to download the file. Please check your connection or permissions.",
      );
    }
  };

  const handleSaveGrade = async () => {
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const marksValue = parseFloat(marks);
      if (isNaN(marksValue)) {
        throw new Error("Marks must be a valid number.");
      }

      const updatedSubmission = await SubmissionService.gradeSubmission(
        submission.submissionId,
        { marksObtained: marksValue, feedback: feedback },
        token,
      );

      onGradeSaved(updatedSubmission); // Send the updated data back to the parent page
      onClose(); // Close the modal on success
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // DaisyUI modal structure
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Grade Submission from {submission.studentName}
        </h3>
        <p className="py-2">
          Submitted on: {new Date(submission.submissionDate).toLocaleString()}
        </p>

        {/* File Download Section */}
        {submission.filePath && (
          <div className="card bg-base-200 mt-4">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="badge badge-info badge-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">File Submitted</p>
                    <p className="text-xs text-base-content/70">
                      Click to download student&apos;s submission
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm gap-2"
                  onClick={handleDownload}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grading Form */}
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Marks Obtained</span>
          </label>
          <input
            type="number"
            placeholder="Enter marks"
            className="input input-bordered w-full"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text">Feedback</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Provide feedback to the student"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        {/* Display any saving errors */}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Modal Actions */}
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${isSaving ? "loading" : ""}`}
            onClick={handleSaveGrade}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  );
};
