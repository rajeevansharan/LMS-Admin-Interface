// src/services/QuizService.ts

import { Quiz, QuizCreatePayload } from "@/types/Quiz";
import { QuizSubmission } from "@/types/QuizAttempt";
import { Submission } from "@/types/Submission";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const QuizService = {
  /**
   * Creates a new quiz for a specific course. (Lecturer-facing)
   */
  createQuiz: async (
    courseId: number,
    payload: QuizCreatePayload,
    token: string,
  ): Promise<Quiz> => {
    if (courseId !== payload.courseId) {
      throw new Error("Mismatch between courseId in URL and payload.");
    }
    const response = await fetch(`${API_URL}/api/courses/${courseId}/quizzes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create quiz. Server response:", errorText);
      throw new Error(
        `Failed to create quiz: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
    return response.json();
  },

  /**
   * Fetches a specific quiz by its ID.
   */
  getQuizById: async (quizId: number, token: string): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch quiz. Server response:", errorText);
      throw new Error(
        `Failed to fetch quiz: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
    return response.json();
  },

  /**
   * Updates an existing quiz. (Lecturer-facing)
   */
  updateQuiz: async (
    quizId: number,
    payload: QuizCreatePayload,
    token: string,
  ): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update quiz. Server response:", errorText);
      throw new Error(
        `Failed to update quiz: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
    return response.json();
  },

  /**
   * Deletes a quiz by its ID. (Lecturer-facing)
   */
  deleteQuiz: async (quizId: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to delete quiz. Server response:", errorText);
      throw new Error(
        `Failed to delete quiz: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
  },

  /**
   * Submits a student's completed quiz attempt.
   */
  submitQuizAttempt: async (
    quizId: number,
    payload: QuizSubmission,
    token: string,
  ): Promise<Submission> => {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to submit quiz attempt. Server response:",
        errorText,
      );
      throw new Error(
        `Failed to submit quiz attempt: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
    return response.json();
  },
};
