import { Lecture, LectureCreate } from "@/types/Lecture";

// ! API configuration for lecture endpoints
// ! Ensures consistent API URL handling across environments
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const LECTURE_API_URL = `${API_BASE_URL}/courses`;

// ! Service for managing lecture-related API operations
// ! Provides comprehensive CRUD functionality for lecture resources
export const LectureService = {
  // * Retrieves all lectures for a specific course
  // * Used in course detail pages to display lecture listings
  async getLecturesByCourseId(
    courseId: number,
    token: string,
  ): Promise<Lecture[]> {
    const response = await fetch(`${LECTURE_API_URL}/${courseId}/lectures`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch lectures");
    }
    return response.json();
  },

  // * Fetches detailed information for a specific lecture
  // * Used when viewing individual lecture materials and content
  async getLectureById(
    courseId: number,
    lectureId: number,
    token: string,
  ): Promise<Lecture> {
    const response = await fetch(
      `${LECTURE_API_URL}/${courseId}/lectures/${lectureId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch lecture");
    }
    return response.json();
  },

  // * Creates a new lecture for a specific course
  // * Used by faculty to add lecture content to their courses
  async createLecture(
    courseId: number,
    lectureData: LectureCreate,
    token: string,
  ): Promise<Lecture> {
    const response = await fetch(`${LECTURE_API_URL}/${courseId}/lectures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lectureData),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Create lecture error:", errorBody);
      throw new Error(`Failed to create lecture: ${response.statusText}`);
    }
    return response.json();
  },

  // * Updates an existing lecture with new content or metadata
  // * Allows faculty to modify lecture materials as needed
  // * Note: This requires courseId which should be stored with the lecture
  async updateLecture(
    lectureId: number,
    lectureData: Partial<LectureCreate>,
    token: string,
    courseId?: number,
  ): Promise<Lecture> {
    if (!courseId) {
      throw new Error("Course ID is required for lecture updates");
    }
    const response = await fetch(
      `${LECTURE_API_URL}/${courseId}/lectures/${lectureId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lectureData),
      },
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Update lecture error:", errorBody);
      throw new Error(`Failed to update lecture: ${response.statusText}`);
    }
    return response.json();
  },

  // * Removes a lecture from a course permanently
  // * Used when faculty needs to delete outdated content
  async deleteLecture(
    lectureId: number,
    token: string,
    courseId?: number,
  ): Promise<void> {
    if (!courseId) {
      throw new Error("Course ID is required for lecture deletion");
    }
    const response = await fetch(
      `${LECTURE_API_URL}/${courseId}/lectures/${lectureId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete lecture");
    }
  },

  // TODO: Add functionality for scheduling recurring lectures
};
