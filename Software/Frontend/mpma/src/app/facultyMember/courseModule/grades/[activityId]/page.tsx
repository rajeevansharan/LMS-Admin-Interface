"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Layout from "../../../components/Layout";
import { Submission } from "@/types/Submission";
import { SubmissionService } from "@/services/SubmissionService";
import { useAuth } from "@/contexts/AuthContext";
import { GradingModal } from "./components/GradingModal";
import Link from "next/link"; // Make sure Link is imported

// Component to render a styled status badge
const StatusBadge = ({ status }: { status: Submission["status"] }) => {
  const baseClasses = "badge badge-md";
  const statusClasses = {
    GRADED: "badge-success",
    SUBMITTED: "badge-warning",
    LATE: "badge-error",
    REJECTED: "badge-neutral",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const SubmissionGradingPage = () => {
  // --- HOOKS AND STATE MANAGEMENT ---
  const params = useParams();
  const searchParams = useSearchParams();

  const activityId = params.activityId as string;
  const activityTitle = searchParams.get("title");
  const activityType = searchParams.get("type"); // <-- GET THE ACTIVITY TYPE FROM THE URL

  const { token } = useAuth();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (activityId && token) {
      const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
          const data = await SubmissionService.getSubmissionsByActivityId(
            activityId,
            token,
          );
          setSubmissions(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching submissions:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubmissions();
    } else if (!token) {
      setError("Authenticating...");
      setIsLoading(true);
    }
  }, [activityId, token]);

  // --- MODAL HANDLERS ---
  const handleOpenModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleGradeSaved = (updatedSubmission: Submission) => {
    // Find the submission in our list and replace it with the updated version
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((sub) =>
        sub.submissionId === updatedSubmission.submissionId
          ? updatedSubmission
          : sub,
      ),
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Submissions for &quot;{activityTitle || `Activity ${activityId}`}
            &quot;
          </h1>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="mt-2 text-foreground">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-foreground">
              <p>No submissions found for this activity.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-base-100 border border-borderColor">
                <thead>
                  <tr className="bg-base-200 text-foreground">
                    {[
                      "Student Name",
                      "Submission Date",
                      "Status",
                      "Marks",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 border-b border-borderColor text-left text-sm font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {submissions.map((sub) => (
                    <tr
                      key={sub.submissionId}
                      className="bg-tertiary hover:bg-quaternary"
                    >
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {sub.studentName}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {new Date(sub.submissionDate).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {sub.marksObtained ?? "N/A"}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {/* --- THIS IS THE NEW CONDITIONAL LOGIC --- */}

                        {activityType === "ASSIGNMENT" ? (
                          // If it's an assignment, show the button that opens the modal
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleOpenModal(sub)}
                          >
                            View & Grade
                          </button>
                        ) : (
                          // If it's a quiz, show a link to the (future) review page
                          <Link
                            href={`/facultyMember/courseModule/grades/${activityId}/review/${sub.submissionId}?title=${encodeURIComponent(activityTitle || "")}`}
                            className="btn btn-sm bg-primary hover:bg-tertiary"
                          >
                            Review Attempt
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* The Grading Modal is now only used for assignments */}
      <GradingModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGradeSaved={handleGradeSaved}
      />
    </Layout>
  );
};

export default SubmissionGradingPage;
