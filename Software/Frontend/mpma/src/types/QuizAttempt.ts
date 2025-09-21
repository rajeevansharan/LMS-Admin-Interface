// src/types/QuizAttempt.ts

// ==========================================================
// Types for SUBMITTING a New Quiz Attempt
// These define the shape of the data sent TO the backend.
// ==========================================================

/**
 * Represents a student's answer to a single question.
 * This is sent to the backend.
 */
export interface StudentAnswer {
  questionId: number;
  selectedOptionIds?: number[]; // Used for Multiple/Single choice questions
  textAnswer?: string; // Used for Short Answer/Essay questions
}

/**
 * Represents the entire collection of answers for a quiz submission.
 * This is the main payload for the POST /api/quizzes/{quizId}/submit endpoint.
 */
export interface QuizSubmission {
  answers: StudentAnswer[];
}

// ==========================================================
// Types for REVIEWING a Completed Quiz Attempt
// These define the shape of the data received FROM the backend.
// (Your existing code, preserved and documented)
// ==========================================================

/**
 * Defines the structure for a detailed review of a single question
 * after a quiz has been graded.
 */
export interface QuestionReview {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksObtained: number;
}

/**

 * Defines the structure for a full, detailed quiz attempt review,
 * typically received from an endpoint like /api/submissions/{submissionId}/review.
 */
export interface QuizAttemptDetail {
  studentName: string;
  quizTitle: string;
  totalMarks: number;
  questions: QuestionReview[];
}
