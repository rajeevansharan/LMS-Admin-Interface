// src/services/SubmissionService.ts

// MODIFIED: Added QuizSubmission to the imports
import { Submission } from "@/types/Submission";
import { GradeSubmissionPayload } from "@/types/Gradebook";
import { QuizSubmission, QuizAttemptDetail } from "@/types/QuizAttempt"; // Assuming QuizAttemptDetail is also in this file

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- EXISTING METHODS FROM YOUR PROJECT ---

const getSubmissionsByActivityId = async (
  activityId: string,
  token: string,
): Promise<Submission[]> => {
  const response = await fetch(`${API_URL}/api/submissions/activity/${activityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch submissions");
  return response.json();
};

const gradeSubmission = async (
  submissionId: number,
  payload: GradeSubmissionPayload,
  token: string,
): Promise<Submission> => { // Added return type for consistency
  const response = await fetch(`${API_URL}/api/submissions/${submissionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to grade submission");
  return response.json();
};

const getQuizAttemptDetails = async (submissionId: number, token: string): Promise<QuizAttemptDetail> => { // Added return type
  const response = await fetch(`${API_URL}/api/submissions/${submissionId}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch quiz details");
  return response.json();
};

const submitAssignment = async (
  assignmentId: string,
  file: File,
  token: string,
): Promise<Submission> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/submissions/assignment/${assignmentId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit assignment: ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

// --- NEW FUNCTION FOR QUIZ SUBMISSION ---

/**
 * Submits a student's completed quiz answers.
 * @param quizId The ID of the quiz being attempted.
 * @param payload The student's answers in the required QuizSubmission format.
 * @param token The authentication token for the request.
 * @returns A Promise with the data of the newly created submission record.
 */
const submitQuizAttempt = async (
  quizId: number,
  payload: QuizSubmission,
  token: string,
): Promise<Submission> => {
  const response = await fetch(`${API_URL}/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit quiz: ${response.statusText} - ${errorText}`);
  }

  return response.json();
};


// --- EXPORTING ALL METHODS TOGETHER ---

export const SubmissionService = {
  getSubmissionsByActivityId,
  gradeSubmission,
  getQuizAttemptDetails,
  submitAssignment,
  submitQuizAttempt, // The new function is now exported
};