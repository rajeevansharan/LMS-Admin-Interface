/**
 * Enum representing the different types of questions supported in the system
 */
export enum QuestionType {
  TRUE_FALSE = "TRUE_FALSE",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
  ESSAY = "ESSAY",
}

/**
 * Interface representing a question data transfer object
 */
export interface QuestionDTO {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  difficultyLevel?: string;
  marks?: number;
  courseId?: number; // Optional, allowing questions to be in the global bank

  // Type-specific fields
  correctAnswerTF?: boolean;
  optionsSCMC?: string[];
  correctOptionIndexSC?: number;
  correctOptionIndicesMC?: number[];
  correctAnswerSA?: string;
  caseSensitiveSA?: boolean;
  answerGuidelinesES?: string;
  wordLimitES?: number;

  // Timestamp fields
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface for grouping questions by course
 */
export interface QuestionsByCategory {
  categoryName: string;
  categoryId?: number;
  questions: QuestionDTO[];
  isExpanded?: boolean;
}
