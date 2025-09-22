"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CourseService } from "@/services/CourseService";
import { SubmissionService } from "@/services/SubmissionService";
import { AssignmentMaterial } from "@/types/Material";
import { Submission } from "@/types/Submission";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";

// Main Component
const AssignmentSubmissionPageComponent: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { token, user } = useAuth();

  const assignmentId = params.assignmentId as string;
  const courseId = searchParams.get("courseId");

  const [assignment, setAssignment] = useState<AssignmentMaterial | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<Submission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (!assignmentId || !token) {
      setLoading(false);
      setError("Assignment ID or authentication token is missing.");
      return;
    }

    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (courseId) {
          const course = await CourseService.getCourseById(Number(courseId), token);
          const foundAssignment = course.materials.find(
            (m) =>
              m.materialId === Number(assignmentId) &&
              m.type === "ACTIVITY" && "activityType" in m && m.activityType === "ASSIGNMENT"
          ) as AssignmentMaterial | undefined;

          if (foundAssignment) setAssignment(foundAssignment);
          else throw new Error("Assignment not found in this course.");
        } else {
          throw new Error("Course ID is missing from URL.");
        }
        
        // FIX: Corrected method name to match SubmissionService.ts
        const submissions = await SubmissionService.getSubmissionsByActivityId(assignmentId, token);

        // FIX: Explicitly type the 'sub' parameter to avoid implicit 'any'
        const userSubmissions = submissions.filter((sub: Submission) => sub.studentId === user?.username);
        setPreviousSubmissions(userSubmissions);

      } catch (err) {
        console.error("Failed to load assignment details:", err);
        setError(err instanceof Error ? err.message : "Could not load assignment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [assignmentId, courseId, token, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !assignmentId || !token) {
      setError("Please select a file to submit.");
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = async () => {
    if (!selectedFile || !assignmentId || !token) {
      setError("Please select a file to submit.");
      return;
    }

    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // FIX: Corrected method name to match SubmissionService.ts
      const newSubmission = await SubmissionService.submitAssignment(
        assignmentId,
        selectedFile,
        token
      );

      setPreviousSubmissions([newSubmission, ...previousSubmissions]);
      setSuccess("Assignment submitted successfully!");
      setSelectedFile(null);
      
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmission = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="w-10/12 mx-auto my-8 p-4 text-center alert alert-error"><p>{error}</p></div>
    );
  }

  if (!assignment) {
    return (
      <div className="w-10/12 mx-auto my-8 p-4 text-center"><p>Assignment could not be found.</p></div>
    );
  }
  
  const latestSubmission = previousSubmissions[0];

  return (
    <div className="p-4 sm:p-6 w-11/12 md:w-10/12 lg:w-8/12 mx-auto bg-base-100 shadow-xl rounded-lg my-8">
      
      {courseId && (
          <Link href={`/student/course?id=${courseId}`} className="btn btn-ghost btn-sm mb-4">← Back to Course</Link>
      )}

      <div className="border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
          <p className="text-neutral-500">
              {/* FIX: Added a check for assignment.endDate before using it */}
              Due: {assignment.endDate ? new Date(assignment.endDate).toLocaleString() : 'Not set'} | Max Marks: {assignment.maxMarks}
          </p>
          <div className="prose mt-4">
              <p>{assignment.description}</p>
              <p><strong>Instructions:</strong> {assignment.instruction}</p>
          </div>
      </div>

      <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Submission Status</h2>
          {latestSubmission ? (
              <div className={`alert ${latestSubmission.status === 'GRADED' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'} border rounded-lg`}>
                  <div>
                      <h3 className="font-bold">Status: {latestSubmission.status}</h3>
                      <p>Submitted on: {new Date(latestSubmission.submissionDate).toLocaleString()}</p>
                      {latestSubmission.status === 'GRADED' && (
                          <>
                              <p>Grade: {latestSubmission.marksObtained} / {assignment.maxMarks}</p>
                              <p>Feedback: {latestSubmission.feedback || "No feedback provided."}</p>
                          </>
                      )}
                  </div>
              </div>
          ) : (
              <div className="alert bg-red-100 border-red-200 text-red-800">
                  <div>
                      <h3 className="font-bold">Not Submitted</h3>
                      <p>You have not submitted this assignment yet.</p>
                  </div>
              </div>
          )}
      </div>

      <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Add Submission</h2>
          <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-base-200 space-y-4">
              <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium mb-2">Select file</label>
                  <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered file-input-primary w-full max-w-md"
                      aria-describedby="file-help-text"
                  />
                  <p id="file-help-text" className="text-xs text-neutral-500 mt-1">
                      Allowed types: {assignment.allowedFileTypes || 'Any'}. Max size: {(assignment.maxFileSize / 1024 / 1024).toFixed(2)} MB.
                  </p>
                  {selectedFile && <p className="text-sm font-semibold mt-2">Selected: {selectedFile.name}</p>}
              </div>

              {error && <div className="alert alert-error text-sm"><p>{error}</p></div>}
              {success && <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm"><p>{success}</p></div>}

              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedFile || isSubmitting}
              >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Submit Assignment"}
              </button>
          </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Assignment Submission"
        message={`Are you sure you want to submit "${selectedFile?.name}"? Once submitted, you can view your submission status above.`}
        onConfirm={handleConfirmSubmission}
        onCancel={handleCancelSubmission}
        confirmText="Yes, Submit"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

// Wrapper component with Suspense
const AssignmentSubmissionPage = () => (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}>
      <AssignmentSubmissionPageComponent />
    </Suspense>
);
  
export default AssignmentSubmissionPage;