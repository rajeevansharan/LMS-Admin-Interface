import { StudentParticipant } from "@/types/Student";

// API base URL configuration from environment or fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Service for handling course participant-related API operations
 */
export const ParticipantsService = {
  /**
   * Get all participants (students) for a specific course
   *
   * @param courseId - The ID of the course
   * @param token - Authentication token for authorization
   * @returns Promise with array of student participants
   */
  getCourseParticipants: async (
    courseId: string,
    token: string,
  ): Promise<StudentParticipant[]> => {
    const response = await fetch(
      `${API_URL}/api/courses/${courseId}/participants`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch participants: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },
};
