import { QuestionDTO } from "@/types/QuestionDTO";

/**
 * Service for interacting with the Question Bank API
 * Provides methods for fetching and managing questions across different scopes:
 * - Lecturer-specific questions
 * - Global question bank
 * - Course-specific questions
 */
export class QuestionBankService {
  /**
   * Retrieves all questions available to a specific lecturer
   * This includes both questions from their courses and global questions
   *
   * @param lecturerId The ID of the lecturer
   * @param token Authentication token
   * @returns Promise resolving to an array of questions available to the lecturer
   * @throws Error if API call fails or returns an error status
   */
  static async getQuestionsByLecturerId(
    lecturerId: number,
    token: string,
  ): Promise<QuestionDTO[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/lecturer/${lecturerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching lecturer questions:", error);
      throw error;
    }
  }

  /**
   * Retrieves all global questions (not tied to any course)
   * @param token Authentication token
   * @returns Promise resolving to an array of global questions
   * @throws Error if API call fails or returns an error status
   */
  static async getGlobalQuestions(token: string): Promise<QuestionDTO[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/global`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching global questions:", error);
      throw error;
    }
  }

  /**
   * Retrieves questions by course ID
   * @param courseId The ID of the course
   * @param token Authentication token
   * @returns Promise resolving to an array of questions for the specified course
   * @throws Error if API call fails or returns an error status
   */
  static async getQuestionsByCourseId(
    courseId: number,
    token: string,
  ): Promise<QuestionDTO[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching course questions:", error);
      throw error;
    }
  }

  /**
   * Creates a new question
   * @param questionData The question data to create
   * @param token Authentication token
   * @returns Promise resolving to the created question
   * @throws Error if API call fails or returns an error status
   */
  static async createQuestion(
    questionData: QuestionDTO,
    token: string,
  ): Promise<QuestionDTO> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  }

  /**
   * Deletes a question by ID
   * @param questionId The ID of the question to delete
   * @param token Authentication token
   * @returns Promise resolving to true if deletion was successful
   * @throws Error if API call fails or returns an error status
   */
  static async deleteQuestion(
    questionId: number,
    token: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }

  /**
   * Retrieves all questions of a specific type
   * @param questionType The question type (TRUE_FALSE, SINGLE_CHOICE, etc.)
   * @param token Authentication token
   * @returns Promise resolving to an array of questions of the specified type
   * @throws Error if API call fails or returns an error status
   */
  static async getQuestionsByType(
    questionType: string,
    token: string,
  ): Promise<QuestionDTO[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/type/${questionType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${questionType} questions:`, error);
      throw error;
    }
  }

  /**
   * Retrieves all questions of a specific type available to a lecturer
   * @param lecturerId The ID of the lecturer
   * @param questionType The question type (TRUE_FALSE, SINGLE_CHOICE, etc.)
   * @param token Authentication token
   * @returns Promise resolving to an array of questions of the specified type for the lecturer
   * @throws Error if API call fails or returns an error status
   */
  static async getQuestionsByLecturerIdAndType(
    lecturerId: number,
    questionType: string,
    token: string,
  ): Promise<QuestionDTO[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/lecturer/${lecturerId}/type/${questionType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching ${questionType} questions for lecturer ${lecturerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Updates an existing question
   * @param questionId The ID of the question to update
   * @param questionData The updated question data
   * @param token Authentication token
   * @returns Promise resolving to the updated question
   * @throws Error if API call fails or returns an error status
   */
  static async updateQuestion(
    questionId: number,
    questionData: QuestionDTO,
    token: string,
  ): Promise<QuestionDTO> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  }

  /**
   * Retrieves a question by its ID
   * @param questionId The ID of the question
   * @param token Authentication token
   * @returns Promise resolving to the question
   * @throws Error if API call fails or returns an error status
   */
  static async getQuestionById(
    questionId: number,
    token: string,
  ): Promise<QuestionDTO> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching question ${questionId}:`, error);
      throw error;
    }
  }
}
