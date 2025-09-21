// src/types/Quiz.ts

// ADDED: This new interface is required to define the shape of a single answer option.
export interface Option {
  id: number;
  text: string;
}

// In types/Quiz.ts

// A simplified type for question info, matching our backend QuestionInfoDTO
export interface QuestionInfo {
  id: number;
  questionText: string;
  // MODIFIED: Changed to a specific union type for better type-safety in components.
  questionType: 'TRUE_FALSE' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'ESSAY';
  marks: number;
  // ADDED: This is the most crucial change. It allows us to receive and display the options for a question.
  options: Option[] | null;
}

// The shape of a full Quiz object received from the backend, matching QuizDTO
// Your existing interface is good, no changes needed here.
export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: string | null; // Assuming time is a string like "HH:mm:ss"
  maxAttempts: number;
  shuffleQuestions: boolean;
  questions: QuestionInfo[];
  // Added fields that might be included in the backend response
  maxMarks?: number;
  passMark?: number;
  weight?: number;
  visible?: boolean;
  courseId?: number;
}

// The shape of the data we send to the backend to create a quiz.
// This interface is for the lecturer's "Create Quiz" form and can remain as is.
export interface QuizCreatePayload {
  // Original fields
  title: string;
  description: string;
  questionIds: number[];

  // --- NEW REQUIRED FIELDS ---
  // We need to get the course ID, likely from the URL in the component
  courseId: number;

  // This will be a toggle or checkbox in the UI
  visible: boolean;

  // These are required fields from the Activity class
  maxMarks: number;
  passMark: number;
  weight: number;

  // --- OPTIONAL/DEFAULTED FIELDS ---
  // The '?' makes them optional in TypeScript. The backend will use defaults if not provided.
  timeLimit?: string | null;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
}