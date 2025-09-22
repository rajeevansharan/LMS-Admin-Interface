import { Course } from "@/types/Course";
import { Activity } from "@/types/Activity";
import { StudentGradebook } from "@/types/Gradebook";

// ! API base URL configuration from environment or fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ! Course service for handling course-related API operations
// ! This service is the primary interface for course data management
export const CourseService = {
  /**
   * Get all courses
   * @param token - Authentication token
   * @returns Promise with array of courses
   */
  // * Fetches complete list of courses from the backend
  // * Requires valid authentication token for authorization
  getAllCourses: async (token: string): Promise<Course[]> => {
    const response = await fetch(`${API_URL}/api/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch courses: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get courses by lecturer ID
   * @param lecturerId - The ID of the lecturer
   * @param token - Authentication token
   * @returns Promise with array of courses taught by the lecturer
   */
  // * Fetches courses specifically assigned to a particular lecturer
  // * Used in faculty member dashboard to show lecturer-specific courses
  getCoursesByLecturerId: async (
    lecturerId: number,
    token: string,
  ): Promise<Course[]> => {
    const response = await fetch(
      `${API_URL}/api/courses/lecturer/${lecturerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch lecturer courses: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get course by ID
   * @param courseId - The ID of the course
   * @param token - Authentication token
   * @returns Promise with course details
   */
  // * Retrieves detailed information for a specific course
  // * Used when viewing individual course pages and management
  getCourseById: async (courseId: number, token: string): Promise<Course> => {
    const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch course details: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get all gradable activities for a specific course.
   * @param courseId - The ID of the course.
   * @param token - Authentication token.
   * @returns Promise with an array of activities.
   */
  getCourseActivities: async (
    courseId: string,
    token: string,
  ): Promise<Activity[]> => {
    const response = await fetch(
      `${API_URL}/api/courses/${courseId}/activities`, // Calling our new endpoint
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch course activities: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },
  /**
   * Get the full gradebook for a course.
   * @param courseId - The ID of the course.
   * @param token - Authentication token.
   * @returns Promise with the complete gradebook data.
   */
  getCourseGradebook: async (
    courseId: string,
    token: string,
  ): Promise<StudentGradebook[]> => {
    const response = await fetch(
      `${API_URL}/api/courses/${courseId}/gradebook`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch course gradebook: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  createAssignment: async (
    courseId: string,
    payload: AssignmentCreatePayload,
    token: string,
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/api/courses/${courseId}/assignments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create assignment");
    }
  },

  updateAssignment: async (
    assignmentId: string,
    payload: AssignmentCreatePayload,
    token: string,
  ): Promise<void> => {
    // For now, we'll need to determine the courseId from the assignment
    // This might need backend endpoint adjustment or courseId parameter
    const response = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update assignment");
    }
  },

  // TODO: Implement CRUD operations for course management (create, update, delete)
  // TODO: Add support for course enrollment and withdrawal operations
};

export interface AssignmentCreatePayload {
  title: string;
  description: string;
  visible: boolean;
  endDate: string; // ISO date string
  maxMarks: number;
  passMark: number;
  weight: number;
  instruction: string;
  allowedFileTypes: string;
  maxFileSize: number;
  maxFileCount: number;
}
