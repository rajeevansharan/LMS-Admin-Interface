import { Course } from "@/types/Course";

// ! API configuration for student endpoints
// ! Ensures consistent API URL handling across environments
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ! Service for managing student-related API operations
export const StudentService = {
  /**
   * Fetches the courses that a specific student is enrolled in.
   * Uses the /api/courses/student/{studentId} endpoint.
   *
   * @param studentId The ID of the student.
   * @param token The authentication token.
   * @returns A promise that resolves to an array of Course objects.
   */
  getEnrolledCourses: async (
    studentId: number,
    token: string,
  ): Promise<Course[]> => {
    const response = await fetch(
      `${API_URL}/api/courses/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch enrolled courses: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  },
};
